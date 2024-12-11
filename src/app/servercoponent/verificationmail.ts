Verification mail.ts
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

    console.log("data is comming form that")
    console.log(data)
  try {
   
   const url2 = process.env.PUBLIC_URL
    const url = `${url2}/sendmail`;
    const emailPayload = {
        to: 'rnkkhara@gmail.com',
        subject: "Leave Application Verification",
        text: "Please verify the leave details of the employee.",
        html: `
            <p>Dear Manager,</p>
            <p>This employee has applied for a <strong>${data.data.leave_type}</strong> leave.</p>
            <ul>
                <li><strong>Email:</strong> ${data.data.user.email}</li>
                <li><strong>Start Date:</strong> ${formatDateToISO(data.data.start_date)}</li>
                <li><strong>End Date:</strong> ${formatDateToISO(data.data.end_date)}</li>
            </ul>
            <p>Please check more details on the dashboard. Kindly confirm and take the necessary actions.</p>
            <p>Best regards,</p>
            <p>Cilans System</p>
        `
    };
    
    
    
     

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

