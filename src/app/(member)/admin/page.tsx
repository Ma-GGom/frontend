import Link from "next/link";
import { AdminMailTestPanel } from "@/features/admin/components/admin-mail-test-panel";
import { AppFooter } from "@/shared/ui/footer";

export default function AdminPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-3 pb-2 pt-2 sm:px-5 sm:pt-3 lg:px-6">
      <section className="flex-1 px-4 pb-2 pt-4 sm:px-5 sm:pb-3 sm:pt-5">
        <header className="mb-3 sm:mb-4">
          <div className="mb-2 flex items-center justify-between">
            <Link
              className="inline-flex h-9 items-center text-xl font-bold leading-none text-gray-600 transition-colors hover:text-indigo-600"
              href="/settings"
            >
              ⟵
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">관리자</h1>
          <p className="mt-1 text-sm font-medium text-gray-600">
            템플릿 타입/변수로 테스트 메일 발송을 검증합니다.
          </p>
        </header>

        <AdminMailTestPanel />
      </section>

      <AppFooter />
    </main>
  );
}
