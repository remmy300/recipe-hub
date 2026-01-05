"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import {
  logoutUser,
  changePasswordThunk,
  deleteAccountThunk,
} from "@/redux/features/auth/authThunks";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Account</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Manage account details
          </p>
          <Link href="/profile/edit">
            <p>
              <Button className="text-white">Edit Profile</Button>
            </p>
          </Link>
        </div>

        <div>
          <h2 className="font-semibold">Security</h2>
          <p className="mb-2 text-sm text-muted-foreground">Change password</p>
          <div className="space-y-2 max-w-md">
            <input
              type="password"
              placeholder="Current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div>
              <Button
                onClick={async () => {
                  setMessage(null);
                  try {
                    await dispatch(
                      changePasswordThunk({ oldPassword, newPassword })
                    ).unwrap();
                    setOldPassword("");
                    setNewPassword("");
                    setMessage("Password changed successfully");
                  } catch (err: any) {
                    setMessage(err || "Failed to change password");
                  }
                }}
              >
                Change Password
              </Button>
            </div>
            {message && <div className="text-sm mt-2">{message}</div>}
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Danger zone</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Delete your account permanently
          </p>
          <Button
            variant="destructive"
            onClick={async () => {
              // call delete account
              try {
                await dispatch(deleteAccountThunk()).unwrap();
                // ensure client state cleared
                await dispatch(logoutUser());
                router.push("/");
              } catch (err) {
                // show minimal failure UI
                setMessage("Failed to delete account");
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
