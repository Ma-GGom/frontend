"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";
import { SettingsAuthModal } from "@/features/home/components/settings-auth-modal";
import { getAuthTokenFromCookie } from "@/shared/lib/storage";
import { Button } from "@/shared/ui/button";

export function LandingHeader() {
  const router = useRouter();
  const hydrateAuthToken = useAuthStore((state) => state.hydrateAuthToken);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    hydrateAuthToken();
  }, [hydrateAuthToken]);

  const handleSettingsClick = () => {
    const cookieToken = getAuthTokenFromCookie();
    if (cookieToken) {
      router.push("/settings");
      return;
    }

    setIsAuthModalOpen(true);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex w-full max-w-5xl justify-end px-3 pt-4 sm:px-6 sm:pt-5">
        <Button
          className="h-10 w-auto rounded-lg px-4 text-sm shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
          type="button"
          onClick={handleSettingsClick}
        >
          설정
        </Button>
      </div>
      {isAuthModalOpen && (
        <SettingsAuthModal onClose={() => setIsAuthModalOpen(false)} onSuccess={() => router.push("/settings")} />
      )}
    </header>
  );
}
