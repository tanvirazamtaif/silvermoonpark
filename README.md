# Silvermoon Resort - Full Stack Web Application

A production-ready Django REST Framework + React web application for Silvermoon Resort featuring room bookings, event management, and a premium user experience.

## Tech Stack

**Backend:**
- Python 3
- Django 4.2+
- Django REST Framework
- django-cors-headers
- SQLite database

**Frontend:**
- React 18
- React Router
- Vite
- CSS Modules
- No external UI libraries

## Features

- **Responsive Design:** Mobile-first approach with hamburger menu on mobile
- **Hero Slideshow:** Auto-rotating slides with desktop arrows and mobile swipe support
- **Explore Cards:** 9 feature cards with hover effects and modal details
- **Gallery:** Grid layout with fullscreen lightbox viewer (desktop arrows + mobile swipe)
- **Booking Forms:** Separate forms for room and event bookings with Django API integration
- **Dark/Light Mode:** Theme toggle with localStorage persistence
- **Scroll Animations:** Smooth reveal animations on scroll
- **Toast Notifications:** Real-time feedback for booking submissions
- **📧 Email Notifications:** Automatic email notifications for all bookings

## Project Structure

```
silvermoon/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── backend/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── api/
│       ├── __init__.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       └── migrations/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── components/
        ├── pages/
        └── utils/
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**

   On Windows:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   On macOS/Linux:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (for admin access):**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin account.

6. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

   The backend will be available at: `http://127.0.0.1:8000/`
   Django admin panel: `http://127.0.0.1:8000/admin/`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```

   Default API endpoint is already configured: `http://127.0.0.1:8000/api`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at: `http://localhost:5173/`

## API Endpoints

### Room Bookings
- `POST /api/bookings/rooms/` - Create room booking
- `GET /api/bookings/rooms/` - List all room bookings (admin)

### Event Bookings
- `POST /api/bookings/events/` - Create event booking
- `GET /api/bookings/events/` - List all event bookings (admin)

## Development Workflow

1. Start the backend server (port 8000)
2. Start the frontend dev server (port 5173)
3. Access the application at `http://localhost:5173`
4. Access Django admin at `http://127.0.0.1:8000/admin/`

## Key Features Implementation

### Dark/Light Mode
Theme preference is stored in localStorage and persists across sessions. Toggle button is available in the navbar.

### Booking Forms
Both room and event booking forms include:
- Client-side validation
- Real-time error feedback
- Loading states during submission
- Success/error toast notifications
- API integration with Django backend

### Gallery Lightbox
- Desktop: Arrow navigation + keyboard support (left/right/ESC)
- Mobile: Touch swipe navigation
- Image counter display
- Focus trap for accessibility

### Hero Slideshow
- Auto-rotates every 5 seconds
- Desktop: Arrow button navigation
- Mobile: Touch swipe support
- Direct links to booking sections with tab selection

## Admin Panel Features

Access the Django admin panel to:
- View all room bookings with filters (status, room type, dates)
- View all event bookings with filters (status, event type, budget)
- Update booking status (pending/confirmed/cancelled)
- Search bookings by name, email, or phone

## Production Build

### Backend
For production deployment, update `settings.py`:
- Set `DEBUG = False`
- Configure `ALLOWED_HOSTS`
- Use PostgreSQL or MySQL instead of SQLite
- Set secure `SECRET_KEY`
- Configure static files serving

### Frontend
Build the production bundle:
```bash
cd frontend
npm run build
```

The optimized files will be in the `dist/` directory.

## 📧 Email Notifications

The system automatically sends email notifications for every booking:

- **From:** silvermoonpark7@gmail.com
- **To:** tanvirazamtaifbd@gmail.com

### Setup Instructions:
See [EMAIL_SETUP_GUIDE.md](EMAIL_SETUP_GUIDE.md) for complete setup instructions (~5 minutes).

You need to:
1. Enable 2-Factor Authentication on silvermoonpark7@gmail.com
2. Generate Gmail App Password
3. Add password to settings.py
4. Done!

### What Gets Sent:
Each email notification includes:
- Booking ID and timestamp
- Customer details (name, email, phone)
- Booking specifics (room type/event type, dates, guests, budget)
- Special requests/notes
- Booking status

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

All rights reserved © 2025 Silvermoon Resort



My Admin Panel: http://localhost:5173/admin