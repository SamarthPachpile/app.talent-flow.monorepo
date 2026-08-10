import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    label: "Services",
    href: "/services",
    dropdown: [
      "CRM Consulting",
      "Salesforce Implementation",
      "HubSpot & Zoho Solutions",
      "AI-Powered Automation",
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    dropdown: [
      { label: "SaaS & Technology", href: "/industries/saas-technology" },
      { label: "Financial Services", href: "/industries/financial-services" },
      { label: "Healthcare & Life Sciences", href: "/industries/healthcare-life-sciences" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Retail & E-commerce", href: "/industries/retail-ecommerce" },
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Education", href: "/industries/education" },
      { label: "Professional Services", href: "/industries/professional-services" },
    ],
  },
  {
    label: "Portals",
    href: "#",
    dropdown: [
      { label: "Startup Admin Panel (Port 3001)", href: "http://localhost:3001", external: true },
      {
        label: "Company Onboarding Portal (Port 3002)",
        href: "http://localhost:3002",
        external: true,
      },
      { label: "Candidate Portal (Port 3003)", href: "http://localhost:3003", external: true },
    ],
  },
  { label: "Croton AI", href: "/velocity-ai", highlight: true },
  { label: "Insights", href: "/insights" },
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <>
      {/* ✅ HEADER (always on top) */}
      <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-1.5rem)] sm:w-[calc(100%-2.5rem)] max-w-[1400px]">
        <div
          className={`clip-path-nav-sm bg-background backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] ${
            openDropdown ? "border-transparent" : "border border-border/60"
          }`}
        >
          {" "}
          <div className="flex items-center justify-between pl-5 pr-2 sm:pl-7 sm:pr-2 py-2.5">
            {/* LOGO */}
            <Link to="/" className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-bold tracking-[0.8px] text-foreground">
                Croton<sup className="text-25px top-0 ml-0.5">®</sup>
              </span>
              <span className="text-9px sm:text-10px text-muted-foreground mt-0.5">
                A Tapasys Group Company
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  ref={(el) => {
                    navRefs.current[item.label] = el;
                  }}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`text-sm font-medium flex items-center gap-1 ${
                      item.highlight ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              ))}
            </nav>

            {/* RIGHT SIDE */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="flex items-center gap-1.5 text-sm text-foreground">
                <Globe className="w-4 h-4" />
                EN
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <Link
                to="/contact"
                className="clip-path-button-sm bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-gl-orange-hover transition-colors"
              >
                Talk to Sales
              </Link>
            </div>

            {/* MOBILE TOGGLE (Visible only below lg breakpoint) */}
            <button
              className="hidden max-lg:flex w-10 h-10 items-center justify-center text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ✅ FULL WIDTH DROPDOWN (separate layer below header) */}
      <AnimatePresence>
        {openDropdown && (
          <motion.div
            className="fixed top-0 left-0 w-full z-[100]"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onMouseEnter={() => setOpenDropdown(openDropdown)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <div className="w-full pt-24 bg-background/95 backdrop-blur-xl border-t border-border shadow-xl">
              <div className="max-w-[1400px] mx-auto px-8 py-8 grid grid-cols-3 gap-10">
                {/* LEFT */}
                <div>
                  <h4 className="text-sm font-semibold mb-4">{openDropdown}</h4>
                  <div className="flex flex-col gap-3">
                    {navItems
                      .find((i) => i.label === openDropdown)
                      ?.dropdown?.map((sub) =>
                        typeof sub === "string" ? (
                          <Link
                            key={sub}
                            to="/"
                            className="text-sm text-muted-foreground hover:text-primary transition"
                          >
                            {sub}
                          </Link>
                        ) : "external" in sub && sub.external ? (
                          <a
                            key={sub.label}
                            href={sub.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary font-medium transition flex items-center justify-between"
                          >
                            <span>{sub.label}</span>
                            <span className="text-10px px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                              Open
                            </span>
                          </a>
                        ) : (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            className="text-sm text-muted-foreground hover:text-primary transition"
                          >
                            {sub.label}
                          </Link>
                        ),
                      )}
                  </div>
                </div>

                {/* MIDDLE */}
                <div className="bg-[#18181b] border border-white/10 rounded-xl h-160px flex items-center justify-center text-sm text-muted-foreground">
                  Featured Content
                </div>

                {/* RIGHT */}
                <div className="bg-[#18181b] border border-white/10 rounded-xl h-160px flex items-center justify-center text-sm text-muted-foreground">
                  Blogs / Case Studies
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="hidden max-lg:block fixed top-[70px] left-2 right-2 z-[999] border border-border bg-background rounded-xl shadow-xl p-4"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="block py-3 text-sm border-b"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (!mounted) return content;

  const targetEl = document.querySelector(".croton-scope") || document.body;
  return createPortal(content, targetEl);
}
