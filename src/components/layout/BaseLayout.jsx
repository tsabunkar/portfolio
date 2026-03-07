/**
 * components/layout/BaseLayout.jsx
 * Consistent wrapper for all pages.
 */
import BackgroundMotion from "./BackgroundMotion";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";

export default function BaseLayout({ children }) {
  const { zenMode } = useTheme();

  return (
    <>
      {!zenMode && <BackgroundMotion />}
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
