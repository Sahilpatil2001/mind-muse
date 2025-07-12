import React, { useState } from "react";
import FormInput from "../components/FormInput"; // adjust path if needed
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/ToastHelper";

const LoginForm = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails((prevObj) => ({
      ...prevObj,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDetails),
      });

      // Try parsing response JSON early to access `message` or `token`
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        // Use server error message if provided
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token) {
        throw new Error("Token not received from server.");
      }

      // ✅ Store token properly
      localStorage.setItem("token", data.token);

      showSuccessToast("Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.message);
      showErrorToast(error.message);
    }
  };

  return (
    <section className="w-full ">
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
            />
            <FormInput
              onChange={handleLoginChange}
              placeholder="Enter Your Password"
              type="password"
              name="password"
              value={loginDetails.password}
            />

            <div className="flex flex-col gap-5 items-center">
              <Button type="submit" className="w-full px-40">
                Login
              </Button>
              <h1 className="text-center text-xl font-medium">OR</h1>
              <p>
                Don't have an account ?
                <span
                  onClick={() => navigate("/register")}
                  className="text-blue-500 font-medium cursor-pointer ml-2"
                  Link
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
