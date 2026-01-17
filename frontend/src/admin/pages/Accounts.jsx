import { useState } from 'react'
import './Accounts.css'

const Accounts = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  const adminInfo = JSON.parse(localStorage.getItem('adminAuth') || '{}')

  const handlePasswordChange = (e) => {
    e.preventDefault()

    // Validation
    if (currentPassword !== 'silvermoon2026') {
      setMessage({ type: 'error', text: 'Current password is incorrect' })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    // In production, this would update the password in backend
    setMessage({ type: 'success', text: 'Password changed successfully! (Demo only - not persisted)' })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')

    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Account Settings</h1>
        <p className="page-subtitle">Manage your admin account</p>
      </div>

      <div className="accounts-grid">
        {/* Account Info */}
        <div className="account-card">
          <div className="card-header">
            <h2>Account Information</h2>
          </div>
          <div className="card-body">
            <div className="account-avatar">
              <span>👤</span>
            </div>
            <div className="account-details">
              <div className="detail-row">
                <span className="detail-label">Username</span>
                <span className="detail-value">{adminInfo.username || 'admin'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className="detail-value role-badge">Administrator</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Last Login</span>
                <span className="detail-value">{formatDate(adminInfo.loginTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="account-card">
          <div className="card-header">
            <h2>Change Password</h2>
          </div>
          <div className="card-body">
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button type="submit" className="save-btn">
                Update Password
              </button>
            </form>
          </div>
        </div>

        {/* Quick Info */}
        <div className="account-card info-card">
          <div className="card-header">
            <h2>Admin Credentials</h2>
          </div>
          <div className="card-body">
            <div className="info-box">
              <p><strong>Default Login:</strong></p>
              <p>Username: <code>admin</code></p>
              <p>Password: <code>silvermoon2026</code></p>
              <hr />
              <p className="info-note">
                Note: In production, implement proper authentication with Django backend using JWT tokens or session-based auth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Accounts
