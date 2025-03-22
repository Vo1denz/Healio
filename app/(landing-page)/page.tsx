"use client";

import Navbar from "@/app/(landing-page)/components/Navbar";
import React from "react";
import About from "./components/About";
import Featured from "./components/Featured";
import LandingPage from "./components/LandingPage";
import Marquee from "./components/Marquee";
import Eyes from "./components/Eyes";
import Footer from "./components/Footer";
import Steps from "./components/Steps";

const Page = () => {

  return (
    <div className="w-full min-h-screen text-white" style={{ backgroundColor: "#E5F4DD" }}>
      <Navbar />
      <LandingPage />
      <Marquee />
      <About />
      <Eyes />
      <Featured />
      <Steps />
      <Footer />
    </div>
  );
};

export default Page;