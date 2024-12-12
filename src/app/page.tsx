"use client"
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

export default function Home() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    // Check if the screen width is below a typical desktop width (e.g., 1024px)
    const checkDevice = () => {
      const isMobile = window.innerWidth <= 1024; // You can adjust this breakpoint as needed
      setIsMobileDevice(isMobile);
    };

    // Initial check
    checkDevice();

    // Add event listener to detect screen size changes
    window.addEventListener("resize", checkDevice);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  if (isMobileDevice) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <h1>Please open this website on your PC.</h1>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to the Humane Resource Management System
      </h1>
      <p className="text-lg text-gray-600">
        Please go to the{' '}
        <a
          href="/login"
          className="text-blue-500 font-semibold hover:text-blue-700"
        >
          Login
        </a>{' '}
        page.
      </p>
    </div>
  );
}
