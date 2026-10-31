import { Link } from "react-router-dom";

export default function SiteFooter({ hideCta = false }: { hideCta?: boolean }) {
  return (
    <footer className="foot">
      {!hideCta && (
        <div className="foot-cta reveal">
          <span className="kicker">Get started</span>
          <h2>
            Ready to move money <span className="serif">your way?</span>
          </h2>
          <p>
            Whatever you're building — storefront, platform, or finance team — the rails are
            the same. Book a 30-minute intro.
          </p>
          <div className="row">
            <Link to="/contact" className="btn btn-primary">Book a call</Link>
            <Link to="/products#api" className="btn btn-ghost">Read the docs</Link>
          </div>
        </div>
      )}

      <div className="foot-band">
        <div className="foot-band-inner">
          <div className="band-cols">
            <div className="band-col band-brand">
              <div className="markline">
                <span className="logo-mark">
                  <img className="logo-dk" src="/logo-yellow.png" alt="" width={26} height={26} />
                  <img className="logo-lt" src="/logo-green.png" alt="" width={26} height={26} />
                </span>
                <span className="wm">Coinomad</span>
              </div>
              <p>Stablecoin settlement &amp; infrastructure — built in Africa, live in 7 markets, rails everywhere.</p>
              <div className="socials">
                <a
                  href="https://x.com/Coinomad_labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61584409996319"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/coinomad"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/coinomad_labs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="band-col">
              <h4>Products</h4>
              <Link to="/products#links">Payment links &amp; widget</Link>
              <Link to="/products#accounts">Treasury accounts</Link>
              <Link to="/products#api">Enterprise API</Link>
            </div>
            <div className="band-col">
              <h4>Company</h4>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="band-legal">
            <span>© 2026 Coinomad</span>
          </div>
        </div>
      </div>

      <div className="foot-mega" id="footMega">
        <span className="mega-line">Coinomad</span>
        <div className="mega-sub">
          Stablecoin Settlement Infrastructure · <b>7 markets, both directions</b>
        </div>
      </div>

      <div className="foot-base">
        <span className="marks">
          <i>🇳🇬 NGN</i>
          <i>🇺🇸 USD</i>
          <i>🇪🇺 EUR</i>
          <i>🇬🇧 GBP</i>
          <i>🇨🇦 CAD</i>
          <i>🇲🇽 MXN</i>
          <i>🇧🇷 BRL</i>
        </span>
      </div>
    </footer>
  );
}
