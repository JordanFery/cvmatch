import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CVMatch — Optimisez votre CV pour chaque offre d'emploi",
    short_name: "CVMatch",
    description: "Adaptez votre CV aux offres d'emploi et centralisez vos candidatures.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    lang: "fr",
    icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
  };
}
