function NavLinks() {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  };

  const links = [
    {label: "Why Us", sectionId: "why-us"},
    {label: "How It Works", sectionId: "how-it-works"},
    {label: "Testimonials", sectionId: "testimonials"},
    {label: "FAQ", sectionId: "faq"},
  ];

  return (
    <ul className="hidden gap-6 md:flex">
      {links.map((link) => (
        <li
          key={link.label}
          className="text-gray-700 lg:text-lg text-md hover:text-primary transition-all duration-200 cursor-pointer relative group"
          onClick={(e) => scrollToSection(e, link.sectionId)}>
          <span className="px-2 py-1 rounded-md group-hover:bg-primary/5 group-hover:text-primary transition-colors duration-200">
            {link.label}
          </span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0.5 bg-primary group-hover:w-3/4 transition-all duration-300"></span>
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
