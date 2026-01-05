"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateProfileThunk } from "@/redux/features/auth/authThunks";
import api from "@/lib/api/api";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const loading = useAppSelector((s) => s.auth.loading);
  const error = useAppSelector((s) => s.auth.error);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setBio(user.bio || "");
    setAvatar(user.avatar || "");
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      let avatarUrl = avatar;

      // If user selected a new file, upload it first
      if (avatarFile) {
        const form = new FormData();
        form.append("avatar", avatarFile);
        const res = await api.post("/api/auth/uploadAvatar", form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = res.data?.url || avatarUrl;
      }

      const result = await dispatch(
        updateProfileThunk({ name, bio, avatar: avatarUrl })
      ).unwrap();
      setSuccess("Profile updated successfully");

      // navigate back to profile page
      router.push("/profile");

      return result;
    } catch (err: any) {
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            rows={4}
          />
        </div>

        <label className="block text-sm mb-1">Avatar</label>
        <Input
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          placeholder="Or upload a file"
        />
        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setAvatarFile(file);
              if (file) setAvatar(URL.createObjectURL(file));
            }}
          />
        </div>

        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt="avatar preview"
            className="h-24 w-24 rounded-full object-cover mt-2"
          />
        ) : null}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
