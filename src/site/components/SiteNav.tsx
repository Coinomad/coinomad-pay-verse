import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../theme";

export type PageKey = "home" | "products" | "blog" | "contact";

const LINKS: { to: string; label: string; key: PageKey }[] = [
  { to: "/", label: "Home", key: "home" },
  { to: "/products", label: "Products", key: "products" },
  { to: "/blog", label: "Blog", key: "blog" },
  { to: "/contact", label: "Contact", key: "contact" },
];

export default function SiteNav({
  active,
  scrolled,
}: {
  active: PageKey;
  scrolled: boolean;
}) {
  const { toggle } = useTheme();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // close on outside click / Escape (mirrors the mockup's behaviour)
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav" ref={navRef}>
      <div className="nav-inner">
        <Link className="logo" to="/">
          <span className="logo-mark">
            <img className="logo-dk" src="/logo-yellow.png" alt="" width={30} height={30} />
            <img className="logo-lt" src="/logo-green.png" alt="" width={30} height={30} />
          </span>
          Coinomad
        </Link>

        <div className="links">
          {LINKS.map((l) => (
            <Link key={l.key} to={l.to} style={{ opacity: active === l.key ? 1 : undefined }}>
              {l.label}
            </Link>
          ))}
          <a
            href="https://coinomad-864d63d8.mintlify.site"
            target="_blank"
            rel="noopener noreferrer"
          >
            Developer
          </a>
        </div>

        <div className="nav-right">
          <button
            className="theme-toggle"
            aria-label="Toggle light mode"
            title="Toggle theme"
            onClick={toggle}
          >
            <svg className="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg className="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          </button>

          <a href="https://app.coinomad.xyz" className="btn btn-ghost">Sign in</a>
          <Link to="/contact" className="btn btn-primary">Book a call</Link>

          <button
            id="menuToggle"
            className={`menu-toggle${menuOpen ? " open" : ""}`}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobileMenu" className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link
            key={l.key}
            to={l.to}
            className={active === l.key ? "on" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <a
          href="https://coinomad-864d63d8.mintlify.site"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuOpen(false)}
        >
          Developer
        </a>
        <div className="mm-btns">
          <a href="https://app.coinomad.xyz" className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
            Sign in
          </a>
          <Link to="/contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Book a call
          </Link>
        </div>
      </div>
    </nav>
  );
}
