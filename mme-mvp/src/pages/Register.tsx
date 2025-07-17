import type { FC, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper.tsx";

type Gender = "Male" | "Female" | "";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  gender: Gender;
}

const Register: FC = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });

  const navigateLogin = () => {
    navigate("/login");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
    const BASE_URL = "http://localhost:8000";

    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      console.log("API response:", data);

      showSuccessToast("🎉 Registered successfully!");
      navigate("/login");
      console.log("Form submitted", userDetails);

      setUserDetails({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        gender: "",
      });
      if (
        !userDetails.firstName ||
        !userDetails.lastName ||
        !userDetails.email ||
        !userDetails.password ||
        !userDetails.dob ||
        !userDetails.gender
      ) {
        showErrorToast("Please fill all fields");
        return;
      }
    } catch (error: any) {
      showErrorToast(error.message || "Something went wrong!");
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <section className="w-full">
      <form
        onSubmit={formHandle}
        className="w-full flex justify-center h-screen items-center"
      >
        <div className="w-[60%] flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-medium text-center mb-3">
            Create Your Account
          </h1>

          <div className="flex w-full justify-center space-x-8">
            <FormInput
              onChange={handleChange}
              placeholder="Enter your First name"
              type="text"
              name="firstName"
              value={userDetails.firstName}
            />
            <FormInput
              onChange={handleChange}
              placeholder="Enter Your Last Name"
              type="text"
              name="lastName"
              value={userDetails.lastName}
            />
          </div>

          <div className="flex w-full justify-center space-x-8">
            <FormInput
              onChange={handleChange}
              placeholder="Enter Your Email"
              type="email"
              name="email"
              value={userDetails.email}
            />
            <FormInput
              onChange={handleChange}
              placeholder="Enter Your Password"
              type="password"
              name="password"
              value={userDetails.password}
            />
          </div>

          <div className="flex w-full justify-center space-x-8">
            <FormInput
              onChange={handleChange}
              placeholder="Date Of Birth"
              type="date"
              name="dob"
              value={userDetails.dob}
            />

            <select
              onChange={handleChange}
              name="gender"
              value={userDetails.gender}
              className="w-[40%] border border-[#fff9] py-4 px-4 rounded-[10px] outline-none indent-1"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male" className="bg-[#030014]">
                Male
              </option>
              <option value="Female" className="bg-[#030014]">
                Female
              </option>
            </select>
          </div>

          <div className="w-full flex flex-col gap-5 items-center">
            <Button type="submit" className="px-31">
              Register
            </Button>
            <h1 className="text-center text-xl font-medium">OR</h1>
            <Button onClick={navigateLogin} className="px-33">
              Login
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Register;
