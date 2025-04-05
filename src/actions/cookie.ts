"use server"
import { cookies } from "next/headers";

export async function getCookieValue(name: string) {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(name)?.value;
  return cookieValue;
}