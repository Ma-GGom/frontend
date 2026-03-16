import type { Metadata } from "next";
import { Landing } from "@/features/home/components/landing";

export const metadata: Metadata = {
  title: {
    absolute: "마꼼",
  },
  description:
    "마꼼은 다양한 국내 마라톤 정보를 이메일로 보내드려요. 원하는 시간대와 조건으로 구독해 보세요.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <Landing />;
}
