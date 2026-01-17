import { useState, useEffect } from 'react'
import './Gallery.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Default gallery images (used as fallback)
const defaultGalleryImages = [
  { id: 1, src: '/WhatsApp%20Image%202026-01-14%20at%205.37.32%20PM.jpeg', alt: 'Silvermoon Resort View 1' },
  { id: 2, src: '/WhatsApp%20Image%202026-01-14%20at%205.37.33%20PM.jpeg', alt: 'Silvermoon Resort View 2' },
  { id: 3, src: '/WhatsApp%20Image%202026-01-14%20at%205.37.39%20PM.jpeg', alt: 'Silvermoon Resort View 3' },
  { id: 4, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.12%20PM.jpeg', alt: 'Silvermoon Resort View 4' },
  { id: 5, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.14%20PM.jpeg', alt: 'Silvermoon Resort View 5' },
  { id: 6, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.16%20PM.jpeg', alt: 'Silvermoon Resort View 6' },
  { id: 7, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.23%20PM.jpeg', alt: 'Silvermoon Resort View 7' },
  { id: 8, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.27%20PM.jpeg', alt: 'Silvermoon Resort View 8' },
  { id: 9, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.35%20PM.jpeg', alt: 'Silvermoon Resort View 9' },
  { id: 10, src: '/WhatsApp%20Image%202026-01-14%20at%205.38.36%20PM.jpeg', alt: 'Silvermoon Resort View 10' },
  { id: 11, src: '/WhatsApp%20Image%202026-01-16%20at%2012.22.11%20AM.jpeg', alt: 'Silvermoon Resort View 11' },
  { id: 12, src: '/WhatsApp%20Image%202026-01-16%20at%2012.22.12%20AM.jpeg', alt: 'Silvermoon Resort View 12' }
]

const INITIAL_DISPLAY_COUNT = 11 // Show 11 images + 1 "Watch More" button = 12 grid items

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState(defaultGalleryImages)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showAll, setShowAll] = useState(false)

  // Calculate images to display
  const hasMoreImages = galleryImages.length > 12
  const displayedImages = showAll ? galleryImages : galleryImages.slice(0, hasMoreImages ? INITIAL_DISPLAY_COUNT : galleryImages.length)
  const remainingCount = galleryImages.length - INITIAL_DISPLAY_COUNT

  // Fetch gallery images from API
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(`${API_BASE}/gallery/`)
        if (response.ok) {
          const data = await response.json()
          console.log('Gallery API response:', data.length, 'images', data)
          if (data.length > 0) {
            // Map API data to expected format
            const images = data.map(img => ({
              id: img.id,
              src: img.image_url,
              alt: img.title
            }))
            setGalleryImages(images)
          }
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error)
        // Keep default images on error
      }
    }
    fetchGalleryImages()
  }, [])

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const handleKeyDown = (e) => {
    if (!lightboxOpen) return

    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'ArrowLeft') goToPrev()
  }

  // Add keyboard event listener
  useEffect(() => {
    if (lightboxOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen])

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

    if (isLeftSwipe) goToNext()
    if (isRightSwipe) goToPrev()

    setTouchStart(0)
    setTouchEnd(0)
  }

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('lightbox-overlay')) {
      closeLightbox()
    }
  }

  return (
    <>
      <section id="gallery" className="gallery-section section">
        <div className="container">
          <h2 className="section-title fade-in">Gallery</h2>
          <div className="gallery-grid">
            {displayedImages.map((image, index) => (
              <div
                key={image.id}
                className="gallery-item fade-in"
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                tabIndex={0}
                role="button"
                aria-label={`View ${image.alt} in fullscreen`}
              >
                <div className="gallery-image">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23e5e7eb" width="400" height="300"/><text x="50%" y="50%" fill="%239ca3af" font-family="sans-serif" font-size="16" text-anchor="middle" dy=".3em">Image not found</text></svg>'
                      console.error('Failed to load image:', image.src)
                    }}
                  />
                  <div className="gallery-overlay">
                    <span className="zoom-icon">🔍</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Watch More Button - shown as 12th item when there are more than 12 images */}
            {hasMoreImages && !showAll && (
              <div
                className="gallery-item watch-more-item fade-in"
                onClick={() => setShowAll(true)}
                onKeyDown={(e) => e.key === 'Enter' && setShowAll(true)}
                tabIndex={0}
                role="button"
                aria-label={`View ${remainingCount} more images`}
              >
                <div className="watch-more-content">
                  <span className="watch-more-count">+{remainingCount}</span>
                  <span className="watch-more-text">Watch More</span>
                </div>
              </div>
            )}
          </div>

          {/* Show Less Button - shown below the grid when expanded */}
          {hasMoreImages && showAll && (
            <div className="show-less-container">
              <button
                className="show-less-btn"
                onClick={() => setShowAll(false)}
              >
                Show Less
              </button>
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="lightbox-overlay"
          onClick={handleOverlayClick}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>

          <button
            className="lightbox-nav prev"
            onClick={goToPrev}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="lightbox-content">
            <div className="lightbox-image">
              <img
                src={galleryImages[currentIndex].src}
                alt={galleryImages[currentIndex].alt}
              />
            </div>
            <div className="lightbox-counter">
              {currentIndex + 1} / {galleryImages.length}
            </div>
            <p className="lightbox-caption">{galleryImages[currentIndex].alt}</p>
          </div>

          <button
            className="lightbox-nav next"
            onClick={goToNext}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}

export default Gallery
