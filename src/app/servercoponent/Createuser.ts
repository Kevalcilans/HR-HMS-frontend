"use server";

export default async function RegisterUser(data: any) {

  const url = process.env.PUBLIC_URL
  
  try {
    const response = await fetch(`${url}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
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
