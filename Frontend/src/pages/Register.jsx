import React, { useState } from "react";
// import { toast } from "react-toastify";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/ToastHelper";

const Register = () => {
  // setting state variable for storing user Details
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
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

  // form handle function for handling user Details
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Send userDetails to Backend
  const formHandle = async (event) => {
    event.preventDefault();

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

      // ✅ Registration successful
      console.log("User registered:", data);
      showSuccessToast("🎉 Registered successfully!");

      navigate("/login"); //  navigate to login
      // to reset the form fields after registration
      setUserDetails({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        gender: "",
      });
    } catch (error) {
      showErrorToast(error.message || "Something went wrong!");
      console.error("Error during registration:", error.message);
    }
  };

  return (
    <>
      <section className="w-full">
        <form
          onSubmit={formHandle}
          className="w-full flex justify-center h-screen items-center]"
        >
          <div className="w-[60%] flex flex-col justify-center items-center gap-8 ">
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
                <option value="Male" className="bg-[#030014]">
                  Male
                </option>
                <option value="Female" className="bg-[#030014]">
                  Female
                </option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-5 items-center ">
              <Button className="px-40 ">Register</Button>
              <h1 className="text-center text-xl font-medium">OR</h1>
              <Button onClick={navigateLogin} className="px-40">
                Login
              </Button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Register;
