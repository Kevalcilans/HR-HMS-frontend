"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllLeaves from "@/app/servercoponent/GetallLeaves";
import ApproveLeave from "@/app/servercoponent/ApproveLeaves";
import LeavefindById from "@/app/servercoponent/LeaveRequestById";
import AddDepartmentPopup from "./popup";
import AddLeavePopup from "./popup";
import ViewDetails from "./ViewDeatils";

interface LeaveRequest {
  leave_request_id: number;
  start_date: string;
  end_date: string;
  leave_days: number;
  status: string;
  reason: string;
  isUnpaid: boolean;
  leave_type:string
  user: { first_name: string; last_name: string };
}

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
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [isAddLeavePopupOpen, setIsAddLeavePopupOpen] = useState(false);
  const [isViewDetailsPopupOpen, setIsViewDetailsPopupOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);


  const openAddLeavePopup = () => setIsAddLeavePopupOpen(true);
  const closeAddLeavePopup = () => setIsAddLeavePopupOpen(false);

  const openViewDetailsPopup = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsViewDetailsPopupOpen(true);
  };

  const closeViewDetailsPopup = () => {
    setSelectedRequestId(null);
    setIsViewDetailsPopupOpen(false);
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await LeavefindById();
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

  const filterRequests = () => {
    let filtered = leaveRequests;

    if (searchQuery) {
      filtered = filtered.filter(
        (request) =>
          request.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          request.user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const updateLeaveStatus = async (status: string, id: number) => {
    try {
      const response = await ApproveLeave(id, status);
      if (response?.success) {
        toast.success(`Leave request ${status} successfully.`, {
          position: "top-center",
        });
        fetchLeaveRequests();
      } else {
        toast.error("Failed to update leave request status.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      toast.error("An error occurred while updating leave status.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, leaveRequests]);

  const headers = [
    "Sr no",
    "Employee Name",
    "Start Date",
    "End Date",
    "Leave Count",
    "Status",
    "Leave Type",
    // "Reason",
    "View",
  ];

  return (
    <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-900">All LeaveRequests</h1>

      <div className="flex justify-between items-center">
        <select
          className="p-2 border rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex justify-between">
          <button
            className="bg-[#07549E] text-white font-semibold rounded-md m-2 p-2 px-4"
            onClick={openAddLeavePopup}
          >
            Create Request 
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md overflow-scroll">
        <div className="flex bg-[#07549E] text-white font-medium">
          {headers.map((header, index) => (
            <div key={index} className="flex-1 text-center py-3">
              {header}
            </div>
          ))}
        </div>

        {filteredRequests.map((request, index) => (
          <div
            key={request.leave_request_id}
            className={`flex py-3 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
            } hover:bg-blue-100 transition`}
          >
            <div className="flex-1 text-center">{index + 1}</div>
            <div className="flex-1 text-center">
              {`${request.user.first_name} ${request.user.last_name}`}
            </div>
            <div className="flex-1 text-center">
              {new Date(request.start_date).toLocaleDateString()}
            </div>
            <div className="flex-1 text-center">
              {new Date(request.end_date).toLocaleDateString()}
            </div>
            <div className="flex-1 text-center">{request.leave_days}</div>
            <div
              className={`flex-1 text-center font-bold ${
                request.status === "approved"
                  ? "text-green-600"
                  : request.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {request.status}
            </div>
            <div className="flex-1 text-center">{request.leave_type}</div>
            {/* <div className="flex-1 text-center">{request.reason}</div> */}
            <div className="flex-1 text-center">
              <button
                className="bg-[#07549E] text-white font-semibold rounded-md p-2 mr-2 px-4 w-36"
                onClick={() => openViewDetailsPopup(request.leave_request_id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <AddLeavePopup
        isOpen={isAddLeavePopupOpen}
        onClose={closeAddLeavePopup}
        setItems={setLeaveRequests}
      />

      <ViewDetails
        isOpen={isViewDetailsPopupOpen}
        onClose={closeViewDetailsPopup}
        requestId={selectedRequestId}
        setItems={setLeaveRequests}
      />

      <ToastContainer />
    </div>
  );
};

export default AllRequests;

