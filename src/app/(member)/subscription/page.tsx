import { SubscriptionForm } from "@/features/subscription/components/subscription-form";

export default function SubscriptionPage() {
  return (
    <main className="mx-auto w-full max-w-[390px] space-y-5 px-4 py-6">
      <header className="space-y-2">
        <h1 className="text-xl font-bold text-slate-900">구독 설정</h1>
        <p className="text-sm text-slate-600">요일/시간/지역/거리 기준으로 알림 수신 조건을 설정하세요.</p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <SubscriptionForm />
      </section>
    </main>
  );
}
