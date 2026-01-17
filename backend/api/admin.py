from django.contrib import admin
from django.utils.html import format_html
from .models import RoomBooking, EventBooking


# Custom Admin Site Configuration
admin.site.site_header = "Silvermoon Park Administration"
admin.site.site_title = "Silvermoon Park Admin"
admin.site.index_title = "Booking Management Dashboard"


@admin.register(RoomBooking)
class RoomBookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id', 'full_name', 'email', 'phone', 'guest_count',
        'room_summary', 'date_range', 'status_badge', 'created_at'
    ]
    list_filter = ['status', 'room_type', 'check_in', 'created_at', 'num_rooms']
    search_fields = ['full_name', 'email', 'phone', 'id']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'booking_summary']
    list_per_page = 20
    date_hierarchy = 'check_in'
    actions = ['mark_confirmed', 'mark_cancelled', 'mark_pending']

    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_summary',),
            'classes': ('wide',),
        }),
        ('Guest Details', {
            'fields': ('full_name', 'email', 'phone'),
            'classes': ('wide',),
        }),
        ('Guest Count', {
            'fields': (('guests', 'children'),),
            'classes': ('wide',),
        }),
        ('Stay Details', {
            'fields': (('check_in', 'check_out'),),
            'classes': ('wide',),
        }),
        ('Room Configuration', {
            'fields': ('num_rooms', 'room_type'),
            'classes': ('wide',),
            'description': 'For single room bookings, room_type is used. For multiple rooms, see breakdown below.',
        }),
        ('Room Type Breakdown (Multiple Rooms)', {
            'fields': (('cottage_count', 'suite_count'), ('deluxe_count', 'family_count')),
            'classes': ('collapse', 'wide'),
            'description': 'Room breakdown for bookings with multiple rooms.',
        }),
        ('Additional Information', {
            'fields': ('special_requests',),
            'classes': ('wide',),
        }),
        ('Status & Timestamps', {
            'fields': ('status', 'created_at'),
            'classes': ('wide',),
        }),
    )

    def booking_id(self, obj):
        return format_html('<strong>#{}</strong>', obj.id)
    booking_id.short_description = 'Booking ID'
    booking_id.admin_order_field = 'id'

    def guest_count(self, obj):
        total = obj.guests + obj.children
        if obj.children > 0:
            return format_html('{} adults, {} children <small>({} total)</small>',
                             obj.guests, obj.children, total)
        return format_html('{} adults', obj.guests)
    guest_count.short_description = 'Guests'

    def room_summary(self, obj):
        if obj.num_rooms == 1:
            room_type = obj.get_room_type_display() or 'Not specified'
            return format_html('<span style="color: #2d5f3f;">{}</span>', room_type)

        parts = []
        if obj.cottage_count > 0:
            parts.append(f'{obj.cottage_count} Cottage')
        if obj.suite_count > 0:
            parts.append(f'{obj.suite_count} Suite')
        if obj.deluxe_count > 0:
            parts.append(f'{obj.deluxe_count} Deluxe')
        if obj.family_count > 0:
            parts.append(f'{obj.family_count} Family')

        return format_html('<span style="color: #2d5f3f;">{} rooms: {}</span>',
                          obj.num_rooms, ', '.join(parts) if parts else 'Not specified')
    room_summary.short_description = 'Rooms'

    def date_range(self, obj):
        nights = (obj.check_out - obj.check_in).days
        return format_html('{} → {} <small>({} nights)</small>',
                          obj.check_in.strftime('%d %b'),
                          obj.check_out.strftime('%d %b %Y'),
                          nights)
    date_range.short_description = 'Stay Period'
    date_range.admin_order_field = 'check_in'

    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'confirmed': '#10b981',
            'cancelled': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 12px; '
            'border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            color, obj.status
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'

    def booking_summary(self, obj):
        nights = (obj.check_out - obj.check_in).days
        total_guests = obj.guests + obj.children

        room_info = ""
        if obj.num_rooms == 1:
            room_info = f"1 {obj.get_room_type_display() or 'Room'}"
        else:
            parts = []
            if obj.cottage_count > 0:
                parts.append(f"{obj.cottage_count} Cottage")
            if obj.suite_count > 0:
                parts.append(f"{obj.suite_count} Suite")
            if obj.deluxe_count > 0:
                parts.append(f"{obj.deluxe_count} Deluxe")
            if obj.family_count > 0:
                parts.append(f"{obj.family_count} Family")
            room_info = f"{obj.num_rooms} Rooms ({', '.join(parts)})"

        return format_html(
            '<div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #2d5f3f;">'
            '<strong style="font-size: 16px;">Booking #{}</strong><br><br>'
            '<strong>Guest:</strong> {} ({} guests)<br>'
            '<strong>Stay:</strong> {} to {} ({} nights)<br>'
            '<strong>Rooms:</strong> {}'
            '</div>',
            obj.id, obj.full_name, total_guests,
            obj.check_in.strftime('%d %b %Y'), obj.check_out.strftime('%d %b %Y'), nights,
            room_info
        )
    booking_summary.short_description = 'Booking Overview'

    @admin.action(description='Mark selected bookings as Confirmed')
    def mark_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} booking(s) marked as confirmed.')

    @admin.action(description='Mark selected bookings as Cancelled')
    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} booking(s) marked as cancelled.')

    @admin.action(description='Mark selected bookings as Pending')
    def mark_pending(self, request, queryset):
        updated = queryset.update(status='pending')
        self.message_user(request, f'{updated} booking(s) marked as pending.')


@admin.register(EventBooking)
class EventBookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_id', 'full_name', 'email', 'phone', 'event_type_badge',
        'event_date', 'expected_guests', 'budget_display', 'status_badge', 'created_at'
    ]
    list_filter = ['status', 'event_type', 'event_date', 'budget_range', 'created_at']
    search_fields = ['full_name', 'email', 'phone', 'id']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'booking_summary']
    list_per_page = 20
    date_hierarchy = 'event_date'
    actions = ['mark_confirmed', 'mark_cancelled', 'mark_pending']

    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_summary',),
            'classes': ('wide',),
        }),
        ('Client Details', {
            'fields': ('full_name', 'email', 'phone'),
            'classes': ('wide',),
        }),
        ('Event Information', {
            'fields': (('event_date', 'event_type'), ('expected_guests', 'budget_range')),
            'classes': ('wide',),
        }),
        ('Additional Notes', {
            'fields': ('notes',),
            'classes': ('wide',),
        }),
        ('Status & Timestamps', {
            'fields': ('status', 'created_at'),
            'classes': ('wide',),
        }),
    )

    def booking_id(self, obj):
        return format_html('<strong>#{}</strong>', obj.id)
    booking_id.short_description = 'Booking ID'
    booking_id.admin_order_field = 'id'

    def event_type_badge(self, obj):
        colors = {
            'wedding': '#ec4899',
            'corporate': '#3b82f6',
            'birthday': '#8b5cf6',
            'others': '#6b7280',
        }
        color = colors.get(obj.event_type, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 12px; '
            'border-radius: 20px; font-size: 11px; font-weight: 600;">{}</span>',
            color, obj.get_event_type_display()
        )
    event_type_badge.short_description = 'Event Type'
    event_type_badge.admin_order_field = 'event_type'

    def budget_display(self, obj):
        return format_html('<span style="color: #2d5f3f; font-weight: 500;">{}</span>',
                          obj.get_budget_range_display())
    budget_display.short_description = 'Budget'
    budget_display.admin_order_field = 'budget_range'

    def status_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'confirmed': '#10b981',
            'cancelled': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 12px; '
            'border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase;">{}</span>',
            color, obj.status
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'

    def booking_summary(self, obj):
        return format_html(
            '<div style="background: #fdf4ff; padding: 15px; border-radius: 8px; border-left: 4px solid #ec4899;">'
            '<strong style="font-size: 16px;">Event Booking #{}</strong><br><br>'
            '<strong>Organizer:</strong> {}<br>'
            '<strong>Event:</strong> {} on {}<br>'
            '<strong>Expected Guests:</strong> {}<br>'
            '<strong>Budget:</strong> {}'
            '</div>',
            obj.id, obj.full_name, obj.get_event_type_display(),
            obj.event_date.strftime('%d %b %Y'), obj.expected_guests,
            obj.get_budget_range_display()
        )
    booking_summary.short_description = 'Booking Overview'

    @admin.action(description='Mark selected bookings as Confirmed')
    def mark_confirmed(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} booking(s) marked as confirmed.')

    @admin.action(description='Mark selected bookings as Cancelled')
    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} booking(s) marked as cancelled.')

    @admin.action(description='Mark selected bookings as Pending')
    def mark_pending(self, request, queryset):
        updated = queryset.update(status='pending')
        self.message_user(request, f'{updated} booking(s) marked as pending.')
