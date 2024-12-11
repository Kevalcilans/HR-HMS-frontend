"use server";

import { cookies } from "next/headers";

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function CreateLeave(data:any): Promise<ApiResponse | { error: string }> {
  try {
    // Retrieve the session token from cookies
    const cookieStore = cookies();
    //@ts-ignore
    const sessionToken = cookieStore.get("sessionToken")?.value;
    const url = process.env.PUBLIC_URL

    if (!sessionToken) {
      throw new Error("Session token not found. Please log in.");
    }

    console.log("Session Token:", sessionToken);

    // Make the API request to the /me endpoint
    const response = await fetch(`${url}/LeaveRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body:JSON.stringify(data)
    });

    // Check if the response status is OK (200-299)
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || `HTTP Error: ${response.status} - ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Parse the JSON response
    const responseData = await response.json();

    // Log the response data in a readable format
    console.log("API Response Data:", JSON.stringify(responseData, null, 2));

    // Return the response data as an ApiResponse
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