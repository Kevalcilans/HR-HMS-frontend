"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllLeaves from "@/app/servercoponent/GetallLeaves";
import ApproveLeave from "@/app/servercoponent/ApproveLeaves";
import LeavefindById from "@/app/servercoponent/LeaveRequestById";
import AllPaidLeve from "@/app/servercoponent/paidLeave";



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

const AllRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<any>([]);
  const [filteredRequests, setFilteredRequests] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await AllPaidLeve();
      if (response?.error) {
        toast.error(response.error, { position: "top-center" });
        return;
      }

      setLeaveRequests(response?.data || []);
      setFilteredRequests(response?.data || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("An error occurred while fetching leave requests.", {
        position: "top-center",
      });
    }
  };

  // Filter requests based on search and status
  const filterRequests = () => {
    let filtered = leaveRequests;

    // Search by employee name
    if (searchQuery) {
      filtered = filtered.filter(
        (request) =>
          request.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };


  

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, leaveRequests]);

  const headers = [
    "Id",
    "Name",
    "Start Date",
    "End Date",
    "Total Days",
    "UnPaid days",
    "approved Date",
  ];

  return (
    <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-900">All Unpaid Leaves</h1>

    

      <div className="bg-white shadow-md overflow-scroll">
        <div className="flex bg-blue-600 text-white font-medium">
          {headers.map((header, index) => (
            <div key={index} className="flex-1 text-center py-3">
              {header}
            </div>
          ))}
        </div>

        {filteredRequests.map((request, index) => (
          <div
            key={request.approved_leave_id}
            className={`flex py-3 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
            } hover:bg-blue-100 transition`}
          >
            <div className="flex-1 text-center">{request.approved_leave_id}</div>
            <div className="flex-1 text-center">
           { request.leaveRequest.user.first_name + " " +request.leaveRequest.user.last_name  } 
        
            </div>
            <div className="flex-1 text-center">
              {new Date(request.leaveRequest.start_date).toLocaleDateString()}
            </div>
            <div className="flex-1 text-center">
              {new Date(request.leaveRequest.end_date).toLocaleDateString()}
            </div>
            <div className="flex-1 text-center">{request.leaveRequest.leave_days}</div>
            <div
              className="flex-1 text-center"
            >
              {request.total_days}
            </div>
            <div className="flex-1 text-center">{new Date(request.approved_date).toLocaleDateString()}</div>
            
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
};

export default AllRequests;
