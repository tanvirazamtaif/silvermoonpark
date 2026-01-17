"""
Notification utilities for sending booking confirmations via Email
"""
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def format_room_breakdown(booking):
    """Format room type breakdown for multiple rooms"""
    if booking.num_rooms == 1:
        return f"   Type: {booking.get_room_type_display() or 'Not specified'}"

    breakdown_parts = []
    if booking.cottage_count > 0:
        breakdown_parts.append(f"   Cottage: {booking.cottage_count}")
    if booking.suite_count > 0:
        breakdown_parts.append(f"   Suite: {booking.suite_count}")
    if booking.deluxe_count > 0:
        breakdown_parts.append(f"   Deluxe: {booking.deluxe_count}")
    if booking.family_count > 0:
        breakdown_parts.append(f"   Family: {booking.family_count}")

    return "\n".join(breakdown_parts) if breakdown_parts else "   Type: Not specified"


def format_room_booking_message(booking):
    """Format room booking data into a readable message"""
    room_details = format_room_breakdown(booking)

    return f"""
🏨 NEW ROOM BOOKING - Silvermoon Park

📋 Booking ID: #{booking.id}
👤 Guest: {booking.full_name}
📧 Email: {booking.email}
📞 Phone: {booking.phone}

👥 Guests:
   Adults: {booking.guests}
   Children: {booking.children}
   Total: {booking.guests + booking.children}

🛏️ Room Details:
   Total Rooms: {booking.num_rooms}
{room_details}
   Check-in: {booking.check_in}
   Check-out: {booking.check_out}

📝 Special Requests:
{booking.special_requests or 'None'}

🕐 Booked at: {booking.created_at.strftime('%Y-%m-%d %H:%M')}
📊 Status: {booking.status.upper()}
""".strip()


def format_event_booking_message(booking):
    """Format event booking data into a readable message"""
    return f"""
🎉 NEW EVENT BOOKING - Silvermoon Park

📋 Booking ID: #{booking.id}
👤 Organizer: {booking.full_name}
📧 Email: {booking.email}
📞 Phone: {booking.phone}

🎊 Event Details:
   Type: {booking.get_event_type_display()}
   Date: {booking.event_date}
   Expected Guests: {booking.expected_guests}
   Budget: {booking.get_budget_range_display()}

📝 Additional Notes:
{booking.notes or 'None'}

🕐 Booked at: {booking.created_at.strftime('%Y-%m-%d %H:%M')}
📊 Status: {booking.status.upper()}
""".strip()


def send_email_notification(subject, message, recipient_emails=None):
    """Send email notification to one or more recipients"""
    try:
        recipients = recipient_emails or settings.NOTIFICATION_EMAIL_TO

        # Ensure recipients is a list
        if isinstance(recipients, str):
            recipients = [recipients]

        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.warning("Email credentials not configured. Skipping email notification.")
            return False

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )
        logger.info(f"Email sent successfully to {recipients}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False


def send_room_booking_notification(booking):
    """Send email notification for room booking"""
    message = format_room_booking_message(booking)
    subject = f"New Room Booking #{booking.id} - {booking.full_name}"

    result = send_email_notification(subject, message)
    return {'email': result}


def send_event_booking_notification(booking):
    """Send email notification for event booking"""
    message = format_event_booking_message(booking)
    subject = f"New Event Booking #{booking.id} - {booking.full_name}"

    result = send_email_notification(subject, message)
    return {'email': result}


def format_room_confirmation_email(booking):
    """Format confirmation email for room booking"""
    return f"""
Dear {booking.full_name},

🎉 BOOKING CONFIRMED! 🎉

We are delighted to confirm your room reservation at Silvermoon Park.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Booking ID: #{booking.id}
   Check-in Date: {booking.check_in}
   Check-out Date: {booking.check_out}
   Number of Rooms: {booking.num_rooms}
   Number of Guests: {booking.guests} Adults, {booking.children} Children

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 VENUE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Silvermoon Park
   Address: Your venue address here
   Contact: +91 XXXXXXXXXX
   Email: silvermoonpark7@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ CHECK-IN / CHECK-OUT TIMES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Check-in: 2:00 PM onwards
   Check-out: 11:00 AM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please bring a valid ID proof at the time of check-in.

If you have any questions or need to make changes to your reservation,
please contact us at silvermoonpark7@gmail.com

We look forward to welcoming you!

Warm regards,
Team Silvermoon Park
""".strip()


def format_event_confirmation_email(booking):
    """Format confirmation email for event booking"""
    return f"""
Dear {booking.full_name},

🎉 EVENT BOOKING CONFIRMED! 🎉

We are thrilled to confirm your event booking at Silvermoon Park.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Booking ID: #{booking.id}
   Event Type: {booking.get_event_type_display()}
   Event Date: {booking.event_date}
   Expected Guests: {booking.expected_guests}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 VENUE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Silvermoon Park
   Address: Your venue address here
   Contact: +91 XXXXXXXXXX
   Email: silvermoonpark7@gmail.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Our team will contact you shortly to discuss the event details
and arrangements.

If you have any questions or need to make changes to your booking,
please contact us at silvermoonpark7@gmail.com

We look forward to hosting your special event!

Warm regards,
Team Silvermoon Park
""".strip()


def send_booking_confirmation_email(booking, booking_type):
    """Send confirmation email to customer"""
    if booking_type == 'room':
        message = format_room_confirmation_email(booking)
        subject = f"✅ Booking Confirmed - Silvermoon Park (#{booking.id})"
    else:
        message = format_event_confirmation_email(booking)
        subject = f"✅ Event Booking Confirmed - Silvermoon Park (#{booking.id})"

    # Send to customer's email
    return send_email_notification(subject, message, [booking.email])
