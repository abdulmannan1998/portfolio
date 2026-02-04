import { CSSPreloader } from "@/components/css-preloader";

/**
 * Next.js loading UI - shows instantly while page.tsx loads
 * This provides an instant response before any JS bundles download
 */
export default function Loading() {
  return <CSSPreloader />;
}
