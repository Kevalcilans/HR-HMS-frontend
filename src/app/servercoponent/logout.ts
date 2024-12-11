"use server";

import { cookies } from 'next/headers';

export default async function deleteSession() {
  try {
    const cookieStore = await cookies();

    // Set the cookie with an expired date to remove it
    cookieStore.delete('sessionToken');

    console.log('Session token has been deleted');
  } catch (error: unknown) {
    console.error('Error during cookie deletion:', error);
  }
}
