// API utility functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const apiEndpoints = {
  roomBookings: `${API_BASE_URL}/bookings/rooms/`,
  eventBookings: `${API_BASE_URL}/bookings/events/`
};

export const createBooking = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: responseData.errors || {},
        message: responseData.message || 'An error occurred while processing your request.'
      };
    }

    return {
      success: true,
      data: responseData,
      message: responseData.message
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Unable to connect to the server. Please try again later.'
    };
  }
};
