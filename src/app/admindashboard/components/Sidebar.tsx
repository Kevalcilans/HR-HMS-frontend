"use client";
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from "next/link";
import { NavbarMenu } from "@/app/constent/navbarMenu";
import Logout from "@/app/servercoponent/logout";
import Image from "next/image";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // const Logoutfn = ()=>{
  //   Logout()
  //   window.location.href = "/login"
  // }
  const Logoutfn = () => {
    
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    
  
    if (isConfirmed) {
      Logout(); 
      window.location.href = "/login"; 
    }
  }

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[268px]' : 'w-16'
      } bg-gradient-to-b  text-white h-screen flex flex-col shadow-lg bg-[#07549E]`}
    >
      <div className="p-4 flex items-center justify-between border-b border-blue-700 ">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <i className="fas fa-bars text-xl"></i>
        </button>
        {isOpen && (
           <span className="text-lg font-bold"><Image src="/image.png" alt="Description of image" width={100} height={100} /></span>
        )}
      </div>

      <nav className="flex-1 space-y-1 mt-4">
        {NavbarMenu.map((item, index) => (
          item.link ? (
            <Link
              href={item.link}
              key={index}
              className="flex items-center p-2 mx-2 rounded-lg pb-6 hover:bg-[#1B2949] hover:shadow-md transition-all duration-300"
            >
              <i className={`${item.icon} mr-4 text-lg `}></i>
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <div
              key={index}
              className="flex items-center p-2 mx-2 rounded-lg opacity-50"
            >
              <i className={`${item.icon} mr-4 text-lg`}></i>
              <span
                className={`text-sm font-semibold transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {item.label} (Link not defined)
              </span>
            </div>
          )
        ))}
         <button
              className="flex items-center w-full  p-2 mx-2 rounded-lg pb-6 hover:bg-[#1B2949] hover:shadow-md transition-all duration-300"
              onClick={()=>Logoutfn()}
            >
              <i className="fa fa-sign-out text-2xl pr-4"></i>
              <span
                className={`text-sm font-medium transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}
              >
               Logout
              </span>
        </button> 
      </nav>
    </div>
  );
};

export default Sidebar;
