import { useState, useEffect } from 'react'
import './Balance.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

const Balance = () => {
  const [roomBookings, setRoomBookings] = useState([])
  const [eventBookings, setEventBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

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

  // Calculate totals
  const roomTotal = roomBookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
  const eventTotal = eventBookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
  const grandTotal = roomTotal + eventTotal

  const confirmedRoomTotal = roomBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)

  const confirmedEventTotal = eventBookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)

  const confirmedTotal = confirmedRoomTotal + confirmedEventTotal

  const pendingRoomTotal = roomBookings
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)

  const pendingEventTotal = eventBookings
    .filter(b => b.status === 'pending')
    .reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)

  const pendingTotal = pendingRoomTotal + pendingEventTotal

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
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
        <h1 className="page-title">Balance</h1>
        <p className="page-subtitle">Financial overview of all bookings</p>
      </div>

      {/* Summary Cards */}
      <div className="balance-summary">
        <div className="summary-card total">
          <div className="summary-icon">💰</div>
          <div className="summary-info">
            <span className="summary-label">Total Revenue</span>
            <span className="summary-value">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <div className="summary-card confirmed">
          <div className="summary-icon">✅</div>
          <div className="summary-info">
            <span className="summary-label">Confirmed</span>
            <span className="summary-value">{formatCurrency(confirmedTotal)}</span>
          </div>
        </div>

        <div className="summary-card pending">
          <div className="summary-icon">⏳</div>
          <div className="summary-info">
            <span className="summary-label">Pending</span>
            <span className="summary-value">{formatCurrency(pendingTotal)}</span>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="breakdown-grid">
        <div className="breakdown-card">
          <div className="breakdown-header">
            <h3>🛏️ Room Bookings</h3>
          </div>
          <div className="breakdown-body">
            <div className="breakdown-row">
              <span>Total Bookings</span>
              <span className="breakdown-value">{roomBookings.length}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Amount</span>
              <span className="breakdown-value">{formatCurrency(roomTotal)}</span>
            </div>
            <div className="breakdown-row">
              <span>Confirmed</span>
              <span className="breakdown-value green">{formatCurrency(confirmedRoomTotal)}</span>
            </div>
            <div className="breakdown-row">
              <span>Pending</span>
              <span className="breakdown-value orange">{formatCurrency(pendingRoomTotal)}</span>
            </div>
          </div>
        </div>

        <div className="breakdown-card">
          <div className="breakdown-header">
            <h3>🎉 Event Bookings</h3>
          </div>
          <div className="breakdown-body">
            <div className="breakdown-row">
              <span>Total Bookings</span>
              <span className="breakdown-value">{eventBookings.length}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Amount</span>
              <span className="breakdown-value">{formatCurrency(eventTotal)}</span>
            </div>
            <div className="breakdown-row">
              <span>Confirmed</span>
              <span className="breakdown-value green">{formatCurrency(confirmedEventTotal)}</span>
            </div>
            <div className="breakdown-row">
              <span>Pending</span>
              <span className="breakdown-value orange">{formatCurrency(pendingEventTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="balance-tabs">
        <button
          className={`balance-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`balance-tab ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          Room Transactions
        </button>
        <button
          className={`balance-tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Event Transactions
        </button>
      </div>

      {/* Transactions Table */}
      <div className="transactions-section">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="chart-placeholder">
              <div className="chart-bar-container">
                <div className="chart-bar-group">
                  <div className="chart-label">Room Bookings</div>
                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar room"
                      style={{ width: `${grandTotal > 0 ? (roomTotal / grandTotal) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="chart-amount">{formatCurrency(roomTotal)}</div>
                </div>
                <div className="chart-bar-group">
                  <div className="chart-label">Event Bookings</div>
                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar event"
                      style={{ width: `${grandTotal > 0 ? (eventTotal / grandTotal) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="chart-amount">{formatCurrency(eventTotal)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {roomBookings.length > 0 ? (
                  roomBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.full_name}</td>
                      <td>{formatDate(booking.check_in)}</td>
                      <td>{formatDate(booking.check_out)}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="amount-cell">{formatCurrency(booking.total_amount || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No room bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Event Type</th>
                  <th>Event Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {eventBookings.length > 0 ? (
                  eventBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>#{booking.id}</td>
                      <td>{booking.full_name}</td>
                      <td>{booking.event_type}</td>
                      <td>{formatDate(booking.event_date)}</td>
                      <td>
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="amount-cell">{formatCurrency(booking.total_amount || 0)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No event bookings found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Balance
