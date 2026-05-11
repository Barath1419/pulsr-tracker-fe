"use client";

import { useEffect, useRef } from "react";
import { googleSignIn } from "@/lib/api";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, config: object) => void;
        };
      };
    };
  }
}

interface Props {
  onError?: (msg: string) => void;
}

export default function GoogleSignInButton({ onError }: Props) {
  const router = useRouter();
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    function init() {
      if (!window.google || !btnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            const data = await googleSignIn(response.credential);
            localStorage.setItem("token", data.access_token);
            router.push("/app");
          } catch {
            onError?.("Google sign-in failed. Please try again.");
          }
        },
      });
      window.google.accounts.id.renderButton(btnRef.current!, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        width: btnRef.current!.offsetWidth || 360,
        text: "continue_with",
        logo_alignment: "left",
      });
    }

    // If script already loaded
    if (window.google) { init(); return; }

    // Load GSI script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = init;
    document.head.appendChild(script);
  }, [router, onError]);

  return <div ref={btnRef} className="w-full" />;
}
