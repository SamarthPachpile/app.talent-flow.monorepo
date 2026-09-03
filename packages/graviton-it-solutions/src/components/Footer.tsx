import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const footerLinks = {
  col1: [
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Our Team", href: "/velocity-ai" },
    { label: "Insights", href: "/insights" },
  ],
  col2: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
  ],
};

export default function Footer() {
  return (
    <footer
      id="footer"
      data-section="footer"
      data-label="Footer"
      className="bg-[#505773] text-white"
    >
      <div className="max-w-[1400px] mx-auto py-12 sm:py-16 px-5 sm:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          {/* Column 1 */}
          <div className="space-y-3 sm:space-y-5">
            {footerLinks.col1.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-2xl sm:text-3xl md:text-4xl hover:opacity-80 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-3 sm:space-y-5">
            {footerLinks.col2.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-2xl sm:text-3xl md:text-4xl hover:opacity-80 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="flex flex-col justify-between gap-6">
            <p className="text-2xl sm:text-3xl md:text-4xl leading-tight text-white/80 max-w-md">
              Let's unify your HR services, candidate tracking, and employee lifecycle
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 transition rounded-full px-6 py-3 w-fit"
            >
              <span className="font-medium">Get in touch with HR Sales</span>

              {/* Circular Arrow */}
              <span className="ml-4 bg-white text-black rounded-full p-2 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-white/60">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Compliance & Disclosures
            </a>
          </div>

          <p className="text-center md:text-left">
            © 2026 Copyright Graviton Inc. All rights reserved.
          </p>

          <div className="text-white/80">Made with ❤️ by SamarthPachpile</div>
        </div>
      </div>
    </footer>
  );
}
