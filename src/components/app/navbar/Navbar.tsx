import NavbarTitle from './NavbarTitle'
import NavbarMenu from './NavbarMenu'
import HamburgerMenu from './HamburgerMenu'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-sm">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-12 md:h-14 lg:h-16">
          <NavbarTitle />
          <NavbarMenu />
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  )
}
