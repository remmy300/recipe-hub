import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

      <p className="mb-3">
        Your privacy matters. TastyShare only stores information required for
        the service: profile details (name, email, avatar, bio), recipes you
        create, and authentication cookies. We do not sell user data.
      </p>

      <h2 className="text-lg font-semibold mt-4 mb-2">Cookies</h2>
      <p className="mb-3">
        We use a session cookie to keep you logged in. Cookies are HTTP-only and
        used only for authentication; no tracking cookies are set by the app
        itself.
      </p>

      <h2 className="text-lg font-semibold mt-4 mb-2">Third-party services</h2>
      <p className="mb-3">
        Uploaded images are stored on Cloudinary. Please review
        Cloudinary&apos;s privacy policy for details on how images are processed
        and stored.
      </p>

      <Link href="/">
        <Button className="text-sm text-white ">Back to home</Button>
      </Link>
    </div>
  );
}
