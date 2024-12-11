"use server";

import { cookies } from "next/headers";

interface LoginData {
  username: string;
  password: string;
}

interface ApiResponse {
  data: {
    token: string;
  };
  message: string;
}

export default async function LoginUser(data: LoginData) {
  // console.log("Data sent to API:", data);
  const url = process.env.PUBLIC_URL

  try {
    
    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data), 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
    }

    const responseData: ApiResponse = await response.json();
    // console.log("API Response:", responseData);

    const cookiesInstance = await cookies(); 
    cookiesInstance.set('sessionToken', responseData.data.token, {
      httpOnly: true, 
      path: '/', 
    });

    return responseData; 
  } catch (error: any) {
    console.error("Error during API request:", error.message);
    
    return { error: error.message };
  }
}
