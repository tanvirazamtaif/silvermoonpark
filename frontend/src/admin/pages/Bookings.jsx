import { useState, useEffect } from 'react'
import './Bookings.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('room')
  const [roomBookings, setRoomBookings] = useState([])
  const [eventBookings, setEventBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const [roomRes, eventRes] = await Promise.all([
        fetch(`${API_BASE}/bookings/rooms/`),
        fetch(`${API_BASE}/bookings/events/`)
      ])

      const roomData = await roomRes.json()
      const eventData = await eventRes.json()

      setRoomBookings(roomData)
      setEventBookings(eventData)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId, newStatus, type) => {
    setActionLoading(newStatus)
    try {
      const endpoint = type === 'room' ? 'rooms' : 'events'

      if (newStatus === 'confirmed') {
        // Use the confirm endpoint to send confirmation email
        const response = await fetch(`${API_BASE}/bookings/${endpoint}/${bookingId}/confirm/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
          const data = await response.json()
          alert(`Booking ${selectedBooking.booking_id || '#' + bookingId} confirmed! Confirmation email sent to ${selectedBooking.email}`)
        } else {
          const error = await response.json()
          alert(`Failed to confirm booking: ${error.message || 'Unknown error'}`)
          return
        }
      } else {
        // For pending/cancelled, use PATCH
        const response = await fetch(`${API_BASE}/bookings/${endpoint}/${bookingId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })

        if (response.ok) {
          alert(`Booking ${selectedBooking.booking_id || '#' + bookingId} status updated to ${newStatus}`)
        } else {
          alert(`Failed to update booking status`)
          return
        }
      }

      // Refresh bookings
      fetchBookings()
      setSelectedBooking(null)
    } catch (error) {
      console.error('Error updating booking:', error)
      alert('Failed to update booking status')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Helper function to check if a booking's date is in the past
  const isBookingInPast = (booking) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (booking.type === 'room' || booking.check_out) {
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

  const handleDeleteBooking = async (e, bookingId, type) => {
    e.stopPropagation() // Prevent opening modal
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return

    try {
      const endpoint = type === 'room' ? 'rooms' : 'events'
      const response = await fetch(`${API_BASE}/bookings/${endpoint}/${bookingId}/`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Booking deleted successfully')
        fetchBookings()
      } else {
        alert('Failed to delete booking')
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking')
    }
  }

  const getFilteredBookings = (bookings) => {
    let filtered = bookings

    // Apply status/admin filter
    if (filter === 'admin') {
      filtered = filtered.filter(b => b.booked_by_admin)
    } else if (filter !== 'all') {
      filtered = filtered.filter(b => b.status === filter)
    }

    // Apply search filter (phone number)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()
      filtered = filtered.filter(b =>
        b.phone?.toLowerCase().includes(query) ||
        b.full_name?.toLowerCase().includes(query) ||
        b.email?.toLowerCase().includes(query) ||
        b.booking_id?.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  const currentBookings = activeTab === 'room'
    ? getFilteredBookings(roomBookings)
    : getFilteredBookings(eventBookings)

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
        <div className="page-header-left">
          <h1 className="page-title">Bookings</h1>
          <p className="page-subtitle">Manage room and event bookings</p>
        </div>
        <div className="page-header-right">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by phone, name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bookings-tabs">
        <button
          className={`tab-btn ${activeTab === 'room' ? 'active' : ''}`}
          onClick={() => setActiveTab('room')}
        >
          Room Bookings ({roomBookings.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'event' ? 'active' : ''}`}
          onClick={() => setActiveTab('event')}
        >
          Event Bookings ({eventBookings.length})
        </button>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {currentBookings.length > 0 ? (
          currentBookings.map((booking) => (
            <div key={booking.id} className={`booking-card ${booking.booked_by_admin ? 'admin-card' : ''}`} onClick={() => setSelectedBooking({ ...booking, type: activeTab })}>
              <div className="booking-header">
                <span className="booking-id">{booking.booking_id || `#${booking.id}`}</span>
                {booking.booked_by_admin && (
                  <span className="admin-badge">Admin</span>
                )}
                <span className={`status-badge ${booking.status}`}>{booking.status}</span>
              </div>
              <div className="booking-body">
                <h3 className="booking-name">{booking.full_name}</h3>
                <p className="booking-contact">{booking.email}</p>
                <p className="booking-contact">{booking.phone}</p>
              </div>
              <div className="booking-footer">
                {activeTab === 'room' ? (
                  <span className="booking-date">
                    {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                  </span>
                ) : (
                  <span className="booking-date">
                    {formatDate(booking.event_date)} • {booking.event_type}
                  </span>
                )}
                <button
                  className="card-delete-btn"
                  onClick={(e) => handleDeleteBooking(e, booking.id, activeTab)}
                  title="Delete booking"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-bookings">
            <p>No {filter !== 'all' ? filter : ''} bookings found</p>
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedBooking(null)}>×</button>

            <div className="modal-header">
              <h2>Booking {selectedBooking.booking_id || `#${selectedBooking.id}`}</h2>
              <div className="modal-badges">
                {selectedBooking.booked_by_admin && (
                  <span className="admin-badge large">Admin</span>
                )}
                <span className={`status-badge large ${selectedBooking.status}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Guest Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{selectedBooking.full_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{selectedBooking.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{selectedBooking.phone}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.type === 'room' ? (
                <div className="detail-section">
                  <h3>Room Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Check-in</span>
                      <span className="detail-value">{formatDate(selectedBooking.check_in)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Check-out</span>
                      <span className="detail-value">{formatDate(selectedBooking.check_out)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Guests</span>
                      <span className="detail-value">
                        {selectedBooking.guests} adults, {selectedBooking.children} children
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rooms</span>
                      <span className="detail-value">{selectedBooking.num_rooms}</span>
                    </div>
                    {selectedBooking.num_rooms === 1 && selectedBooking.room_type && (
                      <div className="detail-item">
                        <span className="detail-label">Room Type</span>
                        <span className="detail-value">{selectedBooking.room_type}</span>
                      </div>
                    )}
                    {selectedBooking.num_rooms > 1 && (
                      <div className="detail-item full-width">
                        <span className="detail-label">Room Breakdown</span>
                        <span className="detail-value">
                          {selectedBooking.cottage_count > 0 && `Cottage: ${selectedBooking.cottage_count} `}
                          {selectedBooking.suite_count > 0 && `Suite: ${selectedBooking.suite_count} `}
                          {selectedBooking.deluxe_count > 0 && `Deluxe: ${selectedBooking.deluxe_count} `}
                          {selectedBooking.family_count > 0 && `Family: ${selectedBooking.family_count}`}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedBooking.special_requests && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Special Requests</span>
                      <span className="detail-value">{selectedBooking.special_requests}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="detail-section">
                  <h3>Event Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Event Date</span>
                      <span className="detail-value">{formatDate(selectedBooking.event_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Event Type</span>
                      <span className="detail-value">{selectedBooking.event_type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expected Guests</span>
                      <span className="detail-value">{selectedBooking.expected_guests}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Budget</span>
                      <span className="detail-value">{selectedBooking.budget_range}</span>
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="detail-item full-width">
                      <span className="detail-label">Notes</span>
                      <span className="detail-value">{selectedBooking.notes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isBookingInPast(selectedBooking) && (
              <div className="modal-actions">
                <button
                  className="action-btn confirm"
                  onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed', selectedBooking.type)}
                  disabled={selectedBooking.status === 'confirmed' || actionLoading !== null}
                >
                  {actionLoading === 'confirmed' ? 'Confirming...' : 'Confirm'}
                </button>
                <button
                  className="action-btn pending"
                  onClick={() => updateBookingStatus(selectedBooking.id, 'pending', selectedBooking.type)}
                  disabled={selectedBooking.status === 'pending' || actionLoading !== null}
                >
                  {actionLoading === 'pending' ? 'Updating...' : 'Pending'}
                </button>
                <button
                  className="action-btn cancel"
                  onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled', selectedBooking.type)}
                  disabled={selectedBooking.status === 'cancelled' || actionLoading !== null}
                >
                  {actionLoading === 'cancelled' ? 'Cancelling...' : 'Cancel'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Bookings
