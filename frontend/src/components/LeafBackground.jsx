import { useState, useEffect } from 'react'
import './LeafBackground.css'

const leafImages = [
  '/leaf_1.jpg',
  '/leaf_2.jpg',
  '/leaf_3.jpg',
  '/leaf_4.jpg'
]

const LeafBackground = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)

      // After transition completes, update indices
      setTimeout(() => {
        setCurrentIndex(nextIndex)
        setNextIndex((nextIndex + 1) % leafImages.length)
        setIsTransitioning(false)
      }, 1500) // Match CSS transition duration

    }, 6000) // Change every 6 seconds (1.5s transition + 4.5s display)

    return () => clearInterval(interval)
  }, [nextIndex])

  return (
    <div className="leaf-background-container">
      {leafImages.map((image, index) => {
        let className = 'leaf-bg-image'

        if (index === currentIndex) {
          className += isTransitioning ? ' current fading-out' : ' current'
        } else if (index === nextIndex && isTransitioning) {
          className += ' next fading-in'
        }

        return (
          <div
            key={index}
            className={className}
            style={{ backgroundImage: `url(${image})` }}
          />
        )
      })}
      <div className="leaf-bg-overlay" />
    </div>
  )
}

export default LeafBackground
