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
    <ul className="hidden gap-8 md:flex">
      {links.map((link) => (
        <li
          key={link.label}
          className="text-gray-600 lg:text-lg text-md hover:underline 
            hover:underline-offset-4 hover:text-primary transition-all duration-300
            cursor-pointer"
          onClick={(e) => scrollToSection(e, link.sectionId)}>
          {link.label}
        </li>
      ))}
    </ul>
  );
}

export default NavLinks;
