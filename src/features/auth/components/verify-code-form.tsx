"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/features/auth/hooks";
import { useAuthStore } from "@/features/auth/store";
import { isValidEmail, isValidVerificationCode } from "@/shared/lib/validators";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export function VerifyCodeForm() {
  const router = useRouter();
  const savedEmail = useAuthStore((state) => state.email);
  const [email, setEmail] = useState(savedEmail);
  const [code, setCode] = useState("");
  const { verifyCode, loading, message, error } = useAuthActions();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email) || !isValidVerificationCode(code)) {
      return;
    }

    const result = await verifyCode(email, code);
    if (result?.success) {
      router.push("/subscription");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="verify-email">
          이메일
        </label>
        <Input
          id="verify-email"
          name="verify-email"
          placeholder="user@example.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="verify-code">
          인증번호 (6자리)
        </label>
        <Input
          id="verify-code"
          inputMode="numeric"
          maxLength={6}
          name="verify-code"
          pattern="\d{6}"
          placeholder="123456"
          required
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      </div>

      <Button className="w-full" loading={loading} type="submit">
        인증 검증
      </Button>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
