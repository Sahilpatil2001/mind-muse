import type { FC, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button.tsx";
import { showSuccessToast, showErrorToast } from "../utils/toastHelper.tsx";
import type { LoginDetails } from "../types/auth/Login.ts";

const LoginForm: FC = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
    const BASE_URL = "http://localhost:8000";

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token) {
        throw new Error("Token not received from server.");
      }

      localStorage.setItem("token", data.token);

      showSuccessToast("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error.message);
      showErrorToast(error.message || "Something went wrong.");
    }
  };

  return (
    <section className="w-full">
      <form
        onSubmit={handleLogin}
        className="w-full flex flex-col h-screen justify-center items-center"
      >
        <div className="w-[60%]">
          <h1 className="text-3xl font-medium text-center mb-9">Login</h1>

          <div className="w-full flex flex-col items-center gap-8">
            <FormInput
              onChange={handleLoginChange}
              placeholder="Enter your Email"
              type="email"
              name="email"
              value={loginDetails.email}
              className="w-[40%]"
            />
            <FormInput
              onChange={handleLoginChange}
              placeholder="Enter Your Password"
              type="password"
              name="password"
              value={loginDetails.password}
              className="w-[40%]"
            />

            <div className="flex flex-col gap-5 items-center">
              <Button type="submit" className="w-full px-40">
                Login
              </Button>
              <h1 className="text-center text-xl font-medium">OR</h1>
              <p>
                Don't have an account?
                <span
                  onClick={() => navigate("/register")}
                  className="text-violet-500 font-medium cursor-pointer ml-2"
                >
                  Register Here
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
