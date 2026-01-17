import { useState, useEffect } from 'react'
import './Home.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const Home = () => {
  const [stats, setStats] = useState({
    totalRoomBookings: 0,
    totalEventBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0
  })
  const [allBookings, setAllBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedBookings, setSelectedBookings] = useState([])
  const [showPendingPopup, setShowPendingPopup] = useState(false)
  const [pendingBookingsList, setPendingBookingsList] = useState([])
  const [confirmingId, setConfirmingId] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)
  const [showRoomPopup, setShowRoomPopup] = useState(false)
  const [roomBookingsList, setRoomBookingsList] = useState([])
  const [showEventPopup, setShowEventPopup] = useState(false)
  const [eventBookingsList, setEventBookingsList] = useState([])
  const [showConfirmedPopup, setShowConfirmedPopup] = useState(false)
  const [confirmedBookingsList, setConfirmedBookingsList] = useState([])
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [bookingFormType, setBookingFormType] = useState('room')
  const [bookingFormData, setBookingFormData] = useState({})
  const [submittingBooking, setSubmittingBooking] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [roomRes, eventRes] = await Promise.all([
        fetch(`${API_BASE}/bookings/rooms/`),
        fetch(`${API_BASE}/bookings/events/`)
      ])

      const roomBookings = await roomRes.json()
      const eventBookings = await eventRes.json()

      const allBookingsData = [
        ...roomBookings.map(b => ({ ...b, type: 'room' })),
        ...eventBookings.map(b => ({ ...b, type: 'event' }))
      ]

      const pending = allBookingsData.filter(b => b.status === 'pending').length
      const confirmed = allBookingsData.filter(b => b.status === 'confirmed').length

      setStats({
        totalRoomBookings: roomBookings.length,
        totalEventBookings: eventBookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed
      })

      setAllBookings(allBookingsData)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBooking = async (booking) => {
    if (!confirm(`Are you sure you want to delete booking #${booking.id} for ${booking.full_name}?`)) {
      return
    }

    try {
      const endpoint = booking.type === 'room' ? 'rooms' : 'events'
      await fetch(`${API_BASE}/bookings/${endpoint}/${booking.id}/`, {
        method: 'DELETE'
      })

      // Refresh data
      fetchDashboardData()
      setSelectedDate(null)
      setSelectedBookings([])
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking')
    }
  }

  const handlePendingClick = () => {
    const pending = allBookings.filter(b => b.status === 'pending')
    setPendingBookingsList(pending)
    setShowPendingPopup(true)
  }

  const handleRoomClick = () => {
    const rooms = allBookings.filter(b => b.type === 'room')
    setRoomBookingsList(rooms)
    setShowRoomPopup(true)
  }

  const handleEventClick = () => {
    const events = allBookings.filter(b => b.type === 'event')
    setEventBookingsList(events)
    setShowEventPopup(true)
  }

  const handleConfirmedClick = () => {
    const confirmed = allBookings.filter(b => b.status === 'confirmed')
    setConfirmedBookingsList(confirmed)
    setShowConfirmedPopup(true)
  }

  const openBookingForm = (type = 'room') => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
    setBookingFormType(type)
    setBookingFormData({
      full_name: '',
      phone: '',
      email: '',
      check_in: dateStr,
      check_out: '',
      event_date: dateStr,
      room_type: 'cottage',
      guests: 2,
      children: 0,
      num_rooms: 1,
      event_type: 'wedding',
      expected_guests: 50,
      budget_range: '50k_100k',
      special_requests: '',
      notes: '',
      booked_by_admin: true
    })
    setShowBookingForm(true)
  }

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target
    setBookingFormData(prev => ({ ...prev, [name]: value }))
  }

  const submitAdminBooking = async (e) => {
    e.preventDefault()
    setSubmittingBooking(true)

    try {
      const endpoint = bookingFormType === 'room' ? 'rooms' : 'events'
      const data = bookingFormType === 'room' ? {
        full_name: bookingFormData.full_name,
        phone: bookingFormData.phone,
        email: bookingFormData.email,
        check_in: bookingFormData.check_in,
        check_out: bookingFormData.check_out,
        room_type: bookingFormData.room_type,
        guests: parseInt(bookingFormData.guests),
        children: parseInt(bookingFormData.children) || 0,
        num_rooms: parseInt(bookingFormData.num_rooms),
        special_requests: bookingFormData.special_requests,
        booked_by_admin: true,
        status: 'confirmed'
      } : {
        full_name: bookingFormData.full_name,
        phone: bookingFormData.phone,
        email: bookingFormData.email,
        event_date: bookingFormData.event_date,
        event_type: bookingFormData.event_type,
        expected_guests: parseInt(bookingFormData.expected_guests),
        budget_range: bookingFormData.budget_range,
        notes: bookingFormData.notes,
        booked_by_admin: true,
        status: 'confirmed'
      }

      const response = await fetch(`${API_BASE}/bookings/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        alert('Booking created successfully!')
        setShowBookingForm(false)
        setSelectedDate(null)
        fetchDashboardData()
      } else {
        const error = await response.json()
        alert(`Failed to create booking: ${error.message || JSON.stringify(error.errors)}`)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking')
    } finally {
      setSubmittingBooking(false)
    }
  }

  const confirmBooking = async (booking) => {
    setConfirmingId(booking.id)
    try {
      const endpoint = booking.type === 'room' ? 'rooms' : 'events'
      const response = await fetch(`${API_BASE}/bookings/${endpoint}/${booking.id}/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert(`Booking ${booking.booking_id || '#' + booking.id} confirmed! Confirmation email sent to ${booking.email}`)
        // Refresh data
        fetchDashboardData()
        // Update pending list
        setPendingBookingsList(prev => prev.filter(b => !(b.id === booking.id && b.type === booking.type)))
        // Update selected bookings to reflect status change
        setSelectedBookings(prev => prev.map(b =>
          (b.id === booking.id && b.type === booking.type)
            ? { ...b, status: 'confirmed' }
            : b
        ))
      } else {
        const error = await response.json()
        alert(`Failed to confirm booking: ${error.message}`)
      }
    } catch (error) {
      console.error('Error confirming booking:', error)
      alert('Failed to confirm booking')
    } finally {
      setConfirmingId(null)
    }
  }

  const cancelBooking = async (booking) => {
    setCancellingId(booking.id)
    try {
      const endpoint = booking.type === 'room' ? 'rooms' : 'events'
      const response = await fetch(`${API_BASE}/bookings/${endpoint}/${booking.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (response.ok) {
        alert(`Booking ${booking.booking_id || '#' + booking.id} has been cancelled`)
        // Refresh data
        fetchDashboardData()
        // Remove from pending list
        setPendingBookingsList(prev => prev.filter(b => !(b.id === booking.id && b.type === booking.type)))
        // Update selected bookings to reflect status change
        setSelectedBookings(prev => prev.map(b =>
          (b.id === booking.id && b.type === booking.type)
            ? { ...b, status: 'cancelled' }
            : b
        ))
      } else {
        const error = await response.json()
        alert(`Failed to cancel booking: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    return { daysInMonth, firstDayOfMonth }
  }

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
    setSelectedBookings([])
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
    setSelectedBookings([])
  }

  const getBookingsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    return allBookings.filter(booking => {
      if (booking.type === 'room') {
        // Check if date falls within check-in and check-out range (excluding checkout date)
        // Use string comparison to avoid timezone issues
        return dateStr >= booking.check_in && dateStr < booking.check_out
      } else {
        // Event booking - check event date
        return booking.event_date === dateStr
      }
    })
  }

  const handleDateClick = (day) => {
    const bookings = getBookingsForDate(day)
    setSelectedDate(day)
    setSelectedBookings(bookings)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Helper function to check if a booking's date is in the past
  const isBookingInPast = (booking) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (booking.type === 'room') {
      // For room bookings, check if check_out date is in the past
      const checkOut = new Date(booking.check_out)
      checkOut.setHours(0, 0, 0, 0)
      return checkOut < today
    } else {
      // For event bookings, check if event_date is in the past
      const eventDate = new Date(booking.event_date)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate < today
    }
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
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to Silvermoon Park Admin Panel</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card clickable" onClick={handleRoomClick}>
          <div className="stat-icon room">🛏️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalRoomBookings}</span>
            <span className="stat-label">Room Bookings</span>
          </div>
        </div>

        <div className="stat-card clickable" onClick={handleEventClick}>
          <div className="stat-icon event">🎉</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalEventBookings}</span>
            <span className="stat-label">Event Bookings</span>
          </div>
        </div>

        <div className="stat-card clickable" onClick={handlePendingClick}>
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.pendingBookings}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-card clickable" onClick={handleConfirmedClick}>
          <div className="stat-icon confirmed">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.confirmedBookings}</span>
            <span className="stat-label">Confirmed</span>
          </div>
        </div>
      </div>

      {/* Booking Calendar */}
      <div className="calendar-section">
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
            <h2 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="calendar-grid">
            {/* Day names header */}
            {dayNames.map(day => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}

            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="calendar-day empty"></div>
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const bookings = getBookingsForDate(day)
              // Separate by status first, then by type (exclude cancelled)
              const pendingBookings = bookings.filter(b => b.status === 'pending')
              const confirmedRoomBookings = bookings.filter(b => b.type === 'room' && b.status === 'confirmed' && !b.booked_by_admin)
              const confirmedEventBookings = bookings.filter(b => b.type === 'event' && b.status === 'confirmed' && !b.booked_by_admin)
              const adminBookings = bookings.filter(b => b.booked_by_admin && b.status === 'confirmed')
              // Only count non-cancelled bookings for the orange background
              const activeBookingsCount = pendingBookings.length + confirmedRoomBookings.length + confirmedEventBookings.length + adminBookings.length
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
              const isSelected = selectedDate === day

              return (
                <div
                  key={day}
                  className={`calendar-day ${activeBookingsCount > 0 ? 'has-booking' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="day-content">
                    <span className="day-number">{day}</span>
                    {isToday && <span className="today-label">TODAY</span>}
                  </div>
                  {activeBookingsCount > 0 && (
                    <div className="booking-indicators">
                      {pendingBookings.map((_, i) => (
                        <span key={`pending-${i}`} className="indicator pending"></span>
                      ))}
                      {confirmedRoomBookings.map((_, i) => (
                        <span key={`room-${i}`} className="indicator room"></span>
                      ))}
                      {confirmedEventBookings.map((_, i) => (
                        <span key={`event-${i}`} className="indicator event"></span>
                      ))}
                      {adminBookings.map((_, i) => (
                        <span key={`admin-${i}`} className="indicator admin"></span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="indicator pending"></span>
              <span>Pending</span>
            </div>
            <div className="legend-item">
              <span className="indicator room"></span>
              <span>Confirmed Room</span>
            </div>
            <div className="legend-item">
              <span className="indicator event"></span>
              <span>Confirmed Event</span>
            </div>
            <div className="legend-item">
              <span className="indicator admin"></span>
              <span>Admin Booking</span>
            </div>
          </div>
        </div>

        {/* Popup Modal for Selected Date */}
        {selectedDate && (
          <div className="popup-overlay" onClick={() => setSelectedDate(null)}>
            <div className="popup-card" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header">
                <h3 className="popup-title">
                  {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button className="popup-close" onClick={() => setSelectedDate(null)}>×</button>
              </div>
              <div className="popup-body">
                {selectedBookings.length > 0 ? (
                  <div className="bookings-list">
                    {selectedBookings.map((booking) => (
                      <div key={`${booking.type}-${booking.id}`} className={`booking-item ${booking.booked_by_admin ? 'admin-booked' : ''}`}>
                        <div className="booking-info">
                          <div className="booking-header">
                            <span className="booking-id">{booking.booking_id || `#${booking.id}`}</span>
                            {booking.booked_by_admin ? (
                              <span className="type-badge admin">Admin</span>
                            ) : (
                              <>
                                <span className={`type-badge ${booking.type}`}>
                                  {booking.type === 'room' ? 'Room' : 'Event'}
                                </span>
                                <span className={`status-badge ${booking.status}`}>
                                  {booking.status}
                                </span>
                              </>
                            )}
                          </div>
                          <h4 className="booking-name">{booking.full_name}</h4>
                          <p className="booking-contact">{booking.email}</p>
                          <p className="booking-contact">{booking.phone}</p>
                          {booking.type === 'room' ? (
                            <p className="booking-details">
                              {formatDate(booking.check_in)} - {formatDate(booking.check_out)} • {booking.num_rooms} room(s) • {booking.guests} guests
                            </p>
                          ) : (
                            <p className="booking-details">
                              {formatDate(booking.event_date)} • {booking.event_type} • {booking.expected_guests} guests
                            </p>
                          )}
                        </div>
                        {!isBookingInPast(booking) && (
                          <div className="booking-actions">
                            {booking.status === 'pending' && !booking.booked_by_admin && (
                              <>
                                <button
                                  className="confirm-btn"
                                  onClick={() => confirmBooking(booking)}
                                  disabled={confirmingId === booking.id || cancellingId === booking.id}
                                >
                                  {confirmingId === booking.id ? 'Confirming...' : 'Confirm'}
                                </button>
                                <button
                                  className="cancel-btn"
                                  onClick={() => cancelBooking(booking)}
                                  disabled={cancellingId === booking.id || confirmingId === booking.id}
                                >
                                  {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                                </button>
                              </>
                            )}
                            <button
                              className="delete-btn"
                              onClick={() => deleteBooking(booking)}
                              title="Delete Booking"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : !showBookingForm ? (
                  <div className="no-bookings">
                    <span className="no-bookings-icon">📅</span>
                    <p>No bookings for this date</p>
                    <div className="admin-booking-buttons">
                      <button className="admin-book-btn room" onClick={() => openBookingForm('room')}>
                        + Add Room Booking
                      </button>
                      <button className="admin-book-btn event" onClick={() => openBookingForm('event')}>
                        + Add Event Booking
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="admin-booking-form">
                    <div className="form-type-tabs">
                      <button
                        className={`form-type-btn ${bookingFormType === 'room' ? 'active' : ''}`}
                        onClick={() => setBookingFormType('room')}
                      >
                        Room Booking
                      </button>
                      <button
                        className={`form-type-btn ${bookingFormType === 'event' ? 'active' : ''}`}
                        onClick={() => setBookingFormType('event')}
                      >
                        Event Booking
                      </button>
                    </div>

                    <form onSubmit={submitAdminBooking}>
                      <div className="form-row">
                        <input
                          type="text"
                          name="full_name"
                          placeholder="Full Name *"
                          value={bookingFormData.full_name}
                          onChange={handleBookingFormChange}
                          required
                        />
                      </div>
                      <div className="form-row two-cols">
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone *"
                          value={bookingFormData.phone}
                          onChange={handleBookingFormChange}
                          required
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email *"
                          value={bookingFormData.email}
                          onChange={handleBookingFormChange}
                          required
                        />
                      </div>

                      {bookingFormType === 'room' ? (
                        <>
                          <div className="form-row two-cols">
                            <div className="form-field">
                              <label>Check-in</label>
                              <input
                                type="date"
                                name="check_in"
                                value={bookingFormData.check_in}
                                onChange={handleBookingFormChange}
                                required
                              />
                            </div>
                            <div className="form-field">
                              <label>Check-out</label>
                              <input
                                type="date"
                                name="check_out"
                                value={bookingFormData.check_out}
                                onChange={handleBookingFormChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="form-row three-cols">
                            <div className="form-field">
                              <label>Room Type</label>
                              <select name="room_type" value={bookingFormData.room_type} onChange={handleBookingFormChange}>
                                <option value="cottage">Cottage</option>
                                <option value="suite">Suite</option>
                                <option value="deluxe">Deluxe</option>
                                <option value="family">Family</option>
                              </select>
                            </div>
                            <div className="form-field">
                              <label>Rooms</label>
                              <input
                                type="number"
                                name="num_rooms"
                                min="1"
                                value={bookingFormData.num_rooms}
                                onChange={handleBookingFormChange}
                              />
                            </div>
                            <div className="form-field">
                              <label>Guests</label>
                              <input
                                type="number"
                                name="guests"
                                min="1"
                                value={bookingFormData.guests}
                                onChange={handleBookingFormChange}
                              />
                            </div>
                          </div>
                          <div className="form-row">
                            <textarea
                              name="special_requests"
                              placeholder="Special Requests"
                              value={bookingFormData.special_requests}
                              onChange={handleBookingFormChange}
                              rows="2"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="form-row two-cols">
                            <div className="form-field">
                              <label>Event Date</label>
                              <input
                                type="date"
                                name="event_date"
                                value={bookingFormData.event_date}
                                onChange={handleBookingFormChange}
                                required
                              />
                            </div>
                            <div className="form-field">
                              <label>Event Type</label>
                              <select name="event_type" value={bookingFormData.event_type} onChange={handleBookingFormChange}>
                                <option value="wedding">Wedding</option>
                                <option value="corporate">Corporate</option>
                                <option value="birthday">Birthday</option>
                                <option value="others">Others</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-row two-cols">
                            <div className="form-field">
                              <label>Expected Guests</label>
                              <input
                                type="number"
                                name="expected_guests"
                                min="1"
                                value={bookingFormData.expected_guests}
                                onChange={handleBookingFormChange}
                              />
                            </div>
                            <div className="form-field">
                              <label>Budget</label>
                              <select name="budget_range" value={bookingFormData.budget_range} onChange={handleBookingFormChange}>
                                <option value="below_50k">Below 50K</option>
                                <option value="50k_100k">50K - 1L</option>
                                <option value="100k_200k">1L - 2L</option>
                                <option value="above_200k">Above 2L</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-row">
                            <textarea
                              name="notes"
                              placeholder="Additional Notes"
                              value={bookingFormData.notes}
                              onChange={handleBookingFormChange}
                              rows="2"
                            />
                          </div>
                        </>
                      )}

                      <div className="form-actions">
                        <button type="button" className="cancel-form-btn" onClick={() => setShowBookingForm(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="submit-form-btn" disabled={submittingBooking}>
                          {submittingBooking ? 'Creating...' : 'Create Booking'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pending Bookings Popup */}
        {showPendingPopup && (
          <div className="popup-overlay" onClick={() => setShowPendingPopup(false)}>
            <div className="popup-card pending-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header pending-header">
                <h3 className="popup-title">⏳ Pending Bookings ({pendingBookingsList.length})</h3>
                <button className="popup-close" onClick={() => setShowPendingPopup(false)}>×</button>
              </div>
              <div className="popup-body">
                {pendingBookingsList.length > 0 ? (
                  <div className="bookings-list">
                    {pendingBookingsList.map((booking) => (
                      <div key={`${booking.type}-${booking.id}`} className="booking-item pending-item">
                        <div className="booking-info">
                          <div className="booking-header">
                            <span className="booking-id">{booking.booking_id || `#${booking.id}`}</span>
                            <span className={`type-badge ${booking.type}`}>
                              {booking.type === 'room' ? 'Room' : 'Event'}
                            </span>
                          </div>
                          <h4 className="booking-name">{booking.full_name}</h4>
                          <p className="booking-contact">{booking.email}</p>
                          <p className="booking-contact">{booking.phone}</p>
                          {booking.type === 'room' ? (
                            <>
                              <p className="booking-details">
                                Check-in: {formatDate(booking.check_in)}
                              </p>
                              <p className="booking-details">
                                Check-out: {formatDate(booking.check_out)}
                              </p>
                              <p className="booking-details">
                                {booking.num_rooms} room(s) • {booking.guests} adults, {booking.children} children
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="booking-details">
                                Event: {booking.event_type}
                              </p>
                              <p className="booking-details">
                                Date: {formatDate(booking.event_date)}
                              </p>
                              <p className="booking-details">
                                Expected Guests: {booking.expected_guests}
                              </p>
                            </>
                          )}
                        </div>
                        {!isBookingInPast(booking) && (
                          <div className="booking-actions">
                            <button
                              className="confirm-btn"
                              onClick={() => confirmBooking(booking)}
                              disabled={confirmingId === booking.id || cancellingId === booking.id}
                            >
                              {confirmingId === booking.id ? 'Confirming...' : 'Confirm'}
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => cancelBooking(booking)}
                              disabled={cancellingId === booking.id || confirmingId === booking.id}
                            >
                              {cancellingId === booking.id ? 'Cancelling...' : 'Cancelled'}
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => {
                                deleteBooking(booking)
                                setPendingBookingsList(prev => prev.filter(b => !(b.id === booking.id && b.type === booking.type)))
                              }}
                              title="Delete Booking"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <span className="no-bookings-icon">✅</span>
                    <p>No pending bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Room Bookings Popup */}
        {showRoomPopup && (
          <div className="popup-overlay" onClick={() => setShowRoomPopup(false)}>
            <div className="popup-card room-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header room-header">
                <h3 className="popup-title">🛏️ Room Bookings ({roomBookingsList.length})</h3>
                <button className="popup-close" onClick={() => setShowRoomPopup(false)}>×</button>
              </div>
              <div className="popup-body">
                {roomBookingsList.length > 0 ? (
                  <div className="bookings-list">
                    {roomBookingsList.map((booking) => (
                      <div key={`room-${booking.id}`} className="booking-item room-item">
                        <div className="booking-info">
                          <div className="booking-header">
                            <span className="booking-id">{booking.booking_id || `#${booking.id}`}</span>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </div>
                          <h4 className="booking-name">{booking.full_name}</h4>
                          <p className="booking-contact">{booking.email}</p>
                          <p className="booking-contact">{booking.phone}</p>
                          <p className="booking-details">
                            Check-in: {formatDate(booking.check_in)}
                          </p>
                          <p className="booking-details">
                            Check-out: {formatDate(booking.check_out)}
                          </p>
                          <p className="booking-details">
                            {booking.num_rooms} room(s) • {booking.guests} adults, {booking.children} children
                          </p>
                        </div>
                        {!isBookingInPast(booking) && (
                          <button
                            className="delete-btn"
                            onClick={() => {
                              deleteBooking(booking)
                              setRoomBookingsList(prev => prev.filter(b => b.id !== booking.id))
                            }}
                            title="Delete Booking"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <span className="no-bookings-icon">🛏️</span>
                    <p>No room bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Event Bookings Popup */}
        {showEventPopup && (
          <div className="popup-overlay" onClick={() => setShowEventPopup(false)}>
            <div className="popup-card event-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header event-header">
                <h3 className="popup-title">🎉 Event Bookings ({eventBookingsList.length})</h3>
                <button className="popup-close" onClick={() => setShowEventPopup(false)}>×</button>
              </div>
              <div className="popup-body">
                {eventBookingsList.length > 0 ? (
                  <div className="bookings-list">
                    {eventBookingsList.map((booking) => (
                      <div key={`event-${booking.id}`} className="booking-item event-item">
                        <div className="booking-info">
                          <div className="booking-header">
                            <span className="booking-id">{booking.booking_id || `#${booking.id}`}</span>
                            <span className={`status-badge ${booking.status}`}>
                              {booking.status}
                            </span>
                          </div>
                          <h4 className="booking-name">{booking.full_name}</h4>
                          <p className="booking-contact">{booking.email}</p>
                          <p className="booking-contact">{booking.phone}</p>
                          <p className="booking-details">
                            Event: {booking.event_type}
                          </p>
                          <p className="booking-details">
                            Date: {formatDate(booking.event_date)}
                          </p>
                          <p className="booking-details">
                            Expected Guests: {booking.expected_guests}
                          </p>
                        </div>
                        {!isBookingInPast(booking) && (
                          <button
                            className="delete-btn"
                            onClick={() => {
                              deleteBooking(booking)
                              setEventBookingsList(prev => prev.filter(b => b.id !== booking.id))
                            }}
                            title="Delete Booking"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <span className="no-bookings-icon">🎉</span>
                    <p>No event bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirmed Bookings Popup */}
        {showConfirmedPopup && (
          <div className="popup-overlay" onClick={() => setShowConfirmedPopup(false)}>
            <div className="popup-card confirmed-popup" onClick={(e) => e.stopPropagation()}>
              <div className="popup-header confirmed-header">
                <h3 className="popup-title">✅ Confirmed Bookings ({confirmedBookingsList.length})</h3>
                <button className="popup-close" onClick={() => setShowConfirmedPopup(false)}>×</button>
              </div>
              <div className="popup-body">
                {confirmedBookingsList.length > 0 ? (
                  <div className="bookings-list">
                    {confirmedBookingsList.map((booking) => (
                      <div key={`${booking.type}-${booking.id}`} className="booking-item confirmed-item">
                        <div className="booking-info">
                          <div className="booking-header">
                            <span className="booking-id">{booking.booking_id || `#${booking.id}`}</span>
                            <span className={`type-badge ${booking.type}`}>
                              {booking.type === 'room' ? 'Room' : 'Event'}
                            </span>
                          </div>
                          <h4 className="booking-name">{booking.full_name}</h4>
                          <p className="booking-contact">{booking.email}</p>
                          <p className="booking-contact">{booking.phone}</p>
                          {booking.type === 'room' ? (
                            <>
                              <p className="booking-details">
                                Check-in: {formatDate(booking.check_in)}
                              </p>
                              <p className="booking-details">
                                Check-out: {formatDate(booking.check_out)}
                              </p>
                              <p className="booking-details">
                                {booking.num_rooms} room(s) • {booking.guests} adults, {booking.children} children
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="booking-details">
                                Event: {booking.event_type}
                              </p>
                              <p className="booking-details">
                                Date: {formatDate(booking.event_date)}
                              </p>
                              <p className="booking-details">
                                Expected Guests: {booking.expected_guests}
                              </p>
                            </>
                          )}
                        </div>
                        {!isBookingInPast(booking) && (
                          <button
                            className="delete-btn"
                            onClick={() => {
                              deleteBooking(booking)
                              setConfirmedBookingsList(prev => prev.filter(b => !(b.id === booking.id && b.type === booking.type)))
                            }}
                            title="Delete Booking"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <span className="no-bookings-icon">✅</span>
                    <p>No confirmed bookings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
