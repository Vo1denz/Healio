"use client";
import React, { useEffect } from 'react'
import Navbar from "@/app/(landing-page)/components/Navbar";

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
    </div>
  );
};

export default Page;