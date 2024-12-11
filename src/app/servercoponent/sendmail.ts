"use server"

import { cookies } from "next/headers";

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function Sendmail(email:string,startdate:string,enddate:string,status:string): Promise<ApiResponse | { error: string }> {
  try {
   console.log("staus is here")
   console.log(status)
   const url2 = process.env.PUBLIC_URL
    const url = `${url2}/sendmail`;
    let emailPayload  = {}
    if(status == "approved")
    {
        emailPayload = {
              to: `${email}`,
              subject: "confrim leave Request",
              text: "Your Leave is approved sucessfully(testing.....)",
              html: `<p>Your startDate:${startdate} and endDate:${enddate}leave is approved</p>`
            };
    }
    else{
        emailPayload = {
              to: `${email}`,
              subject: "confrim leave Request",
              text: "Your Leave is approved sucessfully(testing.....)",
              html: `<p>sorry ......Your startDate:${startdate} and endDate:${enddate}leave is Rejected</p>`
            };
    }
     

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
