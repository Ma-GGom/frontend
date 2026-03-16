import type { Metadata } from "next";
import Link from "next/link";
import { AppFooter } from "@/shared/ui/footer";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "마꼼 서비스의 개인정보 처리방침 안내 페이지입니다.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
      <section className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">개인정보처리방침</h1>
          <Link
            className="inline-flex items-center text-sm font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
            href="/"
          >
            홈으로
          </Link>
        </div>

        <div className="space-y-5 text-sm leading-7 text-gray-700">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">1. 수집 항목</h2>
            <p>서비스는 이메일 인증 및 구독 알림 제공을 위해 이메일 주소를 수집합니다.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">2. 이용 목적</h2>
            <p>수집한 이메일은 인증 코드 발송, 구독 알림 발송, 구독 설정 관리 목적으로 사용됩니다.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">3. 보유 및 이용 기간</h2>
            <p>회원 탈퇴(구독 해지) 시 관련 개인정보는 지체 없이 파기합니다. 단, 법령에 따른 보존 의무가 있는 경우 해당 기간 동안 보관할 수 있습니다.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">4. 이용자 권리</h2>
            <p>이용자는 언제든지 구독 해지를 통해 개인정보 삭제를 요청할 수 있습니다.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">5. 문의</h2>
            <p>
              개인정보 관련 문의는{" "}
              <a
                className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
                href="mailto:maggom.team@gmail.com"
              >
                maggom.team@gmail.com
              </a>
              으로 접수할 수 있습니다.
            </p>
          </section>
        </div>
      </section>

      <AppFooter />
    </main>
  );
}
