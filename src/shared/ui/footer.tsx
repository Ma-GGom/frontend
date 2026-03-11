interface AppFooterProps {
  className?: string;
}

export function AppFooter({ className = "" }: AppFooterProps) {
  return (
    <footer className={`mt-auto w-full pb-8 pt-2 text-center ${className}`}>
      <p className="text-xs font-medium tracking-wide text-gray-600">
        Copyright © {new Date().getFullYear()} 마꼼. All rights reserved.
      </p>
    </footer>
  );
}
