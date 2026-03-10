"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuthActions } from "@/features/auth/hooks";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { isValidEmail } from "@/shared/lib/validators";

export function EmailAuthForm() {
  const [email, setEmail] = useState("");
  const { sendCode, loading, message, error } = useAuthActions();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      return;
    }

    await sendCode(email);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          이메일
        </label>
        <Input
          id="email"
          name="email"
          placeholder="user@example.com"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <Button className="w-full" loading={loading} type="submit">
        인증번호 발송
      </Button>

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Link className="inline-flex text-sm font-medium text-brand-600 hover:text-brand-700" href="/auth/verify">
        인증번호를 받으셨나요? 검증하러 가기
      </Link>
    </form>
  );
}
