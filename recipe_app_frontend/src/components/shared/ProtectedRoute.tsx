"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUserProfile } from "@/redux/features/auth/authThunks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await dispatch(fetchUserProfile());
      }
      setIsChecking(false);
    };
    checkAuth();
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading && !user && !isChecking) {
      router.replace("/login");
    }
  }, [user, loading, router, isChecking]);

  if (loading || isChecking) return <p>Checking authentication...</p>;

  if (!user) return null;

  return <>{children}</>;
}
