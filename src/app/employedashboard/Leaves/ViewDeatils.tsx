"use client";
import ShowLeavesDetails from '@/app/servercoponent/ShowRequestDetails';
import formatDateToISO from '@/app/utils/dateformatefn';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewDetails: React.FC<PopupProps> = ({ isOpen, onClose,requestId }) => {


     const [leavedetails,setleavedeatils] = useState({})
     console.log("hello data is comming for that")
     console.log(leavedetails)

  // Static data for leave details
  const staticLeaveData = {
    request_id: 'REQ-12345',
    employee_name: 'John Doe',
    start_date: '2024-12-10',
    end_date: '2024-12-11',
    leave_days: 2,
    status: 'Approved',
    reason: 'Vacation',
  };

  console.log("request id is comming here")
  console.log(requestId)
  
  const fetchLeaveRequests = async () => {
    try {
      const response = await ShowLeavesDetails(requestId);
      console.log("responce is comming for that")
      console.log(response)
      if (response?.error) {
        toast.error(response.error, { position: "top-center" });
        return;
      }
      setleavedeatils(response?.data)
      

    //   setLeaveRequests(response?.data || []);
    //   setFilteredRequests(response?.data || []);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      toast.error("An error occurred while fetching leave requests.", {
        position: "top-center",
      });
    }
  };

  // Handle static leave data submission
  const submitData = () => {
    try {
      // Simulate a successful API response
      const response = {
        status: "success",
        message: "Leave created successfully",
        data: staticLeaveData,
      };

      if (response.status === "error") {
        toast.error(response.message, { position: 'top-center' });
      } else {
        toast.success(response.message, { position: 'top-center' });
        setTimeout(onClose, 5000); // Close the popup after 5 seconds
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.", { position: 'top-center' });
    }
  };

  useEffect(()=>{
    if(requestId != undefined)
    {
        fetchLeaveRequests()
    }
    else{
        console.log("try again")
    }
    
  },[requestId])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute text-4xl top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Leave Details</h2>

        {/* Two-column Layout */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Request ID</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{leavedetails?.leave_request_id}</p>
          </div>
          <div>
            <label className="block text-gray-700">Employee Name</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{leavedetails?.user?.first_name + " " +  leavedetails?.user?.last_name}</p>
          </div>
          <div>
            <label className="block text-gray-700">Start Date</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{formatDateToISO(leavedetails?.start_date)}</p>
          </div>
          <div>
            <label className="block text-gray-700">End Date</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{formatDateToISO(leavedetails?.end_date)}</p>
          </div>
          <div>
            <label className="block text-gray-700">Leave Type</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{leavedetails?.leave_type}</p>
          </div>
          <div>
            <label className="block text-gray-700">Desc</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded"> {leavedetails?.halfday_type?.replace(/half/, "half ")}</p>
          </div>
          <div>
            <label className="block text-gray-700">Working Days</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{leavedetails?.leave_days}</p>
          </div>
          <div>
            <label className="block text-gray-700">Status</label>
            <p className="mt-1 p-2 w-full border border-gray-300 rounded">{leavedetails?.status}</p>
          </div>
          
        </div>
        <div className='pb-6'>
            <label className="block text-gray-700">Reason</label>
            <p className="mt-1 p-2 h-28 w-full border border-gray-300 rounded">{leavedetails?.reason}</p>
          </div>

        {/* Button to submit static leave data */}
        <div className="col-span-2">
          <button
          disabled
            onClick={submitData}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit Leave
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewDetails;
