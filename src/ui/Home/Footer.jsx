import {Link} from "react-router-dom";

function Footer() {
  const links = [
    {label: "Terms of Service", href: "/terms-of-service"},
    {label: "Privacy Policy", href: "/privacy-policy"},
    {label: "Contact Us", href: "/contact-us"},
  ];

  return (
    <footer
      className="flex flex-col sm:flex-row justify-between items-center 
        border-t border-gray-200 py-8
            px-8 gap-4 sm:gap-0">
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="text-gray-600 text-sm hover:text-gray-900">
            {link.label}
          </Link>
        ))}
      </div>

      <div>
        <h3 className="text-gray-600 text-sm text-center sm:text-left">
          &copy; {new Date().getFullYear()} Connect Share. All rights reserved.
        </h3>
      </div>
    </footer>
  );
}

export default Footer;
