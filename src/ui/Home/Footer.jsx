import {memo} from "react";
import {Link} from "react-router-dom";

const links = [
  {label: "Terms of Service", href: "/terms-of-service"},
  {label: "Privacy Policy", href: "/privacy-policy"},
  {label: "Contact Us", href: "/contact-us"},
];

// Memoized footer link component
const FooterLink = ({link}) => (
  <Link
    to={link.href}
    className="text-gray-600 text-sm hover:text-[var(--color-primary)] transition-colors duration-200">
    {link.label}
  </Link>
);

function Footer() {
  return (
    <footer className="border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex md:flex-row flex-col gap-4 items-center justify-between">
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <FooterLink key={link.label} link={link} />
          ))}
        </div>

        <div className=" border-t border-gray-100 flex items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Connect Share. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
