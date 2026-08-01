"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ClientNavbar() {
  const pathname = usePathname();

  // Hide the global navbar only on the landing page ("/")
  if (pathname === "/") {
    return null;
  }

  return <Navbar />;
}