"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import LoginUser from './loginpage';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link';


const Login = () => {
  interface Login {
    email: string;
    password: string;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<Login>();


  const onSubmit = async (data: any) => {
    console.log("Form data submitted:", data);
    try {
        const response = await LoginUser(data);
  
        if (response?.error) {
          // Handle errors returned from the server
          toast.error(response?.error, { position: 'top-center' });
          return;
        }
  
        if (response?.data?.status === "error") {
          toast.error(response?.data?.message, { position: 'top-center' });
          window.location.href = "/login"
        } else {
          toast.success(response?.message || "Login successful!", { position: 'top-center' });
          localStorage.setItem("token", response?.data?.token);
          if(response.data.role == "admin")
          {
            window.location.href = "/admindashboard"
          }
          else{
            window.location.href = "/employedashboard"
          }
          
          //Redirect user to the home page after successful login
          // setTimeout(() => router.push("home"), 3000);

        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An error occurred. Please try again.", { position: 'top-center' });
      }

    // Here you can handle form submission (e.g., redirect or validate)
    // For now, just redirect to dashboard
    
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login Page</h1>

            <div className="w-full flex-1 mt-8">
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">

                </div>
              </div>

              <div className="mx-auto max-w-xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      }
                    })}
                  />
                  {errors.email && <span>{errors.email.message}</span>}

                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long',
                      }
                    })}
                  />
                  {errors.password && <span>{errors.password.message}</span>}

                  <button 
                    type="submit" 
                    className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Login</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
