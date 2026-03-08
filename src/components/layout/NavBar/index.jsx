/**
 * components/layout/NavBar/index.jsx
 * Sticky frosted-glass navigation bar.
 * Collapses into a hamburger on mobile.
 */

import { Link } from "react-router-dom";
import { memo, useCallback, useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useTheme } from "@/hooks/useTheme";
import styles from "./NavBar.module.css";

const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Case Studies", href: "/#case-studies" },
  { label: "Proof", href: "/#proof" },
  { label: "About", href: "/#about" },
  { label: "Footprint", href: "/#footprint" },
  { label: "Support", href: "/#support" },
  { label: "Connect", href: "/#connect" },
];

const NavBar = memo(function NavBar() {
  const { dark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Throttled scroll listener
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 28);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  return (
    <nav
      className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
      aria-label="Main navigation"
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="Home">
          &lt;Tejas Sabunkar /&gt;
        </Link>

        {/* Desktop links */}
        <div className={`${styles.desktopLinks} dt-only`}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} to={href} className="nav-link">
              {label}
            </Link>
          ))}
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
        </div>

        {/* Mobile controls */}
        <div className={`${styles.mobileControls} mb-only`}>
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={styles.hamburger}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={styles.bar}
                style={{
                  transform: menuOpen
                    ? i === 0
                      ? "rotate(45deg) translateY(7px)"
                      : i === 2
                        ? "rotate(-45deg) translateY(-7px)"
                        : "scaleX(0)"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={styles.drawer}
        style={{ maxHeight: menuOpen ? 420 : 0 }}
        aria-hidden={!menuOpen}
      >
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            to={href}
            onClick={closeMenu}
            className={styles.drawerLink}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
});

export default NavBar;
