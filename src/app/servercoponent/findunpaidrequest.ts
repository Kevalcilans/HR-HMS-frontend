"use server";

import { cookies } from "next/headers";

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function FindunpaidLeave(Id: any): Promise<ApiResponse | { error: string }> {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    console.log("Session cookies are here");
    console.log(sessionToken);
    console.log("ID is coming here");
    console.log(Id);
    const url = process.env.PUBLIC_URL
    
    if (!sessionToken) {
      throw new Error("Session token not found. Please log in.");
    }

   
    
    const response = await fetch(`${url}/adminunpaidLeaves/${Id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
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

    
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred. Please try again.";

    return {
      error: errorMessage,
    };
  }
}
