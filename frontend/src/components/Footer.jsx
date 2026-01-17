import { useState, useEffect } from 'react'
import { smoothScrollTo } from '../utils/scrollReveal'
import './Footer.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  // Contact and social data from API
  const [contactData, setContactData] = useState({
    phone: '01813237028',
    email: 'silvermoonpark000@gmail.com',
    address: '2FQ5+6H3 Lohagachia, Gazipur, Dhaka, Bangladesh',
    mapLink: ''
  })

  const [socialData, setSocialData] = useState({
    facebook: 'https://www.facebook.com/share/15scptUXVX/',
    instagram: 'https://www.instagram.com/silvermoon_park',
    twitter: 'https://twitter.com'
  })

  // Fetch contact and social data from API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE}/site-content/`)
        if (response.ok) {
          const data = await response.json()
          setContactData({
            phone: data.phone || contactData.phone,
            email: data.email || contactData.email,
            address: data.address || contactData.address,
            mapLink: data.map_link || ''
          })
          setSocialData({
            facebook: data.facebook || socialData.facebook,
            instagram: data.instagram || socialData.instagram,
            twitter: data.twitter || socialData.twitter
          })
        }
      } catch (error) {
        console.error('Error fetching site content:', error)
        // Keep default values on error
      }
    }
    fetchContent()
  }, [])

  return (
    <footer id="contact" className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Silvermoon Park</h3>
          <p className="footer-text">
            Experience luxury and tranquility at our premium park resort.
            Creating unforgettable memories since 2026.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => smoothScrollTo('hero')}>Home</button>
            </li>
            <li>
              <button onClick={() => smoothScrollTo('explore')}>Explore</button>
            </li>
            <li>
              <button onClick={() => smoothScrollTo('gallery')}>Gallery</button>
            </li>
            <li>
              <button onClick={() => smoothScrollTo('booking')}>Booking</button>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="footer-contact">
            <li>
              <span className="contact-icon">📍</span>
              {contactData.mapLink ? (
                <a href={contactData.mapLink} target="_blank" rel="noopener noreferrer">
                  {contactData.address}
                </a>
              ) : (
                <span>{contactData.address}</span>
              )}
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <a href={`tel:${contactData.phone}`}>{contactData.phone}</a>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Follow Us</h4>
          <div className="social-links">
            {socialData.facebook && (
              <a
                href={socialData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
              >
                Facebook
              </a>
            )}
            {socialData.instagram && (
              <a
                href={socialData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                Instagram
              </a>
            )}
            {socialData.twitter && (
              <a
                href={socialData.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-link"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Silvermoon Park. All rights reserved.</p>
        <p className="footer-credits">
          Designed with care for exceptional experiences
        </p>
      </div>
    </footer>
  )
}

export default Footer
