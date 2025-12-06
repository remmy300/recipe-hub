"use client";
import { useEffect, useCallback } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { userGoogleLogin } from "@/redux/features/auth/authThunks";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            container: HTMLElement,
            options?: { theme?: string; size?: string; width?: string | number }
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const GoogleAuthBtn = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleGoogleResponse = useCallback(
    (response: { credential?: string }) => {
      if (!response.credential) return;

      dispatch(userGoogleLogin({ token: response.credential }));
      router.push("/add-recipe");
      console.log("REDIRECT SHOULD HAPPEN NOW");
    },

    [dispatch, router]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!clientId) return;
      if (typeof window === "undefined") return;
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });

      const btn = document.getElementById("googleLoginBtn");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          width: 300,
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [handleGoogleResponse]);

  return (
    <div className="flex justify-center mt-4">
      <div id="googleLoginBtn" />
    </div>
  );
};

export default GoogleAuthBtn;
