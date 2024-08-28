'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import NavBar from "@/Components/NavBar";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 2000); // Slightly extended the timeout for better UX

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <>
      <NavBar />
      <div className="h-[680px] xl:h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-7xl text-orange-500 animate-bounce mb-4">...</p>
          <p className="text-lg text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    </>
  );
}
