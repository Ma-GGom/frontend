import { VerifyCodeForm } from "@/features/auth/components/verify-code-form";

export default function VerifyCodePage() {
  return (
    <main className="mx-auto w-full max-w-[390px] space-y-5 px-4 py-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-slate-900">인증번호 검증</h1>
        <p className="text-sm text-slate-600">메일로 받은 6자리 인증번호를 입력하면 구독 설정 페이지로 이동합니다.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <VerifyCodeForm />
      </section>
    </main>
  );
}
