import { headers } from "next/headers";
import { getAuthSession } from "./nextauth";

export async function requireUser() {
  // const h = await headers();

  // console.log("Cookie:", h.get("cookie"));

  const session = await getAuthSession();

  // console.log("Session:", session);

  return session?.user ?? null;
}