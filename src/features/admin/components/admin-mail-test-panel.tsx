"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAdminActions } from "@/features/admin/hooks";
import type { AdminTemplateType, AdminTestMailHistoryItem } from "@/features/admin/types";
import { isValidEmail } from "@/shared/lib/validators";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Toast } from "@/shared/ui/toast";

const TEMPLATE_OPTIONS = [
  { label: "WELCOME", value: "WELCOME" },
  { label: "NOTIFICATION", value: "NOTIFICATION" },
] as const;

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString("ko-KR", { hour12: false });
}

export function AdminMailTestPanel() {
  const { loading, error, message, sendTestMail } = useAdminActions();

  const [toEmail, setToEmail] = useState("");
  const [templateType, setTemplateType] = useState<AdminTemplateType>(TEMPLATE_OPTIONS[0].value);
  const [subject, setSubject] = useState("");
  const [variablesJson, setVariablesJson] = useState('{"race_name":"마라톤 꼼짝마", "open_at":"2026-03-20 09:00"}');
  const [localError, setLocalError] = useState<string | null>(null);
  const [history, setHistory] = useState<AdminTestMailHistoryItem[]>([]);
  const [dismissedError, setDismissedError] = useState<string | null>(null);
  const [dismissedMessage, setDismissedMessage] = useState<string | null>(null);

  const toastError = (error && error !== dismissedError ? error : null) ?? (localError && localError !== dismissedError ? localError : null);
  const toastMessage = message && message !== dismissedMessage ? message : null;
  const canSubmit = useMemo(() => !loading && isValidEmail(toEmail.trim()), [loading, toEmail]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDismissedError(null);
    setDismissedMessage(null);
    setLocalError(null);

    const normalizedEmail = toEmail.trim();
    if (!isValidEmail(normalizedEmail)) {
      setLocalError("올바른 수신 이메일을 입력해주세요.");
      return;
    }

    let parsedVariables: Record<string, unknown> = {};
    try {
      const parsed = variablesJson.trim().length === 0 ? {} : JSON.parse(variablesJson);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        parsedVariables = parsed as Record<string, unknown>;
      } else {
        setLocalError("변수 JSON은 객체 형태여야 합니다.");
        return;
      }
    } catch {
      setLocalError("변수 JSON 형식이 올바르지 않습니다.");
      return;
    }

    const response = await sendTestMail({
      to_email: normalizedEmail,
      template_type: templateType,
      subject: subject.trim() || undefined,
      variables: parsedVariables,
    });

    const sentAt = new Date().toISOString();
    if (response) {
      setHistory((prev) => [
        {
          id: crypto.randomUUID(),
          sent_at: sentAt,
          to_email: normalizedEmail,
          template_type: templateType,
          status: "success",
          detail: response.message ?? "테스트 발송 요청 성공",
        },
        ...prev,
      ]);
      return;
    }

    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        sent_at: sentAt,
        to_email: normalizedEmail,
        template_type: templateType,
        status: "error",
        detail: error ?? localError ?? "테스트 발송 요청 실패",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-4">
      <form className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600" htmlFor="admin-test-to-email">
              수신 이메일
            </label>
            <Input
              id="admin-test-to-email"
              autoComplete="email"
              placeholder="tester@example.com"
              type="email"
              value={toEmail}
              onChange={(event) => setToEmail(event.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600" htmlFor="admin-test-template-type">
              템플릿 타입
            </label>
            <select
              id="admin-test-template-type"
              className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 outline-none transition-all focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-200"
              value={templateType}
              onChange={(event) => setTemplateType(event.target.value as AdminTemplateType)}
            >
              {TEMPLATE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <label className="text-xs font-semibold text-gray-600" htmlFor="admin-test-subject">
            제목 (선택)
          </label>
          <Input
            id="admin-test-subject"
            placeholder="메일 제목 오버라이드"
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          />
        </div>

        <div className="mt-3 space-y-1">
          <label className="text-xs font-semibold text-gray-600" htmlFor="admin-test-variables">
            변수 JSON
          </label>
          <textarea
            id="admin-test-variables"
            className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-200"
            value={variablesJson}
            onChange={(event) => setVariablesJson(event.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            className="h-10 w-auto rounded-lg px-4 text-sm"
            disabled={!canSubmit}
            loading={loading}
            type="submit"
          >
            테스트 발송
          </Button>
        </div>
      </form>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">최근 테스트 요청</h3>
          <span className="text-xs font-medium text-gray-500">{history.length}건</span>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">아직 테스트 발송 이력이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <p className="text-xs font-medium text-gray-600">
                  {formatTime(item.sent_at)} · {item.template_type}
                </p>
                <p className="text-sm font-semibold text-gray-800">{item.to_email}</p>
                <p className={`text-xs font-semibold ${item.status === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {toastError && (
        <Toast
          message={toastError}
          variant="error"
          onClose={() => setDismissedError(toastError)}
        />
      )}
      {!toastError && toastMessage && (
        <Toast
          message={toastMessage}
          variant="success"
          onClose={() => setDismissedMessage(toastMessage)}
        />
      )}
    </div>
  );
}
