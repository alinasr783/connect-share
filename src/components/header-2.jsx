'use client';
import React from 'react';
// Replace Next.js UI dependencies with project local components
import Button from '../ui/Button';
import { MenuToggleIcon } from './menu-toggle-icon.jsx';
import { useScroll } from './use-scroll.jsx';

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{ label: 'Why Us', href: '#why-us' },
		{ label: 'How It Works', href: '#how-it-works' },
		{ label: 'Testimonials', href: '#testimonials' },
		{ label: 'FAQ', href: '#faq' },
	];

	React.useEffect(() => {
		if (open) {
			// Disable scroll
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable scroll
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full border-b border-transparent md:transition-all md:ease-out bg-white/80 backdrop-blur-md shadow-md',
        {
          'supports-[backdrop-filter]:bg-white/60 border-gray-200 md:shadow': scrolled && !open,
          'bg-white/90': open,
        }
      )}
    >
      <nav
        className={cn(
          'flex h-14 w-full items-center justify-between px-4 md:h-16 md:transition-all md:ease-out',
          { 'md:px-2': scrolled }
        )}
      >
        {/* WordmarkIcon replaced by Logo for project consistency */}
        <span className="inline-block">
          <img
            src="https://i.ibb.co/mFDjvvsg/Generated-Image-October-22-2025-4-21-AM-1-1.png"
            alt="Connect Share logo"
            className="h-10 sm:h-12 inline-block object-contain"
          />
        </span>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-4 md:flex">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="text-gray-700 hover:text-primary rounded-md px-3 py-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(link.href.replace('#', ''));
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {link.label}
            </a>
          ))}
          <Button variation="secondary" to="/login">Sign In</Button>
          <Button variation="primary" to="/signup">Get Started</Button>
        </div>

        {/* Mobile Toggle */}
        <Button
          size="icon"
          variation="secondary"
          onClick={() => setOpen(!open)}
          className="md:hidden"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={cn(
          'bg-white/90 fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-2 p-4">
          <div className="grid gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                className="justify-start w-full text-left px-4 py-2 rounded-md hover:bg-primary/5 hover:text-primary transition-colors"
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(link.href.replace('#', ''));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <Button variation="secondary" to="/login" className="w-full">Sign In</Button>
            <Button variation="primary" to="/signup" className="w-full">Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
