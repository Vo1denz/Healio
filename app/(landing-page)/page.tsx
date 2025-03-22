"use client";

import Navbar from "@/app/(landing-page)/components/Navbar";
import React, { useEffect } from "react";
import LandingPage from "./components/LandingPade";
import Marquee from "./components/Marquee";

const Page = () => {
  useEffect(() => {
    const loadLocomotiveScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();
    };

    loadLocomotiveScroll();
  }, []);

  return (
    <div className="w-full min-h-screen text-white" style={{ backgroundColor: "#E5F4DD" }}>
      <Navbar />
      <LandingPage />
      <Marquee />
    </div>
  );
};

export default Page;