"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllLevaes from "../servercoponent/GetallLeaves";
import AdmindashboardCount from "../servercoponent/countemployeeData";
import CountLeaves from "../servercoponent/Countemployedashboard";
import CountuserLeaves from "../servercoponent/Countemployedashboard";
import LeavefindById from "../servercoponent/LeaveRequestById";

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
    availableLeaves: 0,
    paidLeaves: 0,
    unpaidLeave: 0,
    employess: 0
  });

  console.log("pipeline data is here");
  console.log(pipelineData);

  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetching leave requests and count data
  const fetchLeaveRequests = async () => {
    try {
    
      const response = await LeavefindById();
      const countdata = await CountuserLeaves()
      console.log("count data comes sucessfully")
      console.log(countdata)
      // const count = await CountuserLeaves();
      // console.log("count is here");
      // console.log(count);
      // console.log(count?.data?.CountDepartment);

      if (response?.error) {
        toast.error(response.error, { position: "top-center" });
        return;
      }

      setLeaveRequests(response?.data || []);
      // setPipelineData({
      //   availableLeaves: parseInt(countdata?.data?.availableLeaves || "0"),
      //   Employes: parseInt(countdata?.data?.paidLeaves || "0"),
      //   pendingRequest: parseInt(countdata?.data?.unpaidLeave || "0"),
      // });
      //@ts-ignore
      setPipelineData({
        availableLeaves: parseInt(countdata?.data?.availableLeaves),
        paidLeaves: parseInt(countdata?.data?.paidLeaves),
        unpaidLeave: parseInt(countdata?.data?.unpaidLeave),
        employess: parseInt(countdata?.data?.employess)
      })
     
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
  ];

  // Placeholder functions for mail sending and updating leave status
  const sendMail = (email: string) => {
    console.log("Sending email to:", email);
    // Your email sending logic here
  };

  const updateLeaveStatus = (status: string, leaveRequestId: number) => {
    console.log(`Updating leave request ${leaveRequestId} status to ${status}`);
    // Your logic for updating leave request status here
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="availableLeaves"
          icon={<FaThLarge />}
          value={pipelineData.availableLeaves}
        />
        <StatCard
          label="paidLeves"
          icon={<FaUsers />}
          value={pipelineData.paidLeaves}
        />
        <StatCard
          label="unpaidLeave"
          icon={<FaUserPlus />}
          value={pipelineData.unpaidLeave}
        />
        <StatCard
          label="Total Employes"
          icon={<FaUserPlus />}
          value={pipelineData.employess}
        />
      </div>

      <h1 className="font-semibold text-2xl mt-6">Your Approved Leaverequest</h1>
      <div className="bg-white shadow-md overflow-scroll mt-4">
        {/* Table Header */}
        <div className="flex bg-blue-600 text-white font-medium">
          {headers.map((header, index) => (
            <div key={index} className="flex-1 text-center py-3">
              {header}
            </div>
          ))}
        </div>

        {/* Leave Request Rows */}
        {leaveRequests.filter((items=>items.status == "approved" )).map((request, index) => (
          <div
            key={request.leave_request_id}
            className={`flex py-3 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
            } hover:bg-blue-100 transition`}
          >
            <div className="flex-1 text-center">{request.leave_request_id}</div>
            <div className="flex-1 text-center">
              {`${request.user.first_name} ${request.user.last_name}`}
            </div>
            <div className="flex-1 text-center">
              {new Date(request.start_date).toLocaleDateString()}
            </div>
            <div className="flex-1 text-center">
              {new Date(request.end_date).toLocaleDateString()}
            </div>
            <div className="flex-1 text-center">{request?.leave_days}</div>
           
            <div className="flex-1 text-center">{request.reason}</div>
            
          
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
