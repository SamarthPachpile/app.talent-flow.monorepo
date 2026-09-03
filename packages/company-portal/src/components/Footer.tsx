import React from "react";
import { ArrowRight } from "lucide-react";

export interface FooterProps {
  onContactClick?: () => void;
  contactHref?: string;
  linksCol1?: { label: string; href: string; onClick?: () => void }[];
  linksCol2?: { label: string; href: string; onClick?: () => void }[];
}

export const Footer: React.FC<FooterProps> = ({
  onContactClick,
  contactHref = "/companies/register",
  linksCol1 = [
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Our Team", href: "/velocity-ai" },
    { label: "Insights", href: "/insights" },
  ],
  linksCol2 = [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
  ],
}) => {
  return (
    <footer
      id="footer"
      data-section="footer"
      data-label="Footer"
      className="w-full bg-[#505773] text-white font-sans mt-auto"
    >
      <div className="max-w-[1400px] mx-auto py-12 sm:py-16 px-5 sm:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
          {/* Column 1 */}
          <div className="space-y-3 sm:space-y-5">
            {linksCol1.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={
                  link.onClick
                    ? (e) => {
                        e.preventDefault();
                        link.onClick!();
                      }
                    : undefined
                }
                className="block text-2xl sm:text-3xl md:text-4xl hover:opacity-80 transition cursor-pointer font-light"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-3 sm:space-y-5">
            {linksCol2.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={
                  link.onClick
                    ? (e) => {
                        e.preventDefault();
                        link.onClick!();
                      }
                    : undefined
                }
                className="block text-2xl sm:text-3xl md:text-4xl hover:opacity-80 transition cursor-pointer font-light"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Section */}
          <div className="flex flex-col justify-between gap-6">
            <p className="text-2xl sm:text-3xl md:text-4xl leading-tight text-white/80 max-w-md font-light">
              Let's start engineering impact for your business
            </p>

            {onContactClick ? (
              <button
                type="button"
                onClick={onContactClick}
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 transition rounded-full px-6 py-3 w-fit cursor-pointer shadow-md text-white font-medium"
              >
                <span>Get in touch</span>
                <span className="ml-4 bg-white text-black rounded-full p-2 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            ) : (
              <a
                href={contactHref}
                className="inline-flex items-center bg-orange-500 hover:bg-orange-600 transition rounded-full px-6 py-3 w-fit cursor-pointer shadow-md text-white font-medium"
              >
                <span>Get in touch</span>
                <span className="ml-4 bg-white text-black rounded-full p-2 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-white/60">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Compliance & Disclosures
            </a>
          </div>

          <p className="text-center md:text-left">
            © 2026 Copyright Graviton Inc. All rights reserved.
          </p>

          <div className="text-white/80 font-medium">Made with ❤️ by SamarthPachpile</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
