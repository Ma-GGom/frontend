import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const SITE_URL = "https://maggom.com";
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const naverSiteVerification = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "마꼼 | 마라톤 정보 메일링 서비스",
    template: "%s | 마꼼",
  },
  description:
    "마꼼은 다양한 국내 마라톤 정보를 이메일로 보내드려요. 원하는 시간대와 조건으로 구독해 보세요.",
  keywords: [
    "마라톤",
    "마라톤 정보",
    "마라톤 일정",
    "마라톤 접수",
    "러닝",
    "대회 알림",
    "마꼼",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "마꼼",
    title: "마꼼 | 마라톤 정보 메일링 서비스",
    description:
      "마꼼은 다양한 국내 마라톤 정보를 이메일로 보내드려요. 원하는 시간대와 조건으로 구독해 보세요.",
  },
  twitter: {
    card: "summary_large_image",
    title: "마꼼 | 마라톤 정보 메일링 서비스",
    description:
      "마꼼은 다양한 국내 마라톤 정보를 이메일로 보내드려요. 원하는 시간대와 조건으로 구독해 보세요.",
  },
  verification: {
    google: googleSiteVerification,
    ...(naverSiteVerification
      ? {
          other: {
            "naver-site-verification": naverSiteVerification,
          },
        }
      : {}),
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
