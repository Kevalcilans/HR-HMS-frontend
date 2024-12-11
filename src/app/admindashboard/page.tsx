"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllLeaves from "@/app/servercoponent/GetallLeaves";
import AdmindashboardCount from "../servercoponent/countemployeeData";
import ApproveLeave from "../servercoponent/ApproveLeaves";
import Sendmail from "../servercoponent/sendmail";

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
    email: string;
  };
}

// Reusable StatCard component
const StatCard = ({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string | number;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="text-gray-500 text-xl">{icon}</div>
    </div>
    <div className="text-2xl font-bold text-gray-800 mt-3">{value}</div>
  </div>
);

const Dashboard = () => {
  const [pipelineData, setPipelineData] = useState({
    Totaldepartment: 0,
    Employes: 0,
    pendingRequest: 0,
  });
  console.log("pipeline data is here")
  console.log(pipelineData)

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  // Fetching leave requests and count data
  const fetchLeaveRequests = async () => {
    try {
      const response = await GetAllLeaves();
      const count = await AdmindashboardCount();
      console.log("count is here")
      console.log(count)
      console.log(count.data.CountDepartment)

      if (response?.error) {
        toast.error(response.error, { position: "top-center" });
        return;
      }

      setLeaveRequests(response?.data || []);
      setPipelineData({
        Totaldepartment: parseInt(count?.data?.CountDepartment || "0"),
        Employes: parseInt(count?.data?.CountEmployes || "0"),
        pendingRequest: parseInt(count?.data?.pendingRequest || "0"),
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("An error occurred while fetching leave requests.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Headers for the leave request table
  const headers = [
    "Request ID",
    "Employee Name",
    "Start Date",
    "End Date",
    "Working Days",
    "Status",
    "Reason",
    "Action",
  ];

  const updateLeaveStatus = async (status: string, id: number) => {
    try {
      const confirmationMessage = `Are you sure you want to ${status} this request?`;
      const userConfirmed = window.confirm(confirmationMessage);
  
      if (!userConfirmed) {
        // If the user cancels, do nothing
        return;
      }
  
      const response: any = await ApproveLeave(status, id);
      if (response.status === "error") {
        toast.error(response.message, { position: "top-center" });
        return;
      }
  
      setLeaveRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.leave_request_id === id
            ? { ...request, status }
            : request
        )
      );
  
      toast.success(`Request has been ${status} successfully!`, { position: "top-center" });
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
      });
    }
  };
  
  async function sendMail(email:string,start_date:string,end_date:string,status:string){

    try {
      const response: any = await Sendmail(email,start_date,end_date,status);
      console.log("response data is here", response);
      if (response.status === "error") {
        toast.error(response.message, { position: 'top-center' });
      } else {
        console.log("email send sucess fully")
        // toast.success(response.message, { position: 'top-center' });
      }
    } catch (error) {
      console.log("error found", error);
      toast.error("An error occurred. Please try again.", { position: 'top-center' });
    }
  }


 

  return (
    <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="Total Departments"
          icon={<FaThLarge />}
          value={pipelineData.Totaldepartment}
        />
        <StatCard
          label="Employees"
          icon={<FaUsers />}
          value={pipelineData.Employes}
        />
        <StatCard
          label="Pending Requests"
          icon={<FaUserPlus />}
          value={pipelineData.pendingRequest}
        />
      </div>

      <h1 className="font-semibold text-2xl mt-6">Pending Leave Requests</h1>
      <div className="bg-white shadow-md overflow-scroll mt-4">
  <table className="min-w-full table-auto over">
    {/* Table Header */}
    <thead>
      <tr className="bg-blue-600 text-white font-medium">
        {headers.map((header, index) => (
          <th key={index} className="py-3 px-4 text-center">
            {header}
          </th>
        ))}
      </tr>
    </thead>

    {/* Table Body */}
    <tbody>
      {leaveRequests.filter((item:any)=>item.status == "pending").map((request, index) => (
        <tr
          key={request.leave_request_id}
          className={`${
            index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
          } hover:bg-blue-100 transition`}
        >
          <td className="py-3 px-4 text-center">{index + 1}</td>
          <td className="py-3 px-4 text-center">
            {`${request.user.first_name} ${request.user.last_name}`}
          </td>
          <td className="py-3 px-4 text-center">
            {new Date(request.start_date).toLocaleDateString()}
          </td>
          <td className="py-3 px-4 text-center">
            {new Date(request.end_date).toLocaleDateString()}
          </td>
          <td className="py-3 px-4 text-center">{request.leave_days}</td>
          <td className="py-3 px-4 text-center font-bold">
            <span
              className={`${
                request.status === "approved"
                  ? "text-green-600"
                  : request.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {request.status}
            </span>
          </td>
          <td className="py-3 px-4 text-center">{request.reason}</td>
          
          <td className="py-3 px-4 text-center">
                  {request.status === "pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        onClick={() => {
                          sendMail(request.user.email,new Date(request.start_date).toLocaleDateString(),new Date(request.end_date).toLocaleDateString(),"approved");
                          updateLeaveStatus("approved", request.leave_request_id);
                         
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5"
                        onClick={() =>{
                          sendMail(request.user.email,new Date(request.start_date).toLocaleDateString(),new Date(request.end_date).toLocaleDateString(),"rejected");
                          updateLeaveStatus("rejected", request.leave_request_id)
                         
                        }
                         
                        }
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p>Send Mail</p>
                  )}
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

export default Dashboard;
