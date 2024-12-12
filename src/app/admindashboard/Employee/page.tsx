"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllLeaves from "@/app/servercoponent/GetallLeaves";
import GetAllEmp from "@/app/servercoponent/Getallusers";
import AddPartnersPopup from "./popup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GetAllDepartment from "@/app/servercoponent/GetallDepartment";


// Types for leave requests
interface LeaveRequest {
    leave_request_id: number;
    start_date: string;
    end_date: string;
    leave_days: number;
    status: string;
    reason: string;
    isUnpaid: boolean;
    user: {
        first_name: string;
        last_name: string;
    };
}



const Employee = () => {


    const [leaveRequests, setLeaveRequests] = useState<any>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [item,setitem] =  useState([])

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    const route = useRouter();


    const fetchLeaveRequests = async () => {
        try {
            const response = await GetAllEmp();
            if (response?.error) {
                toast.error(response.error, { position: "top-center" });
                return;
            }
            console.log("user data is comming")
            console.log(response?.data)
            setLeaveRequests(response?.data || []);
        } catch (error) {
            console.error("Error fetching leave requests:", error);
            toast.error("An error occurred while fetching leave requests.", {
                position: "top-center",
            });
        }
    };


    const updateLeaveStatus = async (status: string, id: number) => {
        try {
            //   const token = Cookies.get("sessionToken");
            //   if (!token) {
            //     throw new Error("No token found in cookies");
            //   }

            const response = await fetch(`http://localhost:3000/approvedleave/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsIlJvbGUiOiJhZG1pbiIsImlhdCI6MTczMjE2Njk1MywiZXhwIjoxNzMyMTcwNTUzfQ.oWK03dUrfi7F9eyqQw6Yzq8o3TFIEvXj96GZ7HiVH20`,
                },
                body: JSON.stringify({ status }),
            });

            const result = await response.json();
            if (result.error) {
                toast.error(result.error, { position: "top-center" });
                return;
            }


            setLeaveRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.leave_request_id === id
                        ? { ...request, status }
                        : request
                )
            );

            toast.success(result.message || "Status updated successfully!", {
                position: "top-center",
            });
        } catch (error) {
            console.error("Error updating leave status:", error);
            toast.error("An error occurred while updating leave status.", {
                position: "top-center",
            });
        }
    };


   


    

    // async function sendMail(email: any) {
    //     const url = "http://localhost:3000/sendmail";
    //     const emailPayload = {
    //         to: `${email}`,
    //         subject: "confrim leave Request",
    //         text: "Thank you for signing up! We’re excited to have you onboard.",
    //         html: "<p>Your leave is approved</p>"
    //     };

    //     try {
    //         const response = await fetch(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(emailPayload),
    //         });

    //         if (!response.ok) {
    //             const error = await response.json();
    //             throw new Error(`Error: ${error.message}`);
    //         }

    //         const data = await response.json();
    //         console.log("Email sent successfully:", data);

    //     } catch (error) {
    //         console.error("Error sending email:", error);

    //     }
    // }
    //display all department
    async function getALLdepartment() {
        try {
          const response = await GetAllDepartment();
          console.log("Login response:", response);
    
          if (response.error) {
            // Handle errors returned from the server
            toast.error(response.error, { position: 'top-center' });
            return;
          }
    
          if (response?.data?.status === "error") {
    
            toast.error(response?.data?.message, { position: 'top-center' });
    
          } else {
            console.log("department is comming")
            console.log(response.data)
            // toast.success(response?.message || "Login successful!", { position: 'top-center' });
            setitem(response?.data)
    
           
    
    
          }
        } catch (error) {
          console.error("Error during login:", error);
          toast.error("An error occurred. Please try again.", { position: 'top-center' });
        }
      }
      useEffect(() => {
        fetchLeaveRequests();
        getALLdepartment();
    }, []);
      

    return (
        <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-blue-900">All Employee</h1>
                <button
                    className="bg-[#07549E] text-white font-semibold rounded-md m-2 p-2 px-4"
                    onClick={openPopup}
                >
                    Create Employee
                </button>
                <AddPartnersPopup
                    //@ts-ignore
                    isOpen={isPopupOpen} onClose={closePopup} setitems={setLeaveRequests} departmentdata={item} />

            </div>

            <div className="bg-white shadow-md overflow-scroll">
                <table className="min-w-full table-auto">
                    {/* Table Header */}
                    <thead>
                        <tr className="bg-[#07549E] text-white font-medium">
                            <th className="py-3 px-4 text-center">Sr No</th>
                            <th className="py-3 px-4 text-center">Employee Id</th>
                            <th className="py-3 px-4 text-center">First Name</th>
                            <th className="py-3 px-4 text-center">Last Name</th>
                            <th className="py-3 px-4 text-center">Email</th>
                            {/* <th className="py-3 px-4 text-center sm:hidden md:table-cell">Department</th> */}
                            {/* <th className="py-3 px-4 text-center sm:hidden md:table-cell">Leave Balance</th> */}
                            <th className="py-3 px-4 text-center">joining Date</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {leaveRequests
                            .filter((item) => item.role !== "admin")
                            .map((request, index) => (
                                <tr
                                    key={request?.user_id}
                                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                                        } hover:bg-blue-100 transition`}
                                >
                                  
                                    <td className="py-3 px-4 text-center">{index + 1}</td>
                                    <td className="py-3 px-4 text-center">{request.emp_id}</td>
                                    
                                    
                                    <td onClick={()=>route.push( `/admindashboard/employedetails?search=${request?.user_id}`)}  className="py-3 px-4 text-center">
                                        {request?.first_name}
                                    </td>
                                  

                                    <td className="py-3 px-4 text-center">{request?.last_name}</td>
                                    <td className="py-3 px-4 text-center">{request?.email}</td>
                                    {/* <td className="py-3 px-4 text-center sm:hidden md:table-cell">{request?.department?.department_id}</td> */}
                                    {/* <td className="py-3 px-4 text-center sm:hidden md:table-cell">{request?.leave_balance}</td> */}
                                    <td className="py-3 px-4 text-center">
                                        {new Date(request?.hire_date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Employee;

