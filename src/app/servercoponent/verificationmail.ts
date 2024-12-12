"use server"

import { cookies } from "next/headers";
import formatDateToISO from "../utils/dateformatefn";

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function verificationmail(data:any) {

    
  try {
   
   const url2 = process.env.PUBLIC_URL
    const url = `${url2}/sendmail`;
    const emailPayload = {
      to: 'help.vnurture@gmail.com',
      subject: `Leave Request Notification from ${data.data.user.first_name} ${data.data.user.last_name}`,
      text: `This is an automated notification regarding a leave request submitted by ${data.data.user.first_name} ${data.data.user.last_name} through the Cilans HR platform.`,
      html: `
          <p>Dear Admin,</p>
          <p>This is an automated notification regarding a leave request submitted by <strong>${data.data.user.first_name} ${data.data.user.last_name}</strong> through the Cilans HR platform.</p>
          <p><strong>Leave Request Details:</strong></p>
          <ul>
              <li><strong>Employee Name:</strong> ${data.data.user.first_name} ${data.data.user.last_name}</li>
              <li><strong>Leave Type:</strong> ${data.data.leave_type}</li>
              <li><strong>Leave Start Date:</strong> ${formatDateToISO(data.data.start_date)}</li>
              <li><strong>Leave End Date:</strong> ${formatDateToISO(data.data.end_date)}</li>
              <li><strong>Number of Days:</strong> ${data.data.leave_days}</li>
              <li><strong>Reason for Leave:</strong> ${data.data.reason || 'Not Provided'}</li>
          </ul>
          <p>Please review the request in the HR platform for further action.</p>
          <p>Best Regards,</p>
          <p>Admin<br/>Cilans System</p>
      `
  };
  console.log("----this is verification main----")
    console.log(data)
  
    
    
    
     

    const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || `HTTP Error: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }

   
    const responseData = await response.json();

   
    console.log("API Response Data:", JSON.stringify(responseData, null, 2));

    
    return {
      data: responseData.data,
      message: responseData.message,
    };
  } catch (error: unknown) {
    console.error("Error during API request:", error);

    // Return a user-friendly error message
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred. Please try again.";

    return {
      error: errorMessage,
    };
  }
}

