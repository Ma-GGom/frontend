import Link from "next/link";

interface AppFooterProps {
  className?: string;
}

export function AppFooter({ className = "" }: AppFooterProps) {
  return (
    <footer className={`mt-auto w-full pb-8 pt-2 ${className}`}>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
          <Link
            className="underline underline-offset-2 transition-colors hover:text-indigo-600"
            href="/privacy-policy"
          >
            개인정보처리방침
          </Link>
          <span className="text-gray-400">|</span>
          <a
            className="underline underline-offset-2 transition-colors hover:text-indigo-600"
            href="mailto:maggom.team@gmail.com"
          >
            maggom.team@gmail.com
          </a>
          <span className="text-gray-400">|</span>
          <a
            className="underline underline-offset-2 transition-colors hover:text-indigo-600"
            href="https://github.com/Ma-GGom"
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs font-medium tracking-wide text-gray-600">
          Copyright © {new Date().getFullYear()} 마꼼. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
