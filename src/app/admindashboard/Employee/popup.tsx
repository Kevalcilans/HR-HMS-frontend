"use client";
import RegisterUser from '@/app/servercoponent/Createuser';
import Passwordverify from '@/app/servercoponent/passwordverify';

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
// import CreateLeave from '@/app/servercoponent/createLeave';

interface Popup {
  isOpen: () => void;
  onClose: () => void;
  setItems: () => any;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  departmentId: number;
  designation: string;
  hire_date: string;
  leave_balance: number;
}

const AddEmployeePopup: React.FC<Popup> = ({ isOpen, onClose, setitems }) => {
  const { register, handleSubmit, formState: { errors }, reset,control } = useForm<FormData>();

  const submitData = async (data: FormData) => {
    console.log("first responce is comming ....")
    console.log(data)
    try {
      const response: any = await RegisterUser(data);
      console.log("response data is here", response);
      if (response.status === "error") {
        toast.error(response.message, { position: 'top-center' });
      } else {
        toast.success(response.message, { position: 'top-center' });
        setTimeout(() => {
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.log("error found", error);
      toast.error("An error occurred. Please try again.", { position: 'top-center' });
    }
    // console.log("hello")
    // console.log(data)
  };

  async function sendMail(email:string,password:string){

    try {
      const response: any = await Passwordverify(email,password);
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

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log("---hello data is comming---")
    console.log(data)
    submitData(data);
    sendMail(data.email,data.password)
    reset();
  };

  

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
        <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-700">
              First Name
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('first_name', { required: 'First Name is required' })}
              />
            </label>
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700">
              Last Name
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('last_name', { required: 'Last Name is required' })}
              />
            </label>
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">
              Email
              <input
                type="email"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('email', { required: 'Email is required' })}
              />
            </label>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700">
              Password
              <input
                type="password"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('password', { required: 'Password is required' })}
              />
            </label>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div>
          <label className="block text-gray-700">
          Role
                    <select
                      id="role"
                      {...register("role", {
                        required: "Role is required",
                      })}
                      className="mt-1 p-2 w-full border border-gray-300 rounded"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                    {errors.role && (
                      <p className="text-red-500 text-sm">{errors.role.message}</p>
                    )}
              </div> 

          {/* Department ID */}
          <div>
            <label className="block text-gray-700">
              Company
              <input
                type="number"
                value={1}
                className="mt-1 p-2 w-full border border-gray-400  bg-gray-100 rounded"
                {...register('departmentId', { valueAsNumber:true })}
                disabled={true}
                
              />
            </label>
            {errors.departmentId && <p className="text-red-500 text-sm mt-1">{errors.departmentId.message}</p>}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-gray-700">
              Designation
              <input
                type="text"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('designation', { required: 'Designation is required' })}
              />
            </label>
            {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
          </div>

          {/* Hire Date */}
          <div>
          <label className="block text-gray-700">
          Hire Date
                    <Controller
                      name="hire_date"
                      control={control}
                      rules={{ required: "Hire date and time are required" }}
                      render={({ field: { onChange, value, ...field } }) => (
                        <input
                          id="hire_date"
                          type="datetime-local"
                          {...field}
                          value={value ? new Date(value).toISOString().slice(0, 16) : ""}
                          onChange={(e) => {
                            const datetimeLocalValue = e.target.value; // Get the datetime-local value
                            // Convert to ISO 8601 UTC format
                            const utcDatetime = new Date(datetimeLocalValue).toISOString();
                            onChange(utcDatetime); // Pass the formatted value to the field
                          }}
                          className="mt-1 p-2 w-full border border-gray-300 rounded"
                        />
                      )}
                    />
                    </label>
                    {errors.hire_date && (
                      <p className="text-red-500 text-sm">
                        {errors.hire_date.message}
                      </p>
                    )}
                  </div>

          {/* Leave Balance */}
          <div>
            <label className="block text-gray-700">
              Leave Balance
              <input
                type="number"
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('leave_balance', { required: 'Leave Balance is required',valueAsNumber:true })}
              />
            </label>
            {errors.leave_balance && <p className="text-red-500 text-sm mt-1">{errors.leave_balance.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddEmployeePopup;

