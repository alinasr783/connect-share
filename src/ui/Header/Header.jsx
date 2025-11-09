import LoginBtns from "./LoginBtns";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between sm:px-8 px-4 sm:py-4 py-3 border-b border-gray-200/70 bg-white/80 backdrop-blur-md shadow-md">
      <Logo />
      <NavLinks />
      <LoginBtns />
    </header>
  );
}

export default Header;
