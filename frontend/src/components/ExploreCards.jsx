import { useState, useEffect, useRef } from 'react'
import './ExploreCards.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// Default explore data (used as fallback)
const defaultExploreData = [
  {
    id: 1,
    title: 'Luxury Cottages',
    shortDesc: 'Cozy cottages with scenic views',
    fullDesc: 'Experience ultimate comfort in our luxury cottages featuring private balconies, modern amenities, and breathtaking views of the surrounding nature. Perfect for couples seeking a romantic getaway.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    title: 'Premium Suites',
    shortDesc: 'Spacious suites with elegance',
    fullDesc: 'Our premium suites offer expansive living spaces with separate bedroom and living areas, luxury bathrooms, and premium furnishings. Ideal for families or guests seeking extra space and comfort.',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    title: 'Infinity Pool',
    shortDesc: 'Stunning pool with mountain views',
    fullDesc: 'Dive into luxury at our temperature-controlled infinity pool overlooking the mountains. Complete with poolside cabanas, a swim-up bar, and dedicated lifeguard service for your safety.',
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop'
  },
  {
    id: 4,
    title: 'Fine Dining',
    shortDesc: 'Multi-cuisine restaurant',
    fullDesc: 'Savor exquisite flavors at our award-winning restaurant featuring international cuisine, local specialties, and an extensive wine collection. Open for breakfast, lunch, and dinner with indoor and outdoor seating.',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop'
  },
  {
    id: 5,
    title: 'BBQ Nights',
    shortDesc: 'Outdoor grilling experiences',
    fullDesc: 'Enjoy memorable evenings at our outdoor BBQ area with live grilling stations, bonfire seating, and live entertainment. Perfect for group gatherings and special celebrations under the stars.',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop'
  },
  {
    id: 6,
    title: 'Kids Zone',
    shortDesc: 'Fun activities for children',
    fullDesc: 'Keep your little ones entertained at our supervised kids zone featuring play equipment, games, creative activities, and trained staff. A safe and fun environment for children of all ages.',
    image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&h=400&fit=crop'
  },
  {
    id: 7,
    title: 'Conference Hall',
    shortDesc: 'State-of-the-art meeting spaces',
    fullDesc: 'Host successful corporate events in our fully-equipped conference hall with modern AV equipment, high-speed WiFi, flexible seating arrangements, and professional catering services.',
    image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop'
  },
  {
    id: 8,
    title: 'Wedding Lawn',
    shortDesc: 'Beautiful outdoor venue',
    fullDesc: 'Create your dream wedding at our picturesque lawn surrounded by lush gardens. Accommodates up to 500 guests with complete event planning, catering, and decoration services available.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop'
  },
  {
    id: 9,
    title: 'Wellness Spa',
    shortDesc: 'Rejuvenating spa treatments',
    fullDesc: 'Indulge in ultimate relaxation at our wellness spa offering traditional therapies, aromatherapy, massage treatments, and beauty services. Professional therapists ensure a rejuvenating experience.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop'
  }
]

const ExploreCards = () => {
  const [exploreData, setExploreData] = useState(defaultExploreData)
  const [selectedCard, setSelectedCard] = useState(null)
  const [showAllCards, setShowAllCards] = useState(false)
  const gridRef = useRef(null)

  // Re-observe fade-in elements when data changes
  useEffect(() => {
    if (gridRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1 })

      const fadeElements = gridRef.current.querySelectorAll('.fade-in:not(.visible)')
      fadeElements.forEach(el => observer.observe(el))

      return () => observer.disconnect()
    }
  }, [exploreData])

  // Fetch explore cards from API
  useEffect(() => {
    const fetchExploreCards = async () => {
      try {
        const response = await fetch(`${API_BASE}/explore-cards/`)
        if (response.ok) {
          const data = await response.json()
          console.log('API Response:', data)
          if (data.length > 0) {
            // Map API data to expected format and sort by order
            const cards = data
              .sort((a, b) => a.order - b.order)
              .map(card => ({
                id: card.id,
                title: card.title,
                shortDesc: card.short_description,
                fullDesc: card.full_description,
                image: card.image_url
              }))
            console.log('Mapped cards:', cards)
            setExploreData(cards)
          }
        }
      } catch (error) {
        console.error('Error fetching explore cards:', error)
        // Keep default cards on error
      }
    }
    fetchExploreCards()
  }, [])

  const openModal = (card) => {
    setSelectedCard(card)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedCard(null)
    document.body.style.overflow = 'auto'
  }

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && selectedCard) {
      closeModal()
    }
  }

  return (
    <section id="explore" className="explore-section section">
      <div className="container">
        <h2 className="section-title fade-in">Explore Our Resort</h2>
        <div ref={gridRef} className={`cards-grid ${showAllCards ? 'show-all' : ''}`}>
          {exploreData.map((card, index) => (
            <div
              key={`card-${card.id}-${index}`}
              className={`explore-card fade-in ${index >= 3 ? 'mobile-hidden' : ''}`}
              onClick={() => openModal(card)}
              onKeyDown={(e) => e.key === 'Enter' && openModal(card)}
              tabIndex={0}
              role="button"
              aria-label={`Learn more about ${card.title}`}
            >
              <div className="card-image" style={{
                backgroundImage: `url(${card.image})`
              }}>
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.shortDesc}</p>
                <span className="card-link">Learn More →</span>
              </div>
            </div>
          ))}
        </div>
        <div className="explore-more-container">
          {!showAllCards ? (
            <button
              className="explore-more-btn"
              onClick={() => setShowAllCards(true)}
            >
              Explore More
            </button>
          ) : (
            <button
              className="explore-more-btn show-less"
              onClick={() => setShowAllCards(false)}
            >
              Show Less
            </button>
          )}
        </div>
      </div>

      {selectedCard && (
        <div
          className="modal-overlay"
          onClick={handleModalClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <div
              className="modal-image"
              style={{
                backgroundImage: `url(${selectedCard.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="card-overlay"></div>
            </div>
            <div className="modal-body">
              <h3 id="modal-title" className="modal-title">{selectedCard.title}</h3>
              <p className="modal-description">{selectedCard.fullDesc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ExploreCards
