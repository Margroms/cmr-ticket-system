"use client"

import Link from "next/link";
import { useState } from "react";
export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <input type="text" className="border-2 border-gray-300 rounded-md p-2" placeholder="Enter your name" />
      <input type="text" className="border-2 border-gray-300 rounded-md p-2" placeholder="Enter your phone" />
      <input type="text" className="border-2 border-gray-300 rounded-md p-2" placeholder="Enter your email" />
      <input type="text" className="border-2 border-gray-300 rounded-md p-2" placeholder="Enter your OTP" />
      <button className="bg-blue-500 text-white rounded-md p-2" onClick={() => {
        setName("");
        setPhone("");
        setEmail("");
        setOtp("");
      }}><Link href="/booking">Generate Ticket</Link></button>

    </div>
  );
}
