"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile } from "@/redux/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  //  fetch user once on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Redirect only AFTER loading is finished
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <p>Checking authentication...</p>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
