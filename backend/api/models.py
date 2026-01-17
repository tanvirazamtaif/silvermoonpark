from django.db import models


class RoomBooking(models.Model):
    ROOM_CHOICES = [
        ('cottage', 'Cottage'),
        ('suite', 'Suite'),
        ('deluxe', 'Deluxe'),
        ('family', 'Family'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    booking_id = models.CharField(max_length=11, unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    check_in = models.DateField()
    check_out = models.DateField()
    room_type = models.CharField(max_length=20, choices=ROOM_CHOICES, blank=True, null=True)
    guests = models.PositiveIntegerField()
    children = models.PositiveIntegerField(default=0)
    num_rooms = models.PositiveIntegerField(default=1)
    # Room type breakdown for multiple rooms
    cottage_count = models.PositiveIntegerField(default=0)
    suite_count = models.PositiveIntegerField(default=0)
    deluxe_count = models.PositiveIntegerField(default=0)
    family_count = models.PositiveIntegerField(default=0)
    special_requests = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_by_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.booking_id:
            # Get the last booking_id for rooms
            last_booking = RoomBooking.objects.exclude(booking_id__isnull=True).order_by('-booking_id').first()
            if last_booking and last_booking.booking_id:
                # Extract number and increment
                last_num = int(last_booking.booking_id[1:])
                new_num = last_num + 1
            else:
                new_num = 1
            self.booking_id = f'R{new_num:010d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_id} - {self.full_name} - {self.room_type} ({self.check_in} to {self.check_out})"


class EventBooking(models.Model):
    EVENT_CHOICES = [
        ('wedding', 'Wedding'),
        ('corporate', 'Corporate'),
        ('birthday', 'Birthday'),
        ('others', 'Others'),
    ]

    BUDGET_CHOICES = [
        ('below_50k', 'Below ₹50,000'),
        ('50k_100k', '₹50,000 - ₹1,00,000'),
        ('100k_200k', '₹1,00,000 - ₹2,00,000'),
        ('above_200k', 'Above ₹2,00,000'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    booking_id = models.CharField(max_length=11, unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    event_date = models.DateField()
    event_type = models.CharField(max_length=20, choices=EVENT_CHOICES)
    expected_guests = models.PositiveIntegerField()
    budget_range = models.CharField(max_length=20, choices=BUDGET_CHOICES)
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_by_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.booking_id:
            # Get the last booking_id for events
            last_booking = EventBooking.objects.exclude(booking_id__isnull=True).order_by('-booking_id').first()
            if last_booking and last_booking.booking_id:
                # Extract number and increment
                last_num = int(last_booking.booking_id[1:])
                new_num = last_num + 1
            else:
                new_num = 1
            self.booking_id = f'E{new_num:010d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_id} - {self.full_name} - {self.event_type} on {self.event_date}"


class SiteContent(models.Model):
    """Stores website content that can be edited from admin panel"""

    # Hero Section
    slide1_title = models.CharField(max_length=200, default='Welcome to Silvermoon Park')
    slide1_subtitle = models.CharField(max_length=300, default='Where Luxury Meets Tranquility')
    slide2_title = models.CharField(max_length=200, default='Unforgettable Experiences')
    slide2_subtitle = models.CharField(max_length=300, default='Create Memories That Last Forever')
    slide3_title = models.CharField(max_length=200, default='Premium Accommodations')
    slide3_subtitle = models.CharField(max_length=300, default='Comfort & Elegance in Every Detail')

    # Contact Info
    phone = models.CharField(max_length=50, default='+91 98765 43210')
    email = models.EmailField(default='info@silvermoonpark.com')
    address = models.TextField(default='Silvermoon Park Resort, Nature Valley, India')
    map_link = models.TextField(default='https://maps.google.com', blank=True)

    # Social Links
    facebook = models.URLField(max_length=300, blank=True, default='https://facebook.com/silvermoonpark')
    instagram = models.URLField(max_length=300, blank=True, default='https://instagram.com/silvermoonpark')
    twitter = models.URLField(max_length=300, blank=True, default='https://twitter.com/silvermoonpark')

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site Content'
        verbose_name_plural = 'Site Content'

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_content(cls):
        """Get or create the singleton instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site Content"


class GalleryImage(models.Model):
    """Stores gallery images that can be edited from admin panel"""
    title = models.CharField(max_length=200, default='Silvermoon Resort View')
    image_url = models.TextField(help_text='Image URL or path (e.g., /gallery-1.jpg)')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)  # Soft delete for recycle bin
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.title} (Order: {self.order})"


class ExploreCard(models.Model):
    """Stores explore/feature cards that can be edited from admin panel"""
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300)
    full_description = models.TextField(blank=True, default='')
    image_url = models.TextField(help_text='Image URL or path')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)  # Soft delete for recycle bin
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.title} (Order: {self.order})"


class HeroSlide(models.Model):
    """Stores hero slideshow slides that can be edited from admin panel"""
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300)
    image_url = models.TextField(help_text='Background image URL or path')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)  # Soft delete for recycle bin
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.title} (Order: {self.order})"
