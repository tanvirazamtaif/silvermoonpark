import { useState, useEffect } from 'react'
import './Edit.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const Edit = () => {
  const [activeSection, setActiveSection] = useState('hero')
  const [saveStatus, setSaveStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Hero Section Data
  const [heroData, setHeroData] = useState({
    slide1Title: '',
    slide1Subtitle: '',
    slide2Title: '',
    slide2Subtitle: '',
    slide3Title: '',
    slide3Subtitle: ''
  })

  // Contact Info
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    address: '',
    mapLink: ''
  })

  // Social Links
  const [socialData, setSocialData] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  })

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState([])
  const [deletedImages, setDeletedImages] = useState([])
  const [showRecycleBin, setShowRecycleBin] = useState(false)
  const [newGalleryImage, setNewGalleryImage] = useState({ title: '', image_url: '', order: 0 })
  const [editingGalleryId, setEditingGalleryId] = useState(null)
  const [fullscreenImage, setFullscreenImage] = useState(null)
  const [fullscreenEditMode, setFullscreenEditMode] = useState(false)
  const [fullscreenEditData, setFullscreenEditData] = useState({ title: '', image_url: '', order: 0 })
  const [imageSourceType, setImageSourceType] = useState('url') // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Explore Cards
  const [exploreCards, setExploreCards] = useState([])
  const [deletedExploreCards, setDeletedExploreCards] = useState([])
  const [showExploreRecycleBin, setShowExploreRecycleBin] = useState(false)
  const [newExploreCard, setNewExploreCard] = useState({
    title: '',
    short_description: '',
    full_description: '',
    image_url: '',
    order: 0
  })
  const [fullscreenCard, setFullscreenCard] = useState(null)
  const [fullscreenCardEditMode, setFullscreenCardEditMode] = useState(false)
  const [fullscreenCardEditData, setFullscreenCardEditData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    image_url: '',
    order: 0
  })
  const [exploreImageSourceType, setExploreImageSourceType] = useState('url')
  const [exploreSelectedFile, setExploreSelectedFile] = useState(null)
  const [exploreFilePreview, setExploreFilePreview] = useState(null)
  const [exploreUploading, setExploreUploading] = useState(false)
  // Fullscreen edit file upload states
  const [fullscreenEditImageSource, setFullscreenEditImageSource] = useState('url')
  const [fullscreenEditSelectedFile, setFullscreenEditSelectedFile] = useState(null)
  const [fullscreenEditFilePreview, setFullscreenEditFilePreview] = useState(null)
  const [fullscreenEditUploading, setFullscreenEditUploading] = useState(false)

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState([])
  const [deletedHeroSlides, setDeletedHeroSlides] = useState([])
  const [showHeroRecycleBin, setShowHeroRecycleBin] = useState(false)
  const [newHeroSlide, setNewHeroSlide] = useState({ title: '', subtitle: '', image_url: '', order: 0 })
  const [fullscreenSlide, setFullscreenSlide] = useState(null)
  const [fullscreenSlideEditMode, setFullscreenSlideEditMode] = useState(false)
  const [fullscreenSlideEditData, setFullscreenSlideEditData] = useState({ title: '', subtitle: '', image_url: '', order: 0 })
  const [heroImageSourceType, setHeroImageSourceType] = useState('url')
  const [heroSelectedFile, setHeroSelectedFile] = useState(null)
  const [heroFilePreview, setHeroFilePreview] = useState(null)
  const [heroUploading, setHeroUploading] = useState(false)
  // Fullscreen hero edit file upload states
  const [heroFullscreenEditImageSource, setHeroFullscreenEditImageSource] = useState('url')
  const [heroFullscreenEditSelectedFile, setHeroFullscreenEditSelectedFile] = useState(null)
  const [heroFullscreenEditFilePreview, setHeroFullscreenEditFilePreview] = useState(null)
  const [heroFullscreenEditUploading, setHeroFullscreenEditUploading] = useState(false)

  // Load content from backend
  useEffect(() => {
    fetchContent()
    fetchGalleryImages()
    fetchHeroSlides()
    fetchDeletedHeroSlides()
    fetchDeletedImages()
    fetchExploreCards()
    fetchDeletedExploreCards()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE}/site-content/`)
      if (response.ok) {
        const data = await response.json()
        // Map backend fields to frontend state
        setHeroData({
          slide1Title: data.slide1_title || '',
          slide1Subtitle: data.slide1_subtitle || '',
          slide2Title: data.slide2_title || '',
          slide2Subtitle: data.slide2_subtitle || '',
          slide3Title: data.slide3_title || '',
          slide3Subtitle: data.slide3_subtitle || ''
        })
        setContactData({
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          mapLink: data.map_link || ''
        })
        setSocialData({
          facebook: data.facebook || '',
          instagram: data.instagram || '',
          twitter: data.twitter || ''
        })
      }
    } catch (error) {
      console.error('Error fetching site content:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/gallery/?all=true`)
      if (response.ok) {
        const data = await response.json()
        setGalleryImages(data)
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error)
    }
  }

  const fetchDeletedImages = async () => {
    try {
      const response = await fetch(`${API_BASE}/gallery/?deleted=true`)
      if (response.ok) {
        const data = await response.json()
        setDeletedImages(data)
      }
    } catch (error) {
      console.error('Error fetching deleted images:', error)
    }
  }

  const fetchExploreCards = async () => {
    try {
      const response = await fetch(`${API_BASE}/explore-cards/?all=true`)
      if (response.ok) {
        const data = await response.json()
        setExploreCards(data)
      }
    } catch (error) {
      console.error('Error fetching explore cards:', error)
    }
  }

  const fetchDeletedExploreCards = async () => {
    try {
      const response = await fetch(`${API_BASE}/explore-cards/?deleted=true`)
      if (response.ok) {
        const data = await response.json()
        setDeletedExploreCards(data)
      }
    } catch (error) {
      console.error('Error fetching deleted explore cards:', error)
    }
  }

  const fetchHeroSlides = async () => {
    try {
      const response = await fetch(`${API_BASE}/hero-slides/?all=true`)
      if (response.ok) {
        const data = await response.json()
        setHeroSlides(data)
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error)
    }
  }

  const fetchDeletedHeroSlides = async () => {
    try {
      const response = await fetch(`${API_BASE}/hero-slides/?deleted=true`)
      if (response.ok) {
        const data = await response.json()
        setDeletedHeroSlides(data)
      }
    } catch (error) {
      console.error('Error fetching deleted hero slides:', error)
    }
  }

  const handleSave = async (section) => {
    setSaving(true)

    // Map frontend state to backend fields
    let updateData = {}
    if (section === 'hero') {
      updateData = {
        slide1_title: heroData.slide1Title,
        slide1_subtitle: heroData.slide1Subtitle,
        slide2_title: heroData.slide2Title,
        slide2_subtitle: heroData.slide2Subtitle,
        slide3_title: heroData.slide3Title,
        slide3_subtitle: heroData.slide3Subtitle
      }
    } else if (section === 'contact') {
      updateData = {
        phone: contactData.phone,
        email: contactData.email,
        address: contactData.address,
        map_link: contactData.mapLink
      }
    } else {
      updateData = {
        facebook: socialData.facebook,
        instagram: socialData.instagram,
        twitter: socialData.twitter
      }
    }

    try {
      const response = await fetch(`${API_BASE}/site-content/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        setSaveStatus(`${section.charAt(0).toUpperCase() + section.slice(1)} section saved successfully!`)
      } else {
        setSaveStatus('Failed to save changes. Please try again.')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      setSaveStatus('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  // File upload handling
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSaveStatus('Please select an image file')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSaveStatus('Image size should be less than 5MB')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      setSelectedFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFileSelection = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  // Gallery CRUD operations
  const handleAddGalleryImage = async () => {
    // Validate based on source type
    if (!newGalleryImage.title) {
      setSaveStatus('Please fill in the title')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    if (imageSourceType === 'url' && !newGalleryImage.image_url) {
      setSaveStatus('Please fill in the image URL')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    if (imageSourceType === 'file' && !selectedFile) {
      setSaveStatus('Please select an image file')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    try {
      setUploading(true)
      let imageUrl = newGalleryImage.image_url

      // If file upload, first upload the file
      if (imageSourceType === 'file' && selectedFile) {
        const formData = new FormData()
        formData.append('image', selectedFile)

        const uploadResponse = await fetch(`${API_BASE}/gallery/upload/`, {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.image_url
        } else {
          setSaveStatus('Failed to upload image file.')
          setUploading(false)
          setTimeout(() => setSaveStatus(''), 3000)
          return
        }
      }

      // Now create the gallery entry
      const response = await fetch(`${API_BASE}/gallery/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newGalleryImage.title,
          image_url: imageUrl,
          order: newGalleryImage.order
        })
      })

      if (response.ok) {
        fetchGalleryImages()
        setNewGalleryImage({ title: '', image_url: '', order: 0 })
        clearFileSelection()
        setSaveStatus('Gallery image added successfully!')
      } else {
        setSaveStatus('Failed to add gallery image.')
      }
    } catch (error) {
      console.error('Error adding gallery image:', error)
      setSaveStatus('Failed to add gallery image.')
    } finally {
      setUploading(false)
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleUpdateGalleryImage = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE}/gallery/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        fetchGalleryImages()
        setEditingGalleryId(null)
        setSaveStatus('Gallery image updated successfully!')
      } else {
        setSaveStatus('Failed to update gallery image.')
      }
    } catch (error) {
      console.error('Error updating gallery image:', error)
      setSaveStatus('Failed to update gallery image.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm('Move this image to recycle bin?')) return

    try {
      const response = await fetch(`${API_BASE}/gallery/${id}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchGalleryImages()
        fetchDeletedImages()
        setSaveStatus('Image moved to recycle bin!')
      } else {
        setSaveStatus('Failed to delete gallery image.')
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      setSaveStatus('Failed to delete gallery image.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Restore image from recycle bin
  const handleRestoreImage = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/gallery/${id}/restore/`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchGalleryImages()
        fetchDeletedImages()
        setSaveStatus('Image restored successfully!')
      } else {
        setSaveStatus('Failed to restore image.')
      }
    } catch (error) {
      console.error('Error restoring image:', error)
      setSaveStatus('Failed to restore image.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Permanently delete image from recycle bin
  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Permanently delete this image? This cannot be undone!')) return

    try {
      const response = await fetch(`${API_BASE}/gallery/${id}/permanent_delete/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDeletedImages()
        setSaveStatus('Image permanently deleted!')
      } else {
        setSaveStatus('Failed to permanently delete image.')
      }
    } catch (error) {
      console.error('Error permanently deleting image:', error)
      setSaveStatus('Failed to permanently delete image.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Explore Cards CRUD operations
  const handleAddExploreCard = async () => {
    if (!newExploreCard.title || !newExploreCard.short_description) {
      setSaveStatus('Please fill in title and short description')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    if (exploreImageSourceType === 'url' && !newExploreCard.image_url) {
      setSaveStatus('Please fill in the image URL')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    if (exploreImageSourceType === 'file' && !exploreSelectedFile) {
      setSaveStatus('Please select an image file')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    try {
      setExploreUploading(true)
      let imageUrl = newExploreCard.image_url

      // If file upload, first upload the file
      if (exploreImageSourceType === 'file' && exploreSelectedFile) {
        const formData = new FormData()
        formData.append('image', exploreSelectedFile)

        const uploadResponse = await fetch(`${API_BASE}/explore-cards/upload/`, {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.image_url
        } else {
          setSaveStatus('Failed to upload image file.')
          setExploreUploading(false)
          setTimeout(() => setSaveStatus(''), 3000)
          return
        }
      }

      const response = await fetch(`${API_BASE}/explore-cards/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newExploreCard,
          image_url: imageUrl
        })
      })

      if (response.ok) {
        fetchExploreCards()
        setNewExploreCard({ title: '', short_description: '', full_description: '', image_url: '', order: 0 })
        clearExploreFileSelection()
        setSaveStatus('Explore card added successfully!')
      } else {
        setSaveStatus('Failed to add explore card.')
      }
    } catch (error) {
      console.error('Error adding explore card:', error)
      setSaveStatus('Failed to add explore card.')
    } finally {
      setExploreUploading(false)
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleUpdateExploreCard = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE}/explore-cards/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        fetchExploreCards()
        setEditingCardId(null)
        setSaveStatus('Explore card updated successfully!')
      } else {
        setSaveStatus('Failed to update explore card.')
      }
    } catch (error) {
      console.error('Error updating explore card:', error)
      setSaveStatus('Failed to update explore card.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleDeleteExploreCard = async (id) => {
    if (!window.confirm('Move this card to recycle bin?')) return

    try {
      const response = await fetch(`${API_BASE}/explore-cards/${id}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchExploreCards()
        fetchDeletedExploreCards()
        setSaveStatus('Card moved to recycle bin!')
      } else {
        setSaveStatus('Failed to delete explore card.')
      }
    } catch (error) {
      console.error('Error deleting explore card:', error)
      setSaveStatus('Failed to delete explore card.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Restore explore card from recycle bin
  const handleRestoreExploreCard = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/explore-cards/${id}/restore/`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchExploreCards()
        fetchDeletedExploreCards()
        setSaveStatus('Card restored successfully!')
      } else {
        setSaveStatus('Failed to restore card.')
      }
    } catch (error) {
      console.error('Error restoring card:', error)
      setSaveStatus('Failed to restore card.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Permanently delete explore card from recycle bin
  const handlePermanentDeleteExploreCard = async (id) => {
    if (!window.confirm('Permanently delete this card? This cannot be undone!')) return

    try {
      const response = await fetch(`${API_BASE}/explore-cards/${id}/permanent_delete/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDeletedExploreCards()
        setSaveStatus('Card permanently deleted!')
      } else {
        setSaveStatus('Failed to permanently delete card.')
      }
    } catch (error) {
      console.error('Error permanently deleting card:', error)
      setSaveStatus('Failed to permanently delete card.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Explore file upload handling
  const handleExploreFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveStatus('Please select an image file')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveStatus('Image size should be less than 5MB')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      setExploreSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setExploreFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearExploreFileSelection = () => {
    setExploreSelectedFile(null)
    setExploreFilePreview(null)
  }

  // Fullscreen edit file upload handling
  const handleFullscreenEditFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveStatus('Please select an image file')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveStatus('Image size should be less than 5MB')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      setFullscreenEditSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFullscreenEditFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearFullscreenEditFileSelection = () => {
    setFullscreenEditSelectedFile(null)
    setFullscreenEditFilePreview(null)
  }

  const resetFullscreenEditFileState = () => {
    setFullscreenEditImageSource('url')
    setFullscreenEditSelectedFile(null)
    setFullscreenEditFilePreview(null)
    setFullscreenEditUploading(false)
  }

  // Fullscreen explore card functions
  const openExploreFullscreen = (card) => {
    setFullscreenCard(card)
    document.body.style.overflow = 'hidden'
  }

  const closeExploreFullscreen = () => {
    setFullscreenCard(null)
    setFullscreenCardEditMode(false)
    resetFullscreenEditFileState()
    document.body.style.overflow = 'auto'
  }

  const goToNextCard = () => {
    if (!fullscreenCard) return
    const currentIndex = exploreCards.findIndex(card => card.id === fullscreenCard.id)
    const nextIndex = (currentIndex + 1) % exploreCards.length
    setFullscreenCard(exploreCards[nextIndex])
    setFullscreenCardEditMode(false)
  }

  const goToPrevCard = () => {
    if (!fullscreenCard) return
    const currentIndex = exploreCards.findIndex(card => card.id === fullscreenCard.id)
    const prevIndex = (currentIndex - 1 + exploreCards.length) % exploreCards.length
    setFullscreenCard(exploreCards[prevIndex])
    setFullscreenCardEditMode(false)
  }

  const handleDeleteFromExploreFullscreen = async () => {
    if (!fullscreenCard) return
    if (!window.confirm('Move this card to recycle bin?')) return

    try {
      const response = await fetch(`${API_BASE}/explore-cards/${fullscreenCard.id}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchExploreCards()
        fetchDeletedExploreCards()
        closeExploreFullscreen()
        setSaveStatus('Card moved to recycle bin!')
      } else {
        setSaveStatus('Failed to delete card.')
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      setSaveStatus('Failed to delete card.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Hero Slide handlers
  const handleHeroFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveStatus('Please select an image file')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveStatus('Image size should be less than 5MB')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      setHeroSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearHeroFileSelection = () => {
    setHeroSelectedFile(null)
    setHeroFilePreview(null)
  }

  const handleHeroFullscreenEditFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSaveStatus('Please select an image file')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setSaveStatus('Image size should be less than 5MB')
        setTimeout(() => setSaveStatus(''), 3000)
        return
      }
      setHeroFullscreenEditSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeroFullscreenEditFilePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearHeroFullscreenEditFileSelection = () => {
    setHeroFullscreenEditSelectedFile(null)
    setHeroFullscreenEditFilePreview(null)
  }

  const resetHeroFullscreenEditFileState = () => {
    setHeroFullscreenEditImageSource('url')
    setHeroFullscreenEditSelectedFile(null)
    setHeroFullscreenEditFilePreview(null)
    setHeroFullscreenEditUploading(false)
  }

  const handleAddHeroSlide = async () => {
    if (!newHeroSlide.title.trim()) {
      setSaveStatus('Please enter a title')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    try {
      let imageUrl = newHeroSlide.image_url

      // If file mode and file selected, upload first
      if (heroImageSourceType === 'file' && heroSelectedFile) {
        setHeroUploading(true)
        const formData = new FormData()
        formData.append('image', heroSelectedFile)

        const uploadResponse = await fetch(`${API_BASE}/hero-slides/upload/`, {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.image_url
        setHeroUploading(false)
      }

      const response = await fetch(`${API_BASE}/hero-slides/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newHeroSlide, image_url: imageUrl })
      })

      if (response.ok) {
        fetchHeroSlides()
        setNewHeroSlide({ title: '', subtitle: '', image_url: '', order: 0 })
        clearHeroFileSelection()
        setHeroImageSourceType('url')
        setSaveStatus('Hero slide added successfully!')
      } else {
        setSaveStatus('Failed to add hero slide.')
      }
    } catch (error) {
      console.error('Error adding hero slide:', error)
      setSaveStatus('Failed to add hero slide.')
    } finally {
      setHeroUploading(false)
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleDeleteHeroSlide = async (id) => {
    if (!window.confirm('Move this slide to recycle bin?')) return

    try {
      const response = await fetch(`${API_BASE}/hero-slides/${id}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchHeroSlides()
        fetchDeletedHeroSlides()
        setSaveStatus('Slide moved to recycle bin!')
      } else {
        setSaveStatus('Failed to delete hero slide.')
      }
    } catch (error) {
      console.error('Error deleting hero slide:', error)
      setSaveStatus('Failed to delete hero slide.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handleRestoreHeroSlide = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/hero-slides/${id}/restore/`, {
        method: 'POST'
      })

      if (response.ok) {
        fetchHeroSlides()
        fetchDeletedHeroSlides()
        setSaveStatus('Slide restored successfully!')
      } else {
        setSaveStatus('Failed to restore slide.')
      }
    } catch (error) {
      console.error('Error restoring slide:', error)
      setSaveStatus('Failed to restore slide.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  const handlePermanentDeleteHeroSlide = async (id) => {
    if (!window.confirm('Permanently delete this slide? This cannot be undone.')) return

    try {
      const response = await fetch(`${API_BASE}/hero-slides/${id}/permanent_delete/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchDeletedHeroSlides()
        setSaveStatus('Slide permanently deleted!')
      } else {
        setSaveStatus('Failed to permanently delete slide.')
      }
    } catch (error) {
      console.error('Error permanently deleting slide:', error)
      setSaveStatus('Failed to permanently delete slide.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Fullscreen hero slide functions
  const openHeroFullscreen = (slide) => {
    setFullscreenSlide(slide)
    document.body.style.overflow = 'hidden'
  }

  const closeHeroFullscreen = () => {
    setFullscreenSlide(null)
    setFullscreenSlideEditMode(false)
    resetHeroFullscreenEditFileState()
    document.body.style.overflow = 'auto'
  }

  const goToNextSlide = () => {
    if (!fullscreenSlide) return
    const currentIndex = heroSlides.findIndex(s => s.id === fullscreenSlide.id)
    const nextIndex = (currentIndex + 1) % heroSlides.length
    setFullscreenSlide(heroSlides[nextIndex])
    setFullscreenSlideEditMode(false)
  }

  const goToPrevSlide = () => {
    if (!fullscreenSlide) return
    const currentIndex = heroSlides.findIndex(s => s.id === fullscreenSlide.id)
    const prevIndex = (currentIndex - 1 + heroSlides.length) % heroSlides.length
    setFullscreenSlide(heroSlides[prevIndex])
    setFullscreenSlideEditMode(false)
  }

  const handleDeleteFromHeroFullscreen = async () => {
    if (!fullscreenSlide) return
    if (!window.confirm('Move this slide to recycle bin?')) return

    try {
      const response = await fetch(`${API_BASE}/hero-slides/${fullscreenSlide.id}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchHeroSlides()
        fetchDeletedHeroSlides()
        closeHeroFullscreen()
        setSaveStatus('Slide moved to recycle bin!')
      } else {
        setSaveStatus('Failed to delete slide.')
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
      setSaveStatus('Failed to delete slide.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  // Fullscreen gallery functions
  const openFullscreen = (image) => {
    setFullscreenImage(image)
    document.body.style.overflow = 'hidden'
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
    setFullscreenEditMode(false)
    document.body.style.overflow = 'auto'
  }

  const goToNextImage = () => {
    if (!fullscreenImage) return
    const currentIndex = galleryImages.findIndex(img => img.id === fullscreenImage.id)
    const nextIndex = (currentIndex + 1) % galleryImages.length
    setFullscreenImage(galleryImages[nextIndex])
    setFullscreenEditMode(false)
  }

  const goToPrevImage = () => {
    if (!fullscreenImage) return
    const currentIndex = galleryImages.findIndex(img => img.id === fullscreenImage.id)
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
    setFullscreenImage(galleryImages[prevIndex])
    setFullscreenEditMode(false)
  }

  const handleDeleteFromFullscreen = async () => {
    if (!fullscreenImage) return
    if (!window.confirm('Move this image to recycle bin?')) return

    try {
      const response = await fetch(`${API_BASE}/gallery/${fullscreenImage.id}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchGalleryImages()
        fetchDeletedImages()
        closeFullscreen()
        setSaveStatus('Image moved to recycle bin!')
      } else {
        setSaveStatus('Failed to delete gallery image.')
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      setSaveStatus('Failed to delete gallery image.')
    }
    setTimeout(() => setSaveStatus(''), 3000)
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-spinner">Loading...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Edit Content</h1>
        <p className="page-subtitle">Update website content and settings</p>
      </div>

      {saveStatus && (
        <div className={`save-notification ${saveStatus.includes('Failed') ? 'error' : 'success'}`}>
          {saveStatus}
        </div>
      )}

      {/* Section Tabs */}
      <div className="edit-tabs">
        <button
          className={`edit-tab ${activeSection === 'hero' ? 'active' : ''}`}
          onClick={() => setActiveSection('hero')}
        >
          Slide Section
        </button>
        <button
          className={`edit-tab ${activeSection === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveSection('contact')}
        >
          Contact Info
        </button>
        <button
          className={`edit-tab ${activeSection === 'social' ? 'active' : ''}`}
          onClick={() => setActiveSection('social')}
        >
          Social Links
        </button>
        <button
          className={`edit-tab ${activeSection === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveSection('gallery')}
        >
          Gallery
        </button>
        <button
          className={`edit-tab ${activeSection === 'cards' ? 'active' : ''}`}
          onClick={() => setActiveSection('cards')}
        >
          Explore Cards
        </button>
      </div>

      {/* Hero Section Editor */}
      {activeSection === 'hero' && (
        <div className="edit-section">
          <h2 className="section-title">Hero Slideshow</h2>

          {/* Recycle Bin Toggle */}
          {deletedHeroSlides.length > 0 && (
            <div className="recycle-bin-section">
              <button
                className={`recycle-bin-toggle ${showHeroRecycleBin ? 'active' : ''}`}
                onClick={() => setShowHeroRecycleBin(!showHeroRecycleBin)}
              >
                🗑️ Recycle Bin ({deletedHeroSlides.length})
              </button>

              {showHeroRecycleBin && (
                <div className="deleted-items-grid">
                  {deletedHeroSlides.map((slide) => (
                    <div key={slide.id} className="gallery-grid-item deleted-item">
                      <div
                        className="gallery-grid-image"
                        style={{ backgroundImage: `url(${slide.image_url})` }}
                      />
                      <div className="gallery-grid-info">
                        <span className="gallery-grid-title">{slide.title}</span>
                        <span className="gallery-grid-order">Deleted: {new Date(slide.deleted_at).toLocaleDateString()}</span>
                      </div>
                      <div className="gallery-grid-actions">
                        <button className="restore-btn small" onClick={() => handleRestoreHeroSlide(slide.id)}>
                          Restore
                        </button>
                        <button className="delete-btn small" onClick={() => handlePermanentDeleteHeroSlide(slide.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add New Slide Form */}
          <div className="edit-group">
            <h3 className="group-title">Add New Slide</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newHeroSlide.title}
                  onChange={(e) => setNewHeroSlide({ ...newHeroSlide, title: e.target.value })}
                  placeholder="Slide title"
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={newHeroSlide.order}
                  onChange={(e) => setNewHeroSlide({ ...newHeroSlide, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Subtitle</label>
              <input
                type="text"
                value={newHeroSlide.subtitle}
                onChange={(e) => setNewHeroSlide({ ...newHeroSlide, subtitle: e.target.value })}
                placeholder="Slide subtitle"
              />
            </div>

            {/* Image Source Toggle */}
            <div className="form-group full-width">
              <label>Image Source</label>
              <div className="image-source-toggle">
                <button
                  type="button"
                  className={`source-toggle-btn ${heroImageSourceType === 'url' ? 'active' : ''}`}
                  onClick={() => {
                    setHeroImageSourceType('url')
                    clearHeroFileSelection()
                  }}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`source-toggle-btn ${heroImageSourceType === 'file' ? 'active' : ''}`}
                  onClick={() => {
                    setHeroImageSourceType('file')
                    setNewHeroSlide({ ...newHeroSlide, image_url: '' })
                  }}
                >
                  From Device
                </button>
              </div>
            </div>

            {/* URL Input */}
            {heroImageSourceType === 'url' && (
              <div className="form-group full-width">
                <label>Background Image URL</label>
                <input
                  type="text"
                  value={newHeroSlide.image_url}
                  onChange={(e) => setNewHeroSlide({ ...newHeroSlide, image_url: e.target.value })}
                  placeholder="/hero-image.jpg or https://..."
                />
              </div>
            )}

            {/* File Upload */}
            {heroImageSourceType === 'file' && (
              <div className="form-group full-width">
                <label>Upload Background Image</label>
                <div className="file-upload-area">
                  {!heroFilePreview ? (
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroFileSelect}
                        className="file-input-hidden"
                      />
                      <div className="file-upload-content">
                        <span className="file-upload-icon">+</span>
                        <span className="file-upload-text">Click to select image</span>
                        <span className="file-upload-hint">JPG, PNG, GIF (max 5MB)</span>
                      </div>
                    </label>
                  ) : (
                    <div className="file-preview-container">
                      <img src={heroFilePreview} alt="Preview" className="file-preview-image" />
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={clearHeroFileSelection}
                      >
                        Remove
                      </button>
                      <span className="file-name">{heroSelectedFile?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button className="save-btn" onClick={handleAddHeroSlide} disabled={heroUploading}>
              {heroUploading ? 'Uploading...' : 'Add Slide'}
            </button>
          </div>

          {/* Existing Slides Grid */}
          <div className="gallery-grid-section">
            <h3 className="group-title">Existing Slides ({heroSlides.length})</h3>
            {heroSlides.length === 0 ? (
              <p className="no-items">No hero slides yet. Add one above.</p>
            ) : (
              <div className="gallery-grid-admin">
                {heroSlides.map((slide) => (
                  <div key={slide.id} className="gallery-grid-item">
                    <div
                      className="gallery-grid-image"
                      style={{ backgroundImage: `url(${slide.image_url})` }}
                      onClick={() => openHeroFullscreen(slide)}
                    />
                    <div className="gallery-grid-info">
                      <span className="gallery-grid-title">{slide.title}</span>
                      <span className="gallery-grid-order">Order: {slide.order}</span>
                    </div>
                    <div className="gallery-grid-actions">
                      <button className="edit-btn small" onClick={() => {
                        setFullscreenSlide(slide)
                        setFullscreenSlideEditData({
                          title: slide.title,
                          subtitle: slide.subtitle,
                          image_url: slide.image_url,
                          order: slide.order
                        })
                        setFullscreenSlideEditMode(true)
                        document.body.style.overflow = 'hidden'
                      }}>
                        Edit
                      </button>
                      <button className="delete-btn small" onClick={() => handleDeleteHeroSlide(slide.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Info Editor */}
      {activeSection === 'contact' && (
        <div className="edit-section">
          <h2 className="section-title">Contact Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <textarea
              value={contactData.address}
              onChange={(e) => setContactData({ ...contactData, address: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-group full-width">
            <label>Google Maps Link</label>
            <input
              type="url"
              value={contactData.mapLink}
              onChange={(e) => setContactData({ ...contactData, mapLink: e.target.value })}
            />
          </div>

          <button className="save-btn" onClick={() => handleSave('contact')} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Social Links Editor */}
      {activeSection === 'social' && (
        <div className="edit-section">
          <h2 className="section-title">Social Media Links</h2>

          <div className="form-group full-width">
            <label>Facebook URL</label>
            <input
              type="url"
              value={socialData.facebook}
              onChange={(e) => setSocialData({ ...socialData, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
            />
          </div>

          <div className="form-group full-width">
            <label>Instagram URL</label>
            <input
              type="url"
              value={socialData.instagram}
              onChange={(e) => setSocialData({ ...socialData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="form-group full-width">
            <label>Twitter URL</label>
            <input
              type="url"
              value={socialData.twitter}
              onChange={(e) => setSocialData({ ...socialData, twitter: e.target.value })}
              placeholder="https://twitter.com/..."
            />
          </div>

          <button className="save-btn" onClick={() => handleSave('social')} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Gallery Editor */}
      {activeSection === 'gallery' && (
        <div className="edit-section">
          <div className="section-header-row">
            <h2 className="section-title">Gallery Images</h2>
            <button
              className={`recycle-bin-toggle ${showRecycleBin ? 'active' : ''}`}
              onClick={() => setShowRecycleBin(!showRecycleBin)}
            >
              Recycle Bin ({deletedImages.length})
            </button>
          </div>

          {/* Recycle Bin Section */}
          {showRecycleBin && (
            <div className="recycle-bin-section">
              <h3 className="group-title">Recycle Bin</h3>
              {deletedImages.length === 0 ? (
                <p className="no-items">Recycle bin is empty.</p>
              ) : (
                <div className="gallery-grid-admin recycle-grid">
                  {deletedImages.map((image) => (
                    <div key={image.id} className="gallery-grid-item deleted-item">
                      <div
                        className="gallery-grid-image"
                        style={{ backgroundImage: `url(${image.image_url})` }}
                      />
                      <div className="gallery-grid-info">
                        <span className="gallery-grid-title">{image.title}</span>
                        <span className="gallery-grid-order">Deleted: {new Date(image.deleted_at).toLocaleDateString()}</span>
                      </div>
                      <div className="gallery-grid-actions">
                        <button className="restore-btn small" onClick={() => handleRestoreImage(image.id)}>
                          Restore
                        </button>
                        <button className="delete-btn small" onClick={() => handlePermanentDelete(image.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add New Image Form */}
          <div className="edit-group">
            <h3 className="group-title">Add New Image</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newGalleryImage.title}
                  onChange={(e) => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })}
                  placeholder="Image title"
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={newGalleryImage.order}
                  onChange={(e) => setNewGalleryImage({ ...newGalleryImage, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Image Source Toggle */}
            <div className="form-group full-width">
              <label>Image Source</label>
              <div className="image-source-toggle">
                <button
                  type="button"
                  className={`source-toggle-btn ${imageSourceType === 'url' ? 'active' : ''}`}
                  onClick={() => {
                    setImageSourceType('url')
                    clearFileSelection()
                  }}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`source-toggle-btn ${imageSourceType === 'file' ? 'active' : ''}`}
                  onClick={() => {
                    setImageSourceType('file')
                    setNewGalleryImage({ ...newGalleryImage, image_url: '' })
                  }}
                >
                  From Device
                </button>
              </div>
            </div>

            {/* URL Input */}
            {imageSourceType === 'url' && (
              <div className="form-group full-width">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newGalleryImage.image_url}
                  onChange={(e) => setNewGalleryImage({ ...newGalleryImage, image_url: e.target.value })}
                  placeholder="/gallery-image.jpg or https://..."
                />
              </div>
            )}

            {/* File Upload */}
            {imageSourceType === 'file' && (
              <div className="form-group full-width">
                <label>Upload Image</label>
                <div className="file-upload-area">
                  {!filePreview ? (
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file-input-hidden"
                      />
                      <div className="file-upload-content">
                        <span className="file-upload-icon">+</span>
                        <span className="file-upload-text">Click to select image</span>
                        <span className="file-upload-hint">JPG, PNG, GIF (max 5MB)</span>
                      </div>
                    </label>
                  ) : (
                    <div className="file-preview-container">
                      <img src={filePreview} alt="Preview" className="file-preview-image" />
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={clearFileSelection}
                      >
                        Remove
                      </button>
                      <span className="file-name">{selectedFile?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button className="save-btn" onClick={handleAddGalleryImage} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Add Image'}
            </button>
          </div>

          {/* Existing Images Grid */}
          <div className="gallery-grid-section">
            <h3 className="group-title">Existing Images ({galleryImages.length})</h3>
            {galleryImages.length === 0 ? (
              <p className="no-items">No gallery images yet. Add one above.</p>
            ) : (
              <div className="gallery-grid-admin">
                {galleryImages.map((image) => (
                  <div key={image.id} className="gallery-grid-item">
                    {editingGalleryId === image.id ? (
                      <div className="gallery-edit-form">
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => {
                            const updated = galleryImages.map(img =>
                              img.id === image.id ? { ...img, title: e.target.value } : img
                            )
                            setGalleryImages(updated)
                          }}
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={image.image_url}
                          onChange={(e) => {
                            const updated = galleryImages.map(img =>
                              img.id === image.id ? { ...img, image_url: e.target.value } : img
                            )
                            setGalleryImages(updated)
                          }}
                          placeholder="Image URL"
                        />
                        <input
                          type="number"
                          value={image.order}
                          onChange={(e) => {
                            const updated = galleryImages.map(img =>
                              img.id === image.id ? { ...img, order: parseInt(e.target.value) || 0 } : img
                            )
                            setGalleryImages(updated)
                          }}
                          placeholder="Order"
                        />
                        <div className="gallery-edit-actions">
                          <button className="save-btn small" onClick={() => handleUpdateGalleryImage(image.id, image)}>
                            Save
                          </button>
                          <button className="cancel-btn small" onClick={() => {
                            setEditingGalleryId(null)
                            fetchGalleryImages()
                          }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="gallery-grid-image"
                          style={{ backgroundImage: `url(${image.image_url})` }}
                          onClick={() => openFullscreen(image)}
                        />
                        <div className="gallery-grid-info">
                          <span className="gallery-grid-title">{image.title}</span>
                          <span className="gallery-grid-order">Order: {image.order}</span>
                        </div>
                        <div className="gallery-grid-actions">
                          <button className="edit-btn small" onClick={() => setEditingGalleryId(image.id)}>
                            Edit
                          </button>
                          <button className="delete-btn small" onClick={() => handleDeleteGalleryImage(image.id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <button
            className="fullscreen-nav fullscreen-prev"
            onClick={(e) => { e.stopPropagation(); goToPrevImage(); }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={closeFullscreen}>
              &times;
            </button>
            <img
              src={fullscreenImage.image_url}
              alt={fullscreenImage.title}
              className="fullscreen-image"
            />
            <div className="fullscreen-info">
              <h3>{fullscreenImage.title}</h3>
              <p>Order: {fullscreenImage.order}</p>
              <p className="fullscreen-counter">
                {galleryImages.findIndex(img => img.id === fullscreenImage.id) + 1} / {galleryImages.length}
              </p>
            </div>
            <div className="fullscreen-actions">
              <button className="fullscreen-edit-btn" onClick={() => {
                setFullscreenEditData({
                  title: fullscreenImage.title,
                  image_url: fullscreenImage.image_url,
                  order: fullscreenImage.order
                })
                setFullscreenEditMode(true)
              }}>
                Edit Image
              </button>
              <button className="fullscreen-delete-btn" onClick={handleDeleteFromFullscreen}>
                Delete Image
              </button>
            </div>

            {/* Floating Edit Card */}
            {fullscreenEditMode && (
              <div className="floating-edit-card">
                <h4>Edit Image</h4>
                <div className="floating-edit-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={fullscreenEditData.title}
                    onChange={(e) => setFullscreenEditData({ ...fullscreenEditData, title: e.target.value })}
                    placeholder="Image title"
                  />
                </div>
                <div className="floating-edit-field">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={fullscreenEditData.image_url}
                    onChange={(e) => setFullscreenEditData({ ...fullscreenEditData, image_url: e.target.value })}
                    placeholder="/image.jpg or https://..."
                  />
                </div>
                <div className="floating-edit-field">
                  <label>Order</label>
                  <input
                    type="number"
                    value={fullscreenEditData.order}
                    onChange={(e) => setFullscreenEditData({ ...fullscreenEditData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="floating-edit-actions">
                  <button
                    className="floating-save-btn"
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API_BASE}/gallery/${fullscreenImage.id}/`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(fullscreenEditData)
                        })
                        if (response.ok) {
                          const updatedImage = await response.json()
                          setFullscreenImage({ ...fullscreenImage, ...fullscreenEditData })
                          fetchGalleryImages()
                          setFullscreenEditMode(false)
                          setSaveStatus('Image updated successfully!')
                          setTimeout(() => setSaveStatus(''), 3000)
                        }
                      } catch (error) {
                        console.error('Error updating image:', error)
                        setSaveStatus('Failed to update image.')
                        setTimeout(() => setSaveStatus(''), 3000)
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="floating-cancel-btn"
                    onClick={() => setFullscreenEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="fullscreen-nav fullscreen-next"
            onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}

      {/* Explore Cards Editor */}
      {activeSection === 'cards' && (
        <div className="edit-section">
          <div className="section-header-row">
            <h2 className="section-title">Explore Cards</h2>
            <button
              className={`recycle-bin-toggle ${showExploreRecycleBin ? 'active' : ''}`}
              onClick={() => setShowExploreRecycleBin(!showExploreRecycleBin)}
            >
              Recycle Bin ({deletedExploreCards.length})
            </button>
          </div>

          {/* Recycle Bin Section */}
          {showExploreRecycleBin && (
            <div className="recycle-bin-section">
              <h3 className="group-title">Recycle Bin</h3>
              {deletedExploreCards.length === 0 ? (
                <p className="no-items">Recycle bin is empty.</p>
              ) : (
                <div className="gallery-grid-admin recycle-grid">
                  {deletedExploreCards.map((card) => (
                    <div key={card.id} className="gallery-grid-item deleted-item">
                      <div
                        className="gallery-grid-image"
                        style={{ backgroundImage: `url(${card.image_url})` }}
                      />
                      <div className="gallery-grid-info">
                        <span className="gallery-grid-title">{card.title}</span>
                        <span className="gallery-grid-order">Deleted: {new Date(card.deleted_at).toLocaleDateString()}</span>
                      </div>
                      <div className="gallery-grid-actions">
                        <button className="restore-btn small" onClick={() => handleRestoreExploreCard(card.id)}>
                          Restore
                        </button>
                        <button className="delete-btn small" onClick={() => handlePermanentDeleteExploreCard(card.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add New Card Form */}
          <div className="edit-group">
            <h3 className="group-title">Add New Card</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newExploreCard.title}
                  onChange={(e) => setNewExploreCard({ ...newExploreCard, title: e.target.value })}
                  placeholder="Card title"
                />
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={newExploreCard.order}
                  onChange={(e) => setNewExploreCard({ ...newExploreCard, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Short Description</label>
              <input
                type="text"
                value={newExploreCard.short_description}
                onChange={(e) => setNewExploreCard({ ...newExploreCard, short_description: e.target.value })}
                placeholder="Brief description shown on card"
              />
            </div>
            <div className="form-group full-width">
              <label>Full Description</label>
              <textarea
                value={newExploreCard.full_description}
                onChange={(e) => setNewExploreCard({ ...newExploreCard, full_description: e.target.value })}
                placeholder="Detailed description shown in modal"
                rows="3"
              />
            </div>

            {/* Image Source Toggle */}
            <div className="form-group full-width">
              <label>Image Source</label>
              <div className="image-source-toggle">
                <button
                  type="button"
                  className={`source-toggle-btn ${exploreImageSourceType === 'url' ? 'active' : ''}`}
                  onClick={() => {
                    setExploreImageSourceType('url')
                    clearExploreFileSelection()
                  }}
                >
                  URL
                </button>
                <button
                  type="button"
                  className={`source-toggle-btn ${exploreImageSourceType === 'file' ? 'active' : ''}`}
                  onClick={() => {
                    setExploreImageSourceType('file')
                    setNewExploreCard({ ...newExploreCard, image_url: '' })
                  }}
                >
                  From Device
                </button>
              </div>
            </div>

            {/* URL Input */}
            {exploreImageSourceType === 'url' && (
              <div className="form-group full-width">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newExploreCard.image_url}
                  onChange={(e) => setNewExploreCard({ ...newExploreCard, image_url: e.target.value })}
                  placeholder="/explore-image.jpg or https://..."
                />
              </div>
            )}

            {/* File Upload */}
            {exploreImageSourceType === 'file' && (
              <div className="form-group full-width">
                <label>Upload Image</label>
                <div className="file-upload-area">
                  {!exploreFilePreview ? (
                    <label className="file-upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleExploreFileSelect}
                        className="file-input-hidden"
                      />
                      <div className="file-upload-content">
                        <span className="file-upload-icon">+</span>
                        <span className="file-upload-text">Click to select image</span>
                        <span className="file-upload-hint">JPG, PNG, GIF (max 5MB)</span>
                      </div>
                    </label>
                  ) : (
                    <div className="file-preview-container">
                      <img src={exploreFilePreview} alt="Preview" className="file-preview-image" />
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={clearExploreFileSelection}
                      >
                        Remove
                      </button>
                      <span className="file-name">{exploreSelectedFile?.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button className="save-btn" onClick={handleAddExploreCard} disabled={exploreUploading}>
              {exploreUploading ? 'Uploading...' : 'Add Card'}
            </button>
          </div>

          {/* Existing Cards Grid */}
          <div className="gallery-grid-section">
            <h3 className="group-title">Existing Cards ({exploreCards.length})</h3>
            {exploreCards.length === 0 ? (
              <p className="no-items">No explore cards yet. Add one above.</p>
            ) : (
              <div className="gallery-grid-admin">
                {exploreCards.map((card) => (
                  <div key={card.id} className="gallery-grid-item">
                    <div
                      className="gallery-grid-image"
                      style={{ backgroundImage: `url(${card.image_url})` }}
                      onClick={() => openExploreFullscreen(card)}
                    />
                    <div className="gallery-grid-info">
                      <span className="gallery-grid-title">{card.title}</span>
                      <span className="gallery-grid-order">Order: {card.order}</span>
                    </div>
                    <div className="gallery-grid-actions">
                      <button className="edit-btn small" onClick={() => {
                        // Open fullscreen with edit mode active
                        setFullscreenCard(card)
                        setFullscreenCardEditData({
                          title: card.title,
                          short_description: card.short_description,
                          full_description: card.full_description,
                          image_url: card.image_url,
                          order: card.order
                        })
                        setFullscreenCardEditMode(true)
                        document.body.style.overflow = 'hidden'
                      }}>
                        Edit
                      </button>
                      <button className="delete-btn small" onClick={() => handleDeleteExploreCard(card.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Explore Card Modal */}
      {fullscreenCard && (
        <div className="fullscreen-overlay" onClick={closeExploreFullscreen}>
          <button
            className="fullscreen-nav fullscreen-prev"
            onClick={(e) => { e.stopPropagation(); goToPrevCard(); }}
            aria-label="Previous card"
          >
            ‹
          </button>

          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={closeExploreFullscreen}>
              &times;
            </button>
            <img
              src={fullscreenCard.image_url}
              alt={fullscreenCard.title}
              className="fullscreen-image"
            />
            <div className="fullscreen-info">
              <h3>{fullscreenCard.title}</h3>
              <p className="fullscreen-short-desc">{fullscreenCard.short_description}</p>
              {fullscreenCard.full_description && (
                <p className="fullscreen-full-desc">{fullscreenCard.full_description}</p>
              )}
              <p>Order: {fullscreenCard.order}</p>
              <p className="fullscreen-counter">
                {exploreCards.findIndex(card => card.id === fullscreenCard.id) + 1} / {exploreCards.length}
              </p>
            </div>
            <div className="fullscreen-actions">
              <button className="fullscreen-edit-btn" onClick={() => {
                setFullscreenCardEditData({
                  title: fullscreenCard.title,
                  short_description: fullscreenCard.short_description,
                  full_description: fullscreenCard.full_description,
                  image_url: fullscreenCard.image_url,
                  order: fullscreenCard.order
                })
                setFullscreenCardEditMode(true)
              }}>
                Edit Card
              </button>
              <button className="fullscreen-delete-btn" onClick={handleDeleteFromExploreFullscreen}>
                Delete Card
              </button>
            </div>

            {/* Floating Edit Card */}
            {fullscreenCardEditMode && (
              <div className="floating-edit-card explore-floating-edit">
                <h4>Edit Card</h4>
                <div className="floating-edit-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={fullscreenCardEditData.title}
                    onChange={(e) => setFullscreenCardEditData({ ...fullscreenCardEditData, title: e.target.value })}
                    placeholder="Card title"
                  />
                </div>
                <div className="floating-edit-field">
                  <label>Short Description</label>
                  <input
                    type="text"
                    value={fullscreenCardEditData.short_description}
                    onChange={(e) => setFullscreenCardEditData({ ...fullscreenCardEditData, short_description: e.target.value })}
                    placeholder="Short description"
                  />
                </div>
                <div className="floating-edit-field">
                  <label>Full Description</label>
                  <textarea
                    value={fullscreenCardEditData.full_description}
                    onChange={(e) => setFullscreenCardEditData({ ...fullscreenCardEditData, full_description: e.target.value })}
                    placeholder="Full description"
                    rows="3"
                  />
                </div>
                {/* Image Source Toggle */}
                <div className="floating-edit-field">
                  <label>Image Source</label>
                  <div className="image-source-toggle">
                    <button
                      type="button"
                      className={`source-toggle-btn ${fullscreenEditImageSource === 'url' ? 'active' : ''}`}
                      onClick={() => {
                        setFullscreenEditImageSource('url')
                        clearFullscreenEditFileSelection()
                      }}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      className={`source-toggle-btn ${fullscreenEditImageSource === 'file' ? 'active' : ''}`}
                      onClick={() => {
                        setFullscreenEditImageSource('file')
                      }}
                    >
                      From Device
                    </button>
                  </div>
                </div>

                {/* URL Input */}
                {fullscreenEditImageSource === 'url' && (
                  <div className="floating-edit-field">
                    <label>Image URL</label>
                    <input
                      type="text"
                      value={fullscreenCardEditData.image_url}
                      onChange={(e) => setFullscreenCardEditData({ ...fullscreenCardEditData, image_url: e.target.value })}
                      placeholder="/image.jpg or https://..."
                    />
                  </div>
                )}

                {/* File Upload */}
                {fullscreenEditImageSource === 'file' && (
                  <div className="floating-edit-field">
                    <label>Upload Image</label>
                    <div className="file-upload-area compact">
                      {!fullscreenEditFilePreview ? (
                        <label className="file-upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFullscreenEditFileSelect}
                            className="file-input-hidden"
                          />
                          <div className="file-upload-content">
                            <span className="file-upload-icon">+</span>
                            <span className="file-upload-text">Click to select image</span>
                            <span className="file-upload-hint">JPG, PNG, GIF (max 5MB)</span>
                          </div>
                        </label>
                      ) : (
                        <div className="file-preview-container">
                          <img src={fullscreenEditFilePreview} alt="Preview" className="file-preview-image" />
                          <button
                            type="button"
                            className="file-remove-btn"
                            onClick={clearFullscreenEditFileSelection}
                          >
                            Remove
                          </button>
                          <span className="file-name">{fullscreenEditSelectedFile?.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="floating-edit-field">
                  <label>Order</label>
                  <input
                    type="number"
                    value={fullscreenCardEditData.order}
                    onChange={(e) => setFullscreenCardEditData({ ...fullscreenCardEditData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="floating-edit-actions">
                  <button
                    className="floating-save-btn"
                    disabled={fullscreenEditUploading}
                    onClick={async () => {
                      try {
                        let finalImageUrl = fullscreenCardEditData.image_url

                        // If file mode and file selected, upload first
                        if (fullscreenEditImageSource === 'file' && fullscreenEditSelectedFile) {
                          setFullscreenEditUploading(true)
                          const formData = new FormData()
                          formData.append('image', fullscreenEditSelectedFile)

                          const uploadResponse = await fetch(`${API_BASE}/explore-cards/upload/`, {
                            method: 'POST',
                            body: formData
                          })

                          if (!uploadResponse.ok) {
                            throw new Error('Failed to upload image')
                          }

                          const uploadData = await uploadResponse.json()
                          finalImageUrl = uploadData.image_url
                          setFullscreenEditUploading(false)
                        }

                        const updateData = { ...fullscreenCardEditData, image_url: finalImageUrl }
                        const response = await fetch(`${API_BASE}/explore-cards/${fullscreenCard.id}/`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updateData)
                        })
                        if (response.ok) {
                          setFullscreenCard({ ...fullscreenCard, ...updateData })
                          fetchExploreCards()
                          setFullscreenCardEditMode(false)
                          resetFullscreenEditFileState()
                          setSaveStatus('Card updated successfully!')
                          setTimeout(() => setSaveStatus(''), 3000)
                        }
                      } catch (error) {
                        console.error('Error updating card:', error)
                        setFullscreenEditUploading(false)
                        setSaveStatus('Failed to update card.')
                        setTimeout(() => setSaveStatus(''), 3000)
                      }
                    }}
                  >
                    {fullscreenEditUploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button
                    className="floating-cancel-btn"
                    onClick={() => {
                      setFullscreenCardEditMode(false)
                      resetFullscreenEditFileState()
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="fullscreen-nav fullscreen-next"
            onClick={(e) => { e.stopPropagation(); goToNextCard(); }}
            aria-label="Next card"
          >
            ›
          </button>
        </div>
      )}

      {/* Fullscreen Hero Slide Modal */}
      {fullscreenSlide && (
        <div className="fullscreen-overlay" onClick={closeHeroFullscreen}>
          <button
            className="fullscreen-nav fullscreen-prev"
            onClick={(e) => { e.stopPropagation(); goToPrevSlide(); }}
            aria-label="Previous slide"
          >
            ‹
          </button>

          <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <button className="fullscreen-close" onClick={closeHeroFullscreen}>
              &times;
            </button>
            <img
              src={fullscreenSlide.image_url}
              alt={fullscreenSlide.title}
              className="fullscreen-image"
            />
            <div className="fullscreen-info">
              <h3>{fullscreenSlide.title}</h3>
              <p className="fullscreen-short-desc">{fullscreenSlide.subtitle}</p>
              <p>Order: {fullscreenSlide.order}</p>
              <p className="fullscreen-counter">
                {heroSlides.findIndex(s => s.id === fullscreenSlide.id) + 1} / {heroSlides.length}
              </p>
            </div>
            <div className="fullscreen-actions">
              <button className="fullscreen-edit-btn" onClick={() => {
                setFullscreenSlideEditData({
                  title: fullscreenSlide.title,
                  subtitle: fullscreenSlide.subtitle,
                  image_url: fullscreenSlide.image_url,
                  order: fullscreenSlide.order
                })
                setFullscreenSlideEditMode(true)
              }}>
                Edit Slide
              </button>
              <button className="fullscreen-delete-btn" onClick={handleDeleteFromHeroFullscreen}>
                Delete Slide
              </button>
            </div>

            {/* Floating Edit Slide */}
            {fullscreenSlideEditMode && (
              <div className="floating-edit-card explore-floating-edit">
                <h4>Edit Slide</h4>
                <div className="floating-edit-field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={fullscreenSlideEditData.title}
                    onChange={(e) => setFullscreenSlideEditData({ ...fullscreenSlideEditData, title: e.target.value })}
                    placeholder="Slide title"
                  />
                </div>
                <div className="floating-edit-field">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={fullscreenSlideEditData.subtitle}
                    onChange={(e) => setFullscreenSlideEditData({ ...fullscreenSlideEditData, subtitle: e.target.value })}
                    placeholder="Slide subtitle"
                  />
                </div>

                {/* Image Source Toggle */}
                <div className="floating-edit-field">
                  <label>Image Source</label>
                  <div className="image-source-toggle">
                    <button
                      type="button"
                      className={`source-toggle-btn ${heroFullscreenEditImageSource === 'url' ? 'active' : ''}`}
                      onClick={() => {
                        setHeroFullscreenEditImageSource('url')
                        clearHeroFullscreenEditFileSelection()
                      }}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      className={`source-toggle-btn ${heroFullscreenEditImageSource === 'file' ? 'active' : ''}`}
                      onClick={() => {
                        setHeroFullscreenEditImageSource('file')
                      }}
                    >
                      From Device
                    </button>
                  </div>
                </div>

                {/* URL Input */}
                {heroFullscreenEditImageSource === 'url' && (
                  <div className="floating-edit-field">
                    <label>Background Image URL</label>
                    <input
                      type="text"
                      value={fullscreenSlideEditData.image_url}
                      onChange={(e) => setFullscreenSlideEditData({ ...fullscreenSlideEditData, image_url: e.target.value })}
                      placeholder="/image.jpg or https://..."
                    />
                  </div>
                )}

                {/* File Upload */}
                {heroFullscreenEditImageSource === 'file' && (
                  <div className="floating-edit-field">
                    <label>Upload Image</label>
                    <div className="file-upload-area compact">
                      {!heroFullscreenEditFilePreview ? (
                        <label className="file-upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroFullscreenEditFileSelect}
                            className="file-input-hidden"
                          />
                          <div className="file-upload-content">
                            <span className="file-upload-icon">+</span>
                            <span className="file-upload-text">Click to select image</span>
                            <span className="file-upload-hint">JPG, PNG, GIF (max 5MB)</span>
                          </div>
                        </label>
                      ) : (
                        <div className="file-preview-container">
                          <img src={heroFullscreenEditFilePreview} alt="Preview" className="file-preview-image" />
                          <button
                            type="button"
                            className="file-remove-btn"
                            onClick={clearHeroFullscreenEditFileSelection}
                          >
                            Remove
                          </button>
                          <span className="file-name">{heroFullscreenEditSelectedFile?.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="floating-edit-field">
                  <label>Order</label>
                  <input
                    type="number"
                    value={fullscreenSlideEditData.order}
                    onChange={(e) => setFullscreenSlideEditData({ ...fullscreenSlideEditData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="floating-edit-actions">
                  <button
                    className="floating-save-btn"
                    disabled={heroFullscreenEditUploading}
                    onClick={async () => {
                      try {
                        let finalImageUrl = fullscreenSlideEditData.image_url

                        // If file mode and file selected, upload first
                        if (heroFullscreenEditImageSource === 'file' && heroFullscreenEditSelectedFile) {
                          setHeroFullscreenEditUploading(true)
                          const formData = new FormData()
                          formData.append('image', heroFullscreenEditSelectedFile)

                          const uploadResponse = await fetch(`${API_BASE}/hero-slides/upload/`, {
                            method: 'POST',
                            body: formData
                          })

                          if (!uploadResponse.ok) {
                            throw new Error('Failed to upload image')
                          }

                          const uploadData = await uploadResponse.json()
                          finalImageUrl = uploadData.image_url
                          setHeroFullscreenEditUploading(false)
                        }

                        const updateData = { ...fullscreenSlideEditData, image_url: finalImageUrl }
                        const response = await fetch(`${API_BASE}/hero-slides/${fullscreenSlide.id}/`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(updateData)
                        })
                        if (response.ok) {
                          setFullscreenSlide({ ...fullscreenSlide, ...updateData })
                          fetchHeroSlides()
                          setFullscreenSlideEditMode(false)
                          resetHeroFullscreenEditFileState()
                          setSaveStatus('Slide updated successfully!')
                          setTimeout(() => setSaveStatus(''), 3000)
                        }
                      } catch (error) {
                        console.error('Error updating slide:', error)
                        setHeroFullscreenEditUploading(false)
                        setSaveStatus('Failed to update slide.')
                        setTimeout(() => setSaveStatus(''), 3000)
                      }
                    }}
                  >
                    {heroFullscreenEditUploading ? 'Uploading...' : 'Save'}
                  </button>
                  <button
                    className="floating-cancel-btn"
                    onClick={() => {
                      setFullscreenSlideEditMode(false)
                      resetHeroFullscreenEditFileState()
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            className="fullscreen-nav fullscreen-next"
            onClick={(e) => { e.stopPropagation(); goToNextSlide(); }}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default Edit
