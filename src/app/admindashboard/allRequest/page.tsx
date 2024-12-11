"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllLeaves from "@/app/servercoponent/GetallLeaves";
import ApproveLeave from "@/app/servercoponent/ApproveLeaves";
import Sendmail from "@/app/servercoponent/sendmail";
import ViewDetails from "./viewDetails";

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

const AllRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setstatus] = useState("");
  const [itemsPerPage] = useState(10);

  const [isViewDetailsPopupOpen, setIsViewDetailsPopupOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

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
      const response = await GetAllLeaves();
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

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, statusFilter, leaveRequests]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const headers = [
    "Request ID",
    "Employee Name",
    "Start Date",
    "End Date",
    "working Days",
    "Status",
    // "Reason",
    "Action",
  ];

  return (
    <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-900">All Requests</h1>

      <div className="flex justify-between">
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
        <input
          type="text"
          placeholder="Search by Employee Name"
          className="p-2 border rounded-lg w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md overflow-scroll">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-blue-600 text-white font-medium">
              {headers.map((header, index) => (
                <th key={index} className="py-3 px-4 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.map((request, index) => (
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
                {/* <td className="py-3 px-4 text-center">{request.reason}</td> */}
               
                <td>
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-blue-800 text-white font-semibold rounded-md p-2"
                      onClick={() => openViewDetailsPopup(request.leave_request_id)}
                    >
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          className="p-2 bg-gray-300 rounded-lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="p-2 bg-gray-300 rounded-lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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

