"use server";

import { cookies } from "next/headers";

export default async function ApproveLeave(status: string, id: number) {
    console.log("id is comming on server component")
    console.log(id)

  const cookieStore = cookies();
  //@ts-ignore
  const sessionToken = await cookieStore.get('sessionToken').value;
  console.log("session token is comming")
  console.log(sessionToken)
  const url = process.env.PUBLIC_URL

  if (!sessionToken) {
    console.error('Session token not found');
    return { error: 'Session token is missing' };
  }

  try {
    const response = await fetch(`${url}/approvedleave/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        "status": status,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to approve leave. Status: ${response.status}`);
    }

    return { success: 'Leave approved successfully' };
  } catch (error: any) {
    console.error('Error occurred:', error);
    return { error: error.message || 'An unexpected error occurred' };
  }
}
