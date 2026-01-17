import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

// Admin imports
import AdminLayout from './admin/components/AdminLayout'
import Login from './admin/pages/Login'
import AdminHome from './admin/pages/Home'
import Bookings from './admin/pages/Bookings'
import Edit from './admin/pages/Edit'
import Accounts from './admin/pages/Accounts'
import Balance from './admin/pages/Balance'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="edit" element={<Edit />} />
          <Route path="balance" element={<Balance />} />
          <Route path="accounts" element={<Accounts />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
