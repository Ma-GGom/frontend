import Link from "next/link";
import { AppFooter } from "@/shared/ui/footer";

export default function ContactPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-6 pt-8 sm:px-6 sm:pt-10">
      <section className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-[0_10px_30px_rgba(79,70,229,0.08)] sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">Contact</h1>
          <Link
            className="inline-flex items-center text-sm font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
            href="/"
          >
            홈으로
          </Link>
        </div>

        <div className="space-y-5 text-sm leading-7 text-gray-700">
          <section className="space-y-1">
            <h2 className="text-base font-bold text-gray-900">공식 이메일</h2>
            <a
              className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
              href="mailto:maggom.team@gmail.com"
            >
              maggom.team@gmail.com
            </a>
          </section>

          <section className="space-y-1">
            <h2 className="text-base font-bold text-gray-900">GitHub</h2>
            <a
              className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
              href="https://github.com/Ma-GGom"
              rel="noreferrer"
              target="_blank"
            >
              https://github.com/Ma-GGom
            </a>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-gray-900">Support</h2>
            <p>이 서비스가 도움이 되셨다면, 커피 한 잔으로 응원해 주세요.</p>
            <a
              className="inline-flex h-10 items-center rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
              href="https://ctee.kr/place/fakerdeft/donation"
              rel="noreferrer"
              target="_blank"
            >
              커피 한 잔 후원하기
            </a>
          </section>
        </div>
      </section>

      <AppFooter />
    </main>
  );
}
