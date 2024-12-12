"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import CreateLeave from '@/app/servercoponent/CreateLeave';
import verificationmail from '@/app/servercoponent/verificationmail';


interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  setItems: (items: any) => void;
}

interface FormData {
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string; // For the half-day leave format
}

const AddLeavePopup: React.FC<PopupProps> = ({ isOpen, onClose, setItems }) => {
  const [leaveFormat, setLeaveFormat] = useState<'halfday' | 'fullday' | 'multiday'>('multiday');
  const [halfleavetype,sethalfleave] = useState();
  
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormData>();

  const handleLeaveFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("lave type is here")
    console.log(event.target.value)
    //@ts-ignore
    setLeaveFormat(event.target.value);
  };

  const submitData = async (data: FormData) => {
    console.log(data)
    console.log("data is comming ....")
    if (leaveFormat === 'fullday') {
      try {
        const formattedData = {
          ...data,
          leave_type:leaveFormat,
          start_date: new Date(data.start_date).toISOString(),
          end_date: new Date(data.start_date).toISOString(),
        };
        const response = await CreateLeave(formattedData);
        await verificationmail(response)
        console.log("your email is called")
        if (response.status === "error") {
          toast.error(response.message, { position: 'top-center' });
        } else {
          toast.success(response.message, { position: 'top-center' });
          setItems((prevItems: any) => [...prevItems, response.data]);
          setTimeout(onClose, 5000);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.", { position: 'top-center' });
      }
    } else if (leaveFormat === 'halfday') {
      try {
        const halfday = {
          ...data,
          leave_type:leaveFormat,
          halfday_type:halfleavetype,
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
        };
        const response = await CreateLeave(halfday);
        console.log("-----responce is here- ------")
        console.log(response)
         await verificationmail(response)
        if (response.status === "error") {
          toast.error(response.message, { position: 'top-center' });
        } else {
          toast.success(response.message, { position: 'top-center' });
          setItems((prevItems: any) => [...prevItems, response.data]);
          setTimeout(onClose, 5000);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.", { position: 'top-center' });
      }
    } else if (leaveFormat === 'multiday') {
      try {
        const multiday = {
          ...data,
          leave_type:leaveFormat,
          start_date: new Date(data.start_date).toISOString(),
          end_date: new Date(data.end_date).toISOString(),
        };
        const response = await CreateLeave(multiday);
         await verificationmail(response)
        if (response.status === "error") {
          toast.error(response.message, { position: 'top-center' });
        } else {
          toast.success(response.message, { position: 'top-center' });
          setItems((prevItems: any) => [...prevItems, response.data]);
          setTimeout(onClose, 5000);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.", { position: 'top-center' });
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    submitData(data);
    reset();
  };
  function selectdropdown(e:any){
    sethalfleave(e.target.value)
    console.log(e.target.value)
  }

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
        <h2 className="text-xl font-semibold mb-4">Create Leave</h2>
        <div className="mb-4">
          <label className="mr-6">
            <input
              type="radio"
              name="leaveFormat"
              value="halfday"
              checked={leaveFormat === 'halfday'}
              onChange={handleLeaveFormatChange}
              className="mr-2"
            />
            Half Day
          </label>
          <label>
            <input
              type="radio"
              name="leaveFormat"
              value="fullday"
              checked={leaveFormat === 'fullday'}
              onChange={handleLeaveFormatChange}
              className="mr-2"
            />
            Full Day
          </label>
          <label className="mr-6 pl-7">
            <input
              type="radio"
              name="leaveFormat"
              value="multiday"
              checked={leaveFormat === 'multiday'}
              onChange={handleLeaveFormatChange}
              className="mr-2"
            />
            Multiday
          </label>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          {leaveFormat !== 'halfday' && (
            <div>
              <label className="block text-gray-700">
                Start Date
                <input
                  type="date"
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  {...register('start_date')}
                />
              </label>
              {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
            </div>
          )}
          {leaveFormat !== 'halfday' && leaveFormat === 'multiday' && (
            <div>
              <label className="block text-gray-700">
                End Date
                <input
                  type="date"
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                  {...register('end_date')}
                />
              </label>
              {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
            </div>
          )}
          {leaveFormat === 'halfday' && (
            <div>
              <label htmlFor="period" className="block font-medium mb-2">
                Select Period
              </label>
              <Controller
                name="leave_type"
                control={control}
                render={({ field }) => (
                  <select
                    id="period"
                    {...field}
                    className="border rounded-md p-2 w-full"
                    onChange={selectdropdown}
                  >
                    <option value="">Select...</option>
                    <option value="firsthalf">First Half</option>
                    <option value="secondhalf">Second Half</option>
                  </select>
                )}
              />
            </div>
          )}
          <div className="col-span-2">
            <label className="block text-gray-700">
              Reason
              <textarea
                cols={5}
                rows={5}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                {...register('reason',{required:"resone is required before submit"})}
              />
            </label>
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
          </div>
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

export default AddLeavePopup;

