"use client";

import CreateDepartment from '@/app/servercoponent/AddDepartment';
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Interface for Popup component props
interface Popup {
  isOpen: () => void;
  onClose: () => void;
  setItems: () => any;
}

// Interface for form data
interface FormData {
  name: string;  // Only a name field for the department
}

const AddDepartmentPopup: React.FC<any> = ({ isOpen, onClose, setItems }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  // Submit function for the form
  const submitData = async (data: FormData) => {
    console.log("First response is coming ...");
    console.log(data);
    try {
      const response: any = await CreateDepartment(data);
      console.log("Response data is here", response);

      // Update the items state with the new department
      setItems((item: any) => [...item, response.data]);

      // Show appropriate toast based on response status
      if (response.status === "error") {
        toast.error(response.message, { position: 'top-center' });
      } else {
        toast.success(response.message, { position: 'top-center' });
        setTimeout(() => {
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.log("Error found", error);
      toast.error("An error occurred. Please try again.", { position: 'top-center' });
    }
  };

  // Handler for form submission
  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log("Form data:", data);
    submitData(data);
    reset();  // Reset the form after submission
  };

  if (!isOpen) return null;  // If the popup is not open, return null

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute text-4xl top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Department</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
          {/* Department Name */}
          <div>
            <label className="block text-gray-700">
              Department Name
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('name', { required: 'Department Name is required' })}
              />
            </label>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
};

export default AddDepartmentPopup;
