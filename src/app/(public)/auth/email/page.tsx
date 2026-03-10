import { EmailAuthForm } from "@/features/auth/components/email-auth-form";

export default function EmailAuthPage() {
  return (
    <main className="mx-auto w-full max-w-[390px] space-y-5 px-4 py-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-slate-900">이메일 인증번호 발송</h1>
        <p className="text-sm text-slate-600">구독 설정에 사용할 이메일을 입력해 인증번호를 받아주세요.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <EmailAuthForm />
      </section>
    </main>
  );
}
