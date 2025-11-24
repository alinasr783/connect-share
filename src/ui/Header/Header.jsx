import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
// Removed old LoginBtns usage to render exact actions per new header design
import { Link } from "react-router-dom";
import { Button as ShButton } from "../../components/ui/button.jsx";
import { MenuToggleIcon } from "../../components/menu-toggle-icon.jsx";
import { useScroll } from "../../components/use-scroll.jsx";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Header() {
  const [open, setOpen] = useState(false);
  const scrolled = useScroll(10);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Mobile-only links (same data as NavLinks)
  const links = [
    { label: "Why Us", sectionId: "why-us" },
    { label: "How It Works", sectionId: "how-it-works" },
    { label: "Testimonials", sectionId: "testimonials" },
    { label: "FAQ", sectionId: "faq" },
  ];

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <header
      className={cn(
        // Exact container behavior from new header-2: sticky with blur, border, rounded on md, constrained width
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out bg-white/80 backdrop-blur-md",
        scrolled && !open &&
          "supports-[backdrop-filter]:bg-white/60 border-gray-200 backdrop-blur-lg md:top-4 md:max-w-4xl md:shadow",
        open && "bg-white/90"
      )}
    >
      <nav
        className={cn(
          // Match header-2 heights and spacing
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          scrolled && "md:px-2"
        )}
      >
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLinks />
          <ShButton variant="ghost" asChild>
            <Link to="/articles">Articles</Link>
          </ShButton>
          <ShButton variant="outline" asChild className="text-gray-700">
            <Link to="/login">login</Link>
          </ShButton>
          <ShButton className="text-white" asChild>
            <Link to="/signup">Get Started</Link>
          </ShButton>
        </div>

        {/* Mobile menu toggle - outline icon button */}
        <ShButton
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </ShButton>
      </nav>

      {open && createPortal(
        <div className={cn("fixed top-14 right-0 bottom-0 left-0 z-[60] flex flex-col overflow-hidden border-y bg-white/90 md:hidden")}> 
          <div className="flex h-full w-full flex-col justify-between gap-y-4 p-4">
            <div className="grid gap-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={`#${link.sectionId}`}
                  onClick={(e) => scrollToSection(e, link.sectionId)}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link to="/articles" onClick={() => setOpen(false)} className="w-full text-left px-4 py-2 rounded-md hover:bg-primary/5 hover:text-primary transition-colors">Articles</Link>
            </div>
            <div className="flex flex-col gap-2">
              <ShButton variant="outline" asChild className="w-full text-gray-700">
                <Link to="/login">Login</Link>
              </ShButton>
              <ShButton asChild className="w-full text-white">
                <Link to="/signup">Get Started</Link>
              </ShButton>
            </div>
          </div>
        </div>, document.body)
      }
    </header>
  );
}

export default Header;
