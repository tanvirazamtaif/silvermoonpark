from rest_framework import serializers
from .models import RoomBooking, EventBooking, SiteContent, GalleryImage, ExploreCard, HeroSlide
from datetime import date


class RoomBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooking
        fields = ['id', 'booking_id', 'full_name', 'phone', 'email', 'check_in', 'check_out',
                  'room_type', 'guests', 'children', 'num_rooms', 'cottage_count', 'suite_count',
                  'deluxe_count', 'family_count', 'special_requests', 'status', 'booked_by_admin', 'created_at']
        read_only_fields = ['id', 'booking_id', 'created_at']

    def validate(self, data):
        """
        Validate that check_out is after check_in and dates are not in the past
        Also validate room type breakdown for multiple rooms
        """
        check_in = data.get('check_in')
        check_out = data.get('check_out')

        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError({
                    'check_out': 'Check-out date must be after check-in date.'
                })

        if check_in and check_in < date.today():
            raise serializers.ValidationError({
                'check_in': 'Check-in date cannot be in the past.'
            })

        # For multiple rooms, validate that room type counts equal total rooms
        num_rooms = data.get('num_rooms', 1)
        if num_rooms > 1:
            cottage = data.get('cottage_count', 0)
            suite = data.get('suite_count', 0)
            deluxe = data.get('deluxe_count', 0)
            family = data.get('family_count', 0)
            total = cottage + suite + deluxe + family
            if total != num_rooms:
                raise serializers.ValidationError({
                    'num_rooms': f'Room type breakdown ({total}) must equal total rooms ({num_rooms}).'
                })

        return data

    def validate_guests(self, value):
        """Validate number of guests"""
        if value < 1:
            raise serializers.ValidationError('At least 1 guest is required.')
        if value > 20:
            raise serializers.ValidationError('Maximum 20 guests per booking.')
        return value

    def validate_num_rooms(self, value):
        """Validate number of rooms"""
        if value < 1:
            raise serializers.ValidationError('At least 1 room is required.')
        if value > 10:
            raise serializers.ValidationError('Maximum 10 rooms per booking.')
        return value


class EventBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventBooking
        fields = ['id', 'booking_id', 'full_name', 'phone', 'email', 'event_date', 'event_type',
                  'expected_guests', 'budget_range', 'notes', 'status', 'booked_by_admin', 'created_at']
        read_only_fields = ['id', 'booking_id', 'created_at']

    def validate_event_date(self, value):
        """Validate that event date is not in the past"""
        if value < date.today():
            raise serializers.ValidationError('Event date cannot be in the past.')
        return value

    def validate_expected_guests(self, value):
        """Validate number of expected guests"""
        if value < 1:
            raise serializers.ValidationError('At least 1 guest is required.')
        if value > 1000:
            raise serializers.ValidationError('Maximum 1000 guests per event.')
        return value


class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = [
            'slide1_title', 'slide1_subtitle',
            'slide2_title', 'slide2_subtitle',
            'slide3_title', 'slide3_subtitle',
            'phone', 'email', 'address', 'map_link',
            'facebook', 'instagram', 'twitter',
            'updated_at'
        ]
        read_only_fields = ['updated_at']


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'image_url', 'order', 'is_active', 'is_deleted', 'deleted_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'deleted_at']


class ExploreCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExploreCard
        fields = ['id', 'title', 'short_description', 'full_description', 'image_url', 'order', 'is_active', 'is_deleted', 'deleted_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'deleted_at']


class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = ['id', 'title', 'subtitle', 'image_url', 'order', 'is_active', 'is_deleted', 'deleted_at', 'created_at']
        read_only_fields = ['id', 'created_at', 'deleted_at']
