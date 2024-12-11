"use server"

import { cookies } from "next/headers";

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function Passwordverify(email:string,password:string): Promise<ApiResponse | { error: string }> {
  try {
   
   const url2 = process.env.PUBLIC_URL
    const url = `${url2}/sendmail`;
    const emailPayload = {
              to: `${email}`,
              subject: "your email and password",
              text: "email and password",
              html: `<p>your email is : ${email} and password is : ${password}</p>`
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
