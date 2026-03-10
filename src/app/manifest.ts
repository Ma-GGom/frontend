import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ma-GGom",
    short_name: "Ma-GGom",
    description: "국내 마라톤 일정 큐레이션 이메일 서비스",
    start_url: "/",
    display: "standalone",
    background_color: "#eef9ff",
    theme_color: "#0a84ff",
    lang: "ko",
  };
}
