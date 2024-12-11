// "use client";

// import React, { useEffect, useState, Suspense } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
// import { useSearchParams } from 'next/navigation';
// import "react-toastify/dist/ReactToastify.css";
// import GetAllLeaves from "@/app/servercoponent/GetallLeaves";
// import ApproveLeave from "@/app/servercoponent/ApproveLeaves";
// import Sendmail from "@/app/servercoponent/sendmail";
// import FindunpaidLeave from "@/app/servercoponent/findunpaidrequest";
// import ViewDetails from "../allRequest/viewDetails";
// import FindpaidLeave from "@/app/servercoponent/findpaidrequest";

// interface LeaveRequest {
//   leave_request_id: number;
//   start_date: string;
//   end_date: string;
//   leave_days: number;
//   status: string;
//   reason: string;
//   isUnpaid: boolean;
//   user: {
//     first_name: string;
//     last_name: string;
//     email: string;
//   };
// }

// const AllRequests = () => {
//   const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
//   const [leaveunpaidRequests, setunLeaveRequests] = useState<any>([]);
//   const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [status, setstatus] = useState("");
//   const [itemsPerPage] = useState(10);
  
//   // Fetch search params
//   const searchParams = useSearchParams();
//   const search: any = searchParams.get('search');

//   const [isViewDetailsPopupOpen, setIsViewDetailsPopupOpen] = useState(false);
//   const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);

//   const openViewDetailsPopup = (requestId: number) => {
//     setSelectedRequestId(requestId);
//     setIsViewDetailsPopupOpen(true);
//   };

//   const closeViewDetailsPopup = () => {
//     setSelectedRequestId(null);
//     setIsViewDetailsPopupOpen(false);
//   };

//   const fetchLeaveRequests = async () => {
//     try {
//       const response = await FindpaidLeave(parseInt(search));
//       if (response?.error) {
//         toast.error(response.error, { position: "top-center" });
//         return;
//       }
//       setLeaveRequests(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching leave requests:", error);
//       toast.error("An error occurred while fetching leave requests.", {
//         position: "top-center",
//       });
//     }
//   };

//   const fetchunpaidLeave = async () => {
//     try {
//       const response = await FindunpaidLeave(parseInt(search));
//       if (response?.error) {
//         toast.error(response.error, { position: "top-center" });
//         return;
//       }
//       setunLeaveRequests(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching leave requests:", error);
//       toast.error("An error occurred while fetching leave requests.", {
//         position: "top-center",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchLeaveRequests();
//     fetchunpaidLeave();
//   }, [search]); // Re-run fetch when search param changes

//   const headers = [
//     "Request ID",
//     "Employee Name",
//     "Start Date",
//     "End Date",
//     "Working Days",
//     "Status",
//     "Reason",
//     "Action",
//   ];

//   const unpaidHeaders = [
//     "Id",
//     "Name",
//     "Start Date",
//     "End Date",
//     "Total Days",
//     "Unpaid Days",
//     "Approved Date",
//   ];

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
//         <h1 className="text-3xl font-bold text-blue-900">All Requests</h1>

//         <div className="bg-white shadow-md h-[50%] overflow-scroll">
//           <table className="min-w-full table-auto">
//             <thead>
//               <tr className="bg-blue-600 text-white font-medium">
//                 {headers.map((header, index) => (
//                   <th key={index} className="py-3 px-4 text-center">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {leaveRequests.length > 0 ? (
//                 leaveRequests.map((request, index) => (
//                   <tr
//                     key={request.leave_request_id}
//                     className={`${
//                       index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
//                     } hover:bg-blue-100 transition`}
//                   >
//                     <td className="py-3 px-4 text-center">{request.leave_request_id}</td>
//                     <td className="py-3 px-4 text-center">
//                       {`${request.user.first_name} ${request.user.last_name}`}
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       {new Date(request.start_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       {new Date(request.end_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4 text-center">{request.leave_days}</td>
//                     <td className="py-3 px-4 text-center font-bold">
//                       <span
//                         className={`${
//                           request.status === "approved"
//                             ? "text-green-600"
//                             : request.status === "pending"
//                             ? "text-yellow-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         {request.status}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4 text-center">{request.reason}</td>
//                     <td className="py-3 px-4 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           className="bg-blue-800 text-white font-semibold rounded-md p-2"
//                           onClick={() => openViewDetailsPopup(request.leave_request_id)}
//                         >
//                           View Details
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="text-center py-3 px-4">
//                     No leave requests available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="bg-white shadow-md h-[50%] overflow-scroll">
//           <table className="min-w-full h-auto table-auto">
//             <thead>
//               <tr className="bg-blue-600 text-white font-medium">
//                 {unpaidHeaders.map((header, index) => (
//                   <th key={index} className="py-3 px-4 text-center">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {leaveunpaidRequests.length > 0 ? (
//                 leaveunpaidRequests.map((request, index) => (
//                   <tr
//                     key={request.approved_leave_id}
//                     className={`${
//                       index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
//                     } hover:bg-blue-100 transition`}
//                   >
//                     <td className="py-3 px-4 text-center">{request.approved_leave_id}</td>
//                     <td className="py-3 px-4 text-center">
//                       {`${request.leaveRequest.user.first_name} ${request.leaveRequest.user.last_name}`}
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       {new Date(request.leaveRequest.start_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4 text-center">
//                       {new Date(request.leaveRequest.end_date).toLocaleDateString()}
//                     </td>
//                     <td className="py-3 px-4 text-center">{request.leaveRequest.leave_days}</td>
//                     <td className="py-3 px-4 text-center">{request.total_days}</td>
//                     <td className="py-3 px-4 text-center">
//                       {new Date(request.approved_date).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="text-center py-3 px-4">
//                     No unpaid leave requests available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <ViewDetails
//           isOpen={isViewDetailsPopupOpen}
//           onClose={closeViewDetailsPopup}
//           requestId={selectedRequestId}
//           setItems={setLeaveRequests}
//         />

//         <ToastContainer />
//       </div>
//     </Suspense>
//   );
// };

// export default AllRequests;

const AllRequests = ()=>{
return(
  <h1>This is a simple exmaple</h1>
)
}
export default AllRequests