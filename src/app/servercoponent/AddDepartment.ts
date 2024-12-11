"use server";

import { cookies } from "next/headers";

export default async function CreateDepartment(data: any) {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    const url = process.env.PUBLIC_URL

  
  try {
  
    const response = await fetch('https://seating-opinions-vital-smart.trycloudflare.com/createDeprtment', {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
         Authorization: `Bearer ${sessionToken}`
      },
      body: JSON.stringify(data),
    });

    
    if (!response.ok) {
      const errorData = await response.json(); // Parse error from API
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error: any) {
    console.error("Error during API request:", error.message);
    return { error: error.message }; // Return the error to the client for handling
  }
}
