import { useState, useEffect } from 'react'
import { initializeTheme, toggleTheme } from '../utils/theme'
import { initScrollReveal } from '../utils/scrollReveal'
import Navbar from '../components/Navbar'
import HeroSlideshow from '../components/HeroSlideshow'
import ExploreCards from '../components/ExploreCards'
import Gallery from '../components/Gallery'
import BookingSection from '../components/BookingSection'
import Footer from '../components/Footer'
import LeafBackground from '../components/LeafBackground'
import './Home.css'

const Home = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const initialTheme = initializeTheme()
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    const observer = initScrollReveal()
    return () => observer.disconnect()
  }, [])

  const handleToggleTheme = () => {
    const newTheme = toggleTheme(theme)
    setTheme(newTheme)
  }

  return (
    <div className="home-page">
      <LeafBackground />
      <Navbar theme={theme} onToggleTheme={handleToggleTheme} />
      <main className="main-content">
        <HeroSlideshow />
        <div className="content-panel">
          <ExploreCards />
          <Gallery />
          <BookingSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
