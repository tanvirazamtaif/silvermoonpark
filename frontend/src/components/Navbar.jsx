import { useState, useEffect } from 'react'
import { smoothScrollTo } from '../utils/scrollReveal'
import './Navbar.css'

// Custom golden moon logo - place your image in frontend/public/moon-logo.png
const moonLogo = '/moon-logo.png'

const Navbar = ({ theme, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (sectionId) => {
    smoothScrollTo(sectionId)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => handleNavClick('hero')}>
          <img
            src={moonLogo}
            alt="Silvermoon Logo"
            className="logo-moon-image"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.textContent = '🌙 Silvermoon Park'
            }}
          />
          <span className="logo-text">Silvermoon Park</span>
        </div>

        <button
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <button className="nav-link" onClick={() => handleNavClick('hero')}>
            Home
          </button>
          <button className="nav-link" onClick={() => handleNavClick('explore')}>
            Explore
          </button>
          <button className="nav-link" onClick={() => handleNavClick('gallery')}>
            Gallery
          </button>
          <button className="nav-link" onClick={() => handleNavClick('booking')}>
            Booking
          </button>
          <button className="nav-link" onClick={() => handleNavClick('contact')}>
            Contact
          </button>
          <a
            href="https://maps.app.goo.gl/NzEHN5Jpy4izMvAP7"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link map-link"
          >
            Map
          </a>

          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
