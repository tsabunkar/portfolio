/**
 * components/layout/BaseLayout.jsx
 * Consistent wrapper for all pages.
 */
import BackgroundMotion from "./BackgroundMotion";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function BaseLayout({ children }) {
  return (
    <>
      <BackgroundMotion />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
