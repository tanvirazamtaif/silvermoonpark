import { useState, useEffect, useRef } from 'react'
import { smoothScrollTo } from '../utils/scrollReveal'
import './HeroSlideshow.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Default slides (used as fallback)
const defaultSlides = [
  {
    id: 1,
    title: 'Welcome to Silvermoon Park',
    subtitle: 'Where Luxury Meets Tranquility',
    image: '/hero-1.jpg'
  },
  {
    id: 2,
    title: 'Unforgettable Experiences',
    subtitle: 'Create Memories That Last Forever',
    image: '/hero-2.jpg'
  },
  {
    id: 3,
    title: 'Premium Accommodations',
    subtitle: 'Comfort & Elegance in Every Detail',
    image: '/hero-3.jpg'
  }
]

const HeroSlideshow = () => {
  const [slides, setSlides] = useState(defaultSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState('next')
  const autoPlayRef = useRef(null)
  const currentSlideRef = useRef(currentSlide)

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${API_BASE}/hero-slides/`)
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            // Map API data to expected format and sort by order
            const mappedSlides = data
              .sort((a, b) => a.order - b.order)
              .map(slide => ({
                id: slide.id,
                title: slide.title,
                subtitle: slide.subtitle,
                image: slide.image_url
              }))
            setSlides(mappedSlides)
          }
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error)
        // Keep default slides on error
      }
    }
    fetchSlides()
  }, [])

  // Keep ref in sync with state
  useEffect(() => {
    currentSlideRef.current = currentSlide
  }, [currentSlide])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('next')
    setPreviousSlideIndex(currentSlideRef.current)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection('prev')
    setPreviousSlideIndex(currentSlideRef.current)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setSlideDirection(index > currentSlide ? 'next' : 'prev')
    setPreviousSlideIndex(currentSlide)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 700)
  }

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
    autoPlayRef.current = setInterval(nextSlide, 5000)
  }

  useEffect(() => {
    autoPlayRef.current = setInterval(nextSlide, 5000)
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [])

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide(true)
      resetAutoPlay()
    }

    if (isRightSwipe) {
      prevSlide(true)
      resetAutoPlay()
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleNavigation = (direction) => {
    if (direction === 'next') {
      nextSlide(true)
    } else {
      prevSlide(true)
    }
    resetAutoPlay()
  }

  const handleBookingClick = (type) => {
    smoothScrollTo('booking')
    setTimeout(() => {
      const tab = document.querySelector(`[data-tab="${type}"]`)
      if (tab) tab.click()
    }, 500)
  }

  return (
    <section
      id="hero"
      className="hero-slideshow"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="slides-container">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide
          const isPrev = index === previousSlideIndex && isTransitioning

          let slideClass = 'slide'
          if (isActive) {
            slideClass += ' active'
            if (isTransitioning) {
              slideClass += ` slide-enter-${slideDirection}`
            }
          } else if (isPrev) {
            slideClass += ` slide-exit-${slideDirection}`
          }

          return (
            <div
              key={slide.id}
              className={slideClass}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="leaf-overlay"></div>
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <div className="slide-actions">
                  <button
                    className="cta-button primary"
                    onClick={() => handleBookingClick('room')}
                  >
                    Book a Room
                  </button>
                  <button
                    className="cta-button secondary"
                    onClick={() => handleBookingClick('event')}
                  >
                    Book an Event
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        className="slide-nav prev"
        onClick={() => handleNavigation('prev')}
        aria-label="Previous slide"
      >
        ‹
      </button>

      <button
        className="slide-nav next"
        onClick={() => handleNavigation('next')}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="slide-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => {
              goToSlide(index)
              resetAutoPlay()
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSlideshow
