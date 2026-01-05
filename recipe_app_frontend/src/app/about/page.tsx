import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">About TastyShare</h1>
      <p className="mb-4">
        TastyShare is a lightweight recipe sharing app that lets users create,
        share and discover recipes. You can add recipes with images, follow
        other cooks, save favourites, and manage your profile.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Contact</h2>
      <p className="mb-4">
        For feedback or support, email: jentahrehema7@gmail.com
      </p>

      <Link href="/">
        <Button className="text-sm text-white">Back to home</Button>
      </Link>
    </div>
  );
}
