import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { apiEndpoints, createBooking } from '../utils/api'
import './BookingSection.css'

const Toast = ({ message, type, onClose }) => (
  <div className={`toast ${type}`}>
    {message}
    <button className="toast-close" onClick={onClose}>×</button>
  </div>
)

const BookingSection = () => {
  const [activeTab, setActiveTab] = useState('room')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const [roomForm, setRoomForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    check_in: null,
    check_out: null,
    room_type: 'cottage',
    guests: '2',
    children: '0',
    num_rooms: '1',
    // Room type breakdown for multiple rooms
    cottage_count: '0',
    suite_count: '0',
    deluxe_count: '0',
    family_count: '0',
    special_requests: ''
  })

  const [eventForm, setEventForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    event_date: null,
    event_type: 'wedding',
    expected_guests: '50',
    budget_range: '50k_100k',
    notes: ''
  })

  const [errors, setErrors] = useState({})

  // Check if room form is complete (all required fields filled)
  const isRoomFormValid = () => {
    const basicValid = (
      roomForm.full_name.trim() !== '' &&
      roomForm.phone.trim() !== '' &&
      roomForm.email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(roomForm.email) &&
      roomForm.check_in !== null &&
      roomForm.check_out !== null &&
      roomForm.check_out > roomForm.check_in &&
      roomForm.guests !== '' &&
      roomForm.num_rooms !== '' &&
      parseInt(roomForm.num_rooms) >= 1
    )

    if (!basicValid) return false

    // For multiple rooms, check that room type counts add up to total rooms
    if (parseInt(roomForm.num_rooms) > 1) {
      const totalRoomTypes =
        parseInt(roomForm.cottage_count || 0) +
        parseInt(roomForm.suite_count || 0) +
        parseInt(roomForm.deluxe_count || 0) +
        parseInt(roomForm.family_count || 0)
      return totalRoomTypes === parseInt(roomForm.num_rooms)
    }

    return true
  }

  // Check if event form is complete (all required fields filled)
  const isEventFormValid = () => {
    return (
      eventForm.full_name.trim() !== '' &&
      eventForm.phone.trim() !== '' &&
      eventForm.email.trim() !== '' &&
      /\S+@\S+\.\S+/.test(eventForm.email) &&
      eventForm.event_date !== null &&
      eventForm.expected_guests !== ''
    )
  }

  // Format date for API submission (YYYY-MM-DD) using local timezone
  const formatDateForAPI = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const handleRoomChange = (e) => {
    const { name, value } = e.target

    // For room type count inputs, validate that total doesn't exceed num_rooms
    if (['cottage_count', 'suite_count', 'deluxe_count', 'family_count'].includes(name)) {
      const newValue = parseInt(value) || 0
      const numRooms = parseInt(roomForm.num_rooms) || 1

      // Calculate current total excluding the field being changed
      const currentTotal =
        (name === 'cottage_count' ? 0 : parseInt(roomForm.cottage_count) || 0) +
        (name === 'suite_count' ? 0 : parseInt(roomForm.suite_count) || 0) +
        (name === 'deluxe_count' ? 0 : parseInt(roomForm.deluxe_count) || 0) +
        (name === 'family_count' ? 0 : parseInt(roomForm.family_count) || 0)

      // Calculate maximum allowed for this field
      const maxAllowed = numRooms - currentTotal

      // Show warning if user tries to exceed the limit
      if (newValue > maxAllowed) {
        showToast(`You've reached the limit! You can only allocate ${numRooms} rooms in total.`, 'error')
      }

      // Clamp the value between 0 and maxAllowed
      const clampedValue = Math.max(0, Math.min(newValue, maxAllowed))

      setRoomForm(prev => ({ ...prev, [name]: clampedValue.toString() }))
    } else {
      setRoomForm(prev => ({ ...prev, [name]: value }))

      // If num_rooms changes, reset the room type counts
      if (name === 'num_rooms') {
        setRoomForm(prev => ({
          ...prev,
          [name]: value,
          cottage_count: '0',
          suite_count: '0',
          deluxe_count: '0',
          family_count: '0'
        }))
      }
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleEventChange = (e) => {
    const { name, value } = e.target
    setEventForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const validateRoomForm = () => {
    const newErrors = {}

    if (!roomForm.full_name.trim()) newErrors.full_name = 'Name is required'
    if (!roomForm.phone.trim()) newErrors.phone = 'Phone is required'
    if (!roomForm.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(roomForm.email)) newErrors.email = 'Email is invalid'
    if (!roomForm.check_in) newErrors.check_in = 'Check-in date is required'
    if (!roomForm.check_out) newErrors.check_out = 'Check-out date is required'
    else if (roomForm.check_out <= roomForm.check_in) {
      newErrors.check_out = 'Check-out must be after check-in'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateEventForm = () => {
    const newErrors = {}

    if (!eventForm.full_name.trim()) newErrors.full_name = 'Name is required'
    if (!eventForm.phone.trim()) newErrors.phone = 'Phone is required'
    if (!eventForm.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(eventForm.email)) newErrors.email = 'Email is invalid'
    if (!eventForm.event_date) newErrors.event_date = 'Event date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCheckInChange = (date) => {
    setRoomForm(prev => ({
      ...prev,
      check_in: date,
      check_out: prev.check_out && prev.check_out <= date ? null : prev.check_out
    }))
    if (errors.check_in) setErrors(prev => ({ ...prev, check_in: null }))
  }

  const handleCheckOutChange = (date) => {
    setRoomForm(prev => ({ ...prev, check_out: date }))
    if (errors.check_out) setErrors(prev => ({ ...prev, check_out: null }))
  }

  const handleEventDateChange = (date) => {
    setEventForm(prev => ({ ...prev, event_date: date }))
    if (errors.event_date) setErrors(prev => ({ ...prev, event_date: null }))
  }

  const handleRoomSubmit = async (e) => {
    e.preventDefault()

    if (!validateRoomForm()) return

    setLoading(true)

    const numRooms = parseInt(roomForm.num_rooms)
    const bookingData = {
      ...roomForm,
      check_in: formatDateForAPI(roomForm.check_in),
      check_out: formatDateForAPI(roomForm.check_out),
      guests: parseInt(roomForm.guests),
      children: parseInt(roomForm.children) || 0,
      num_rooms: numRooms,
      cottage_count: parseInt(roomForm.cottage_count) || 0,
      suite_count: parseInt(roomForm.suite_count) || 0,
      deluxe_count: parseInt(roomForm.deluxe_count) || 0,
      family_count: parseInt(roomForm.family_count) || 0
    }

    // For single room, set room_type; for multiple rooms, clear it
    if (numRooms === 1) {
      bookingData.room_type = roomForm.room_type
    } else {
      bookingData.room_type = null
    }

    const result = await createBooking(apiEndpoints.roomBookings, bookingData)

    setLoading(false)

    if (result.success) {
      showToast(result.message || 'Room booking submitted successfully!', 'success')
      setRoomForm({
        full_name: '',
        phone: '',
        email: '',
        check_in: null,
        check_out: null,
        room_type: 'cottage',
        guests: '2',
        children: '0',
        num_rooms: '1',
        cottage_count: '0',
        suite_count: '0',
        deluxe_count: '0',
        family_count: '0',
        special_requests: ''
      })
    } else {
      if (result.errors) {
        setErrors(result.errors)
      }
      showToast(result.message || 'Failed to submit booking. Please try again.', 'error')
    }
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()

    if (!validateEventForm()) return

    setLoading(true)

    const result = await createBooking(apiEndpoints.eventBookings, {
      ...eventForm,
      event_date: formatDateForAPI(eventForm.event_date),
      expected_guests: parseInt(eventForm.expected_guests)
    })

    setLoading(false)

    if (result.success) {
      showToast(result.message || 'Event booking submitted successfully!', 'success')
      setEventForm({
        full_name: '',
        phone: '',
        email: '',
        event_date: null,
        event_type: 'wedding',
        expected_guests: '50',
        budget_range: '50k_100k',
        notes: ''
      })
    } else {
      if (result.errors) {
        setErrors(result.errors)
      }
      showToast(result.message || 'Failed to submit booking. Please try again.', 'error')
    }
  }

  return (
    <section id="booking" className="booking-section section">
      <div className="container">
        <h2 className="section-title fade-in">Book Your Experience</h2>

        <div className="booking-tabs fade-in">
          <button
            className={`tab-button ${activeTab === 'room' ? 'active' : ''}`}
            onClick={() => setActiveTab('room')}
            data-tab="room"
          >
            Room Booking
          </button>
          <button
            className={`tab-button ${activeTab === 'event' ? 'active' : ''}`}
            onClick={() => setActiveTab('event')}
            data-tab="event"
          >
            Event Booking
          </button>
        </div>

        <div className="booking-content fade-in">
          {activeTab === 'room' ? (
            <form className="booking-form" onSubmit={handleRoomSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="room-full-name">Full Name *</label>
                  <input
                    type="text"
                    id="room-full-name"
                    name="full_name"
                    value={roomForm.full_name}
                    onChange={handleRoomChange}
                    className={errors.full_name ? 'error' : ''}
                  />
                  {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="room-phone">Phone *</label>
                  <input
                    type="tel"
                    id="room-phone"
                    name="phone"
                    value={roomForm.phone}
                    onChange={handleRoomChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="room-email">Email *</label>
                  <input
                    type="email"
                    id="room-email"
                    name="email"
                    value={roomForm.email}
                    onChange={handleRoomChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="room-check-in">Check-in Date *</label>
                  <DatePicker
                    id="room-check-in"
                    selected={roomForm.check_in}
                    onChange={handleCheckInChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select check-in date"
                    className={errors.check_in ? 'error' : ''}
                    calendarClassName="custom-calendar"
                    showPopperArrow={false}
                    autoComplete="off"
                  />
                  {errors.check_in && <span className="error-message">{errors.check_in}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="room-check-out">Check-out Date *</label>
                  <DatePicker
                    id="room-check-out"
                    selected={roomForm.check_out}
                    onChange={handleCheckOutChange}
                    minDate={roomForm.check_in || new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select check-out date"
                    className={errors.check_out ? 'error' : ''}
                    calendarClassName="custom-calendar"
                    showPopperArrow={false}
                    autoComplete="off"
                  />
                  {errors.check_out && <span className="error-message">{errors.check_out}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="room-guests">Number of Adults *</label>
                  <input
                    type="number"
                    id="room-guests"
                    name="guests"
                    min="1"
                    max="20"
                    value={roomForm.guests}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="room-children">Number of Children</label>
                  <input
                    type="number"
                    id="room-children"
                    name="children"
                    min="0"
                    max="10"
                    value={roomForm.children}
                    onChange={handleRoomChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="room-num-rooms">Number of Rooms *</label>
                  <input
                    type="number"
                    id="room-num-rooms"
                    name="num_rooms"
                    min="1"
                    max="10"
                    value={roomForm.num_rooms}
                    onChange={handleRoomChange}
                  />
                </div>

                {/* Single room - show room type dropdown */}
                {parseInt(roomForm.num_rooms) === 1 && (
                  <div className="form-group">
                    <label htmlFor="room-type">Room Type *</label>
                    <select
                      id="room-type"
                      name="room_type"
                      value={roomForm.room_type}
                      onChange={handleRoomChange}
                    >
                      <option value="cottage">Cottage</option>
                      <option value="suite">Suite</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="family">Family</option>
                    </select>
                  </div>
                )}

                {/* Multiple rooms - show room type breakdown */}
                {parseInt(roomForm.num_rooms) > 1 && (
                  <div className="form-group full-width room-type-breakdown">
                    <label>Room Type Breakdown * <span className="hint">(Total must equal {roomForm.num_rooms} rooms)</span></label>
                    <div className="room-type-grid">
                      <div className="room-type-input">
                        <label htmlFor="cottage-count">Cottage</label>
                        <input
                          type="number"
                          id="cottage-count"
                          name="cottage_count"
                          min="0"
                          max={roomForm.num_rooms}
                          value={roomForm.cottage_count}
                          onChange={handleRoomChange}
                        />
                      </div>
                      <div className="room-type-input">
                        <label htmlFor="suite-count">Suite</label>
                        <input
                          type="number"
                          id="suite-count"
                          name="suite_count"
                          min="0"
                          max={roomForm.num_rooms}
                          value={roomForm.suite_count}
                          onChange={handleRoomChange}
                        />
                      </div>
                      <div className="room-type-input">
                        <label htmlFor="deluxe-count">Deluxe</label>
                        <input
                          type="number"
                          id="deluxe-count"
                          name="deluxe_count"
                          min="0"
                          max={roomForm.num_rooms}
                          value={roomForm.deluxe_count}
                          onChange={handleRoomChange}
                        />
                      </div>
                      <div className="room-type-input">
                        <label htmlFor="family-count">Family</label>
                        <input
                          type="number"
                          id="family-count"
                          name="family_count"
                          min="0"
                          max={roomForm.num_rooms}
                          value={roomForm.family_count}
                          onChange={handleRoomChange}
                        />
                      </div>
                    </div>
                    {(() => {
                      const selected = parseInt(roomForm.cottage_count || 0) + parseInt(roomForm.suite_count || 0) + parseInt(roomForm.deluxe_count || 0) + parseInt(roomForm.family_count || 0)
                      const total = parseInt(roomForm.num_rooms)
                      const isComplete = selected === total
                      return (
                        <div className={`room-count-status ${isComplete ? 'complete' : 'incomplete'}`}>
                          {isComplete
                            ? `All ${total} rooms allocated!`
                            : `Please allocate ${total - selected} more room${total - selected > 1 ? 's' : ''} (${selected}/${total} selected)`
                          }
                        </div>
                      )
                    })()}
                  </div>
                )}

                <div className="form-group full-width">
                  <label htmlFor="room-requests">Special Requests</label>
                  <textarea
                    id="room-requests"
                    name="special_requests"
                    rows="4"
                    value={roomForm.special_requests}
                    onChange={handleRoomChange}
                    placeholder="Any special requirements or preferences..."
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading || !isRoomFormValid()}>
                {loading ? <span className="spinner"></span> : 'Submit Booking'}
              </button>
            </form>
          ) : (
            <form className="booking-form" onSubmit={handleEventSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="event-full-name">Full Name *</label>
                  <input
                    type="text"
                    id="event-full-name"
                    name="full_name"
                    value={eventForm.full_name}
                    onChange={handleEventChange}
                    className={errors.full_name ? 'error' : ''}
                  />
                  {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="event-phone">Phone *</label>
                  <input
                    type="tel"
                    id="event-phone"
                    name="phone"
                    value={eventForm.phone}
                    onChange={handleEventChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="event-email">Email *</label>
                  <input
                    type="email"
                    id="event-email"
                    name="email"
                    value={eventForm.email}
                    onChange={handleEventChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="event-date">Event Date *</label>
                  <DatePicker
                    id="event-date"
                    selected={eventForm.event_date}
                    onChange={handleEventDateChange}
                    minDate={new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select event date"
                    className={errors.event_date ? 'error' : ''}
                    calendarClassName="custom-calendar"
                    showPopperArrow={false}
                    autoComplete="off"
                  />
                  {errors.event_date && <span className="error-message">{errors.event_date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="event-type">Event Type *</label>
                  <select
                    id="event-type"
                    name="event_type"
                    value={eventForm.event_type}
                    onChange={handleEventChange}
                  >
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate</option>
                    <option value="birthday">Birthday</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="event-guests">Expected Guests *</label>
                  <input
                    type="number"
                    id="event-guests"
                    name="expected_guests"
                    min="1"
                    max="1000"
                    value={eventForm.expected_guests}
                    onChange={handleEventChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="event-budget">Budget Range *</label>
                  <select
                    id="event-budget"
                    name="budget_range"
                    value={eventForm.budget_range}
                    onChange={handleEventChange}
                  >
                    <option value="below_50k">Below ₹50,000</option>
                    <option value="50k_100k">₹50,000 - ₹1,00,000</option>
                    <option value="100k_200k">₹1,00,000 - ₹2,00,000</option>
                    <option value="above_200k">Above ₹2,00,000</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="event-notes">Additional Notes</label>
                  <textarea
                    id="event-notes"
                    name="notes"
                    rows="4"
                    value={eventForm.notes}
                    onChange={handleEventChange}
                    placeholder="Tell us more about your event..."
                  />
                </div>
              </div>

              <button type="submit" className="submit-button" disabled={loading || !isEventFormValid()}>
                {loading ? <span className="spinner"></span> : 'Submit Booking'}
              </button>
            </form>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </section>
  )
}

export default BookingSection
