// src/pages/Home.jsx
import React from "react";
import MainSection from "../components/MainSection";

const Home = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return <MainSection BASE_URL={BASE_URL} />;
};

export default Home;
