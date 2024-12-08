"use client";

import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPageNavBar() {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="text-3xl w-1/2 justify-between lg:w-auto lg:justify-normal  font-semibold flex items-center gap-x-3">
        <Menu className="w-8 h-8 flex lg:hidden" />
        <Image src="/Faizy.svg" alt="Faizy" width={70} height={70} />
      </div>
      <div className="hidden lg:flex items-center gap-x-10">
        <Link
          href="/"
          className="bg-[#7320DD] shadow-sm shadow-[#7320DD]/40 py-2 px-5 font-semibold text-xs rounded-full hover:bg-[#7320DD]/70 transition-all duration-300"
        >
          Home
        </Link>
        <Link href="/" className="text-sm">
          Pricing
        </Link>
        <Link href="/" className="text-sm">
          Contact
        </Link>
      </div>
      <Link href="/auth/sign-in" className="w-1/2  justify-end flex lg:w-auto">
        <Button className="text-sm flex gap-x-2">
          <User fill="#000" />
          <p className="text-sm">Login</p>
        </Button>
      </Link>
    </div>
  );
}
