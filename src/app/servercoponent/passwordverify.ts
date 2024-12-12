"use server"

import { cookies } from "next/headers";

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function Passwordverify(email:string,password:string,firstname:string,lastname:string): Promise<ApiResponse | { error: string }> {
  try {
   
   const url2 = process.env.PUBLIC_URL
    const url = `${url2}/sendmail`;
    const emailPayload = {
      to: `${email}`,
      subject: "Welcome to CilansConnect!",
      text: "Welcome! Your account has been successfully created.",
      html: `
          <p>Dear ${firstname} ${" "} ${lastname},</p>
          <p>Welcome to CilansConnect! Our own HR platform. We're excited to have you on board.</p>
          <p>Your account has been successfully created with the following details:</p>
          <ul>
               <li><strong>Link:</strong> <a href="https://hr-hms.cilans.in/">https://hr-hms.cilans.in/</a></li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>Please make sure to keep your password secure and do not share it with anyone.</p>
          <p>We are here to help if you have any questions. Enjoy exploring our platform!</p>
          <p>Best regards,</p>
          <p>Admin</p>
          <p>Cilans system</p>
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

