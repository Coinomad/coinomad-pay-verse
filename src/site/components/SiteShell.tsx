import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../theme";
import SiteNav, { type PageKey } from "./SiteNav";
import SiteFooter from "./SiteFooter";

const REVEAL_THRESHOLD: Record<PageKey, number> = {
  home: 0.12,
  products: 0.14,
  blog: 0.12,
  contact: 0.2,
};

export default function SiteShell({
  page,
  children,
  hideFooterCta = false,
}: {
  page: PageKey;
  children: React.ReactNode;
  hideFooterCta?: boolean;
}) {
  const { theme } = useTheme();
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // nav scrolled state
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 80);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll to top on page change (or to anchor when a hash is present)
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        const id = setTimeout(() => el.scrollIntoView(), 0);
        return () => clearTimeout(id);
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  // reveal-on-scroll + footMega + page-specific interactions
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // reveal
    let io: IntersectionObserver | null = null;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { threshold: REVEAL_THRESHOLD[page] }
      );
      els.forEach((el) => io?.observe(el));
    } else {
      els.forEach((el) => el.classList.add("in"));
    }

    // giant wordmark reveal
    let megaIo: IntersectionObserver | null = null;
    const mega = root.querySelector<HTMLElement>("#footMega");
    if (mega) {
      if ("IntersectionObserver" in window) {
        megaIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                megaIo?.disconnect();
              }
            });
          },
          { threshold: 0.25 }
        );
        megaIo.observe(mega);
      } else {
        mega.classList.add("in");
      }
    }

    // use-case accordion (home only)
    let accordionCleanup: (() => void) | null = null;
    if (page === "home") {
      const rows = Array.from(root.querySelectorAll<HTMLElement>(".uc-row"));
      // Mobile (<=600px): the WHOLE card is the tap target — tapping it (including the
      // "Tap for details" pill area) flips between the animation and the write-up.
      // Desktop: only the header toggles, since the panel already sits open beside the scene.
      const mobileMq = window.matchMedia("(max-width:600px)");
      const handler = (e: Event) => {
        const row = e.currentTarget as HTMLElement;
        const target = e.target as HTMLElement;
        if (!mobileMq.matches && !target.closest(".uc-head")) return;
        const isOpen = row.classList.contains("open");
        rows.forEach((r) => {
          r.classList.remove("open");
          r.querySelector(".uc-head")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          row.classList.add("open");
          row.querySelector(".uc-head")?.setAttribute("aria-expanded", "true");
        }
      };
      rows.forEach((r) => r.addEventListener("click", handler));
      accordionCleanup = () => rows.forEach((r) => r.removeEventListener("click", handler));
    }

    // blog tab filter (blog only)
    let tabsCleanup: (() => void) | null = null;
    if (page === "blog") {
      const tabs = Array.from(root.querySelectorAll<HTMLElement>(".tab"));
      const handler = (e: Event) => {
        tabs.forEach((x) => x.classList.remove("on"));
        (e.currentTarget as HTMLElement).classList.add("on");
      };
      tabs.forEach((t) => t.addEventListener("click", handler));
      tabsCleanup = () => tabs.forEach((t) => t.removeEventListener("click", handler));
    }

    return () => {
      io?.disconnect();
      megaIo?.disconnect();
      accordionCleanup?.();
      tabsCleanup?.();
    };
  }, [page]);

  // custom cursor
  useEffect(() => {
    const fine = window.matchMedia("(pointer:fine)").matches;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || rm) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    root.classList.add("cur-on");
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx;
    let ry = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      dot.style.transform = `translate(${tx}px,${ty}px)`;
      const hot = (e.target as Element | null)?.closest?.("a,button,.uc-head,.tab");
      root.classList.toggle("hovering", !!hot);
      const inv = (e.target as Element | null)?.closest?.(".foot-band");
      root.classList.toggle("inverted", !!inv);
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    let raf = 0;
    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      root.classList.remove("cur-on", "hovering", "inverted");
    };
  }, []);

  // sync body background/color with the theme (and restore on unmount)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const apply = () => {
      const cs = getComputedStyle(root);
      document.body.style.background = cs.backgroundColor;
      document.body.style.color = cs.color;
    };
    apply();
    return () => {
      document.body.style.background = "";
      document.body.style.color = "";
    };
  }, [theme]);

  return (
    <div
      className={`site-root site-${page}`}
      data-theme={theme === "light" ? "light" : undefined}
      ref={rootRef}
    >
      <SiteNav active={page} scrolled={scrolled} />
      {children}
      <SiteFooter hideCta={hideFooterCta} />
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef}>
        <div className="cursor-ring-core" />
      </div>
    </div>
  );
}
