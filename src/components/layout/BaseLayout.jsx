import { useLocation } from "react-router-dom";
import BackgroundMotion from "./BackgroundMotion";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useTheme } from "@/hooks/useTheme";

export default function BaseLayout({ children }) {
  const { zenMode } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <BackgroundMotion isHomePage={isHomePage} zenMode={zenMode} />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
