"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThLarge, FaUsers, FaUserPlus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import GetAllDepartment from "@/app/servercoponent/GetallDepartment";
import AddDepartmentPopup from "./popup";

// Types for department data
interface Department {
  department_id: number;
  name: string;
}

const Employee = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Fetch all departments from the API
  const fetchDepartments = async () => {
    try {
      const response = await GetAllDepartment();
      if (response?.error) {
        toast.error(response.error, { position: "top-center" });
        return;
      }
      console.log("Department data is coming", response?.data);
      setDepartments(response?.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("An error occurred while fetching department data.", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Table headers for department data
  const headers = ["Department ID", "Department Name"];

  return (
    <div className="flex flex-col gap-6 bg-gray-100 w-full min-h-screen p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-blue-900">All Departments</h1>
        <button
          className="bg-[#07549E] text-white font-semibold rounded-md m-2 p-2 px-4"
          onClick={openPopup}
        >
          Add Department
        </button>
        <AddDepartmentPopup
          isOpen={isPopupOpen}
          onClose={closePopup}
          setItems={setDepartments}
        />
      </div>

      <div className="bg-white shadow-md overflow-scroll">
        <table className="min-w-full table-auto">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#07549E] text-white font-medium">
              {headers.map((header, index) => (
                <th key={index} className="py-3 px-4 text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {departments.map((department, index) => (
              <tr
                key={department.department_id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-blue-100 transition`}
              >
                <td className="py-3 px-4 text-center">{index + 1}</td>
                <td className="py-3 px-4 text-center">{department.name}</td>
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
