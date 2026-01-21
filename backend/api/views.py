from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from rest_framework.views import APIView
from django.db import models
from django.core.management import call_command
from io import StringIO
from .models import RoomBooking, EventBooking, SiteContent, GalleryImage, ExploreCard, HeroSlide
from .serializers import RoomBookingSerializer, EventBookingSerializer, SiteContentSerializer, GalleryImageSerializer, ExploreCardSerializer, HeroSlideSerializer
from .notifications import send_room_booking_notification, send_event_booking_notification, send_booking_confirmation_email
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
def seed_database(request):
    """Trigger database seeding via API call"""
    try:
        out = StringIO()
        call_command('seed_production', stdout=out)
        output = out.getvalue()
        return Response({
            'success': True,
            'message': 'Database seeded successfully',
            'output': output
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Seed database error: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RoomBookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Room Booking operations
    """
    queryset = RoomBooking.objects.all()
    serializer_class = RoomBookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            booking = serializer.save()

            # Send email notification (skip in production free tier to avoid timeout)
            # try:
            #     notification_results = send_room_booking_notification(booking)
            #     logger.info(f"Room booking #{booking.id} notifications sent: {notification_results}")
            # except Exception as e:
            #     logger.error(f"Failed to send notifications for room booking #{booking.id}: {str(e)}")
            logger.info(f"Room booking #{booking.id} created successfully")

            return Response({
                'id': booking.id,
                'status': booking.status,
                'created_at': booking.created_at,
                'message': f'Thank you, {booking.full_name}! Your room booking request has been received. We will contact you shortly. For any queries, email us at silvermoonpark7@gmail.com'
            }, status=status.HTTP_201_CREATED)

        return Response({
            'errors': serializer.errors,
            'message': 'Please correct the errors and try again.'
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a room booking and send confirmation email to customer"""
        try:
            booking = self.get_object()
            booking.status = 'confirmed'
            booking.save()

            # Send confirmation email to customer (disabled for free tier to avoid timeout)
            # try:
            #     send_booking_confirmation_email(booking, 'room')
            #     logger.info(f"Confirmation email sent for room booking #{booking.id}")
            # except Exception as e:
            #     logger.error(f"Failed to send confirmation email for room booking #{booking.id}: {str(e)}")
            logger.info(f"Room booking #{booking.id} confirmed successfully")

            return Response({
                'id': booking.id,
                'status': booking.status,
                'message': f'Booking #{booking.id} has been confirmed.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to confirm booking'
            }, status=status.HTTP_400_BAD_REQUEST)


class EventBookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Event Booking operations
    """
    queryset = EventBooking.objects.all()
    serializer_class = EventBookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            booking = serializer.save()

            # Send email notification (skip in production free tier to avoid timeout)
            # try:
            #     notification_results = send_event_booking_notification(booking)
            #     logger.info(f"Event booking #{booking.id} notifications sent: {notification_results}")
            # except Exception as e:
            #     logger.error(f"Failed to send notifications for event booking #{booking.id}: {str(e)}")
            logger.info(f"Event booking #{booking.id} created successfully")

            return Response({
                'id': booking.id,
                'status': booking.status,
                'created_at': booking.created_at,
                'message': f'Thank you, {booking.full_name}! Your event booking request has been received. We will contact you shortly. For any queries, email us at silvermoonpark7@gmail.com'
            }, status=status.HTTP_201_CREATED)

        return Response({
            'errors': serializer.errors,
            'message': 'Please correct the errors and try again.'
        }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an event booking and send confirmation email to customer"""
        try:
            booking = self.get_object()
            booking.status = 'confirmed'
            booking.save()

            # Send confirmation email to customer (disabled for free tier to avoid timeout)
            # try:
            #     send_booking_confirmation_email(booking, 'event')
            #     logger.info(f"Confirmation email sent for event booking #{booking.id}")
            # except Exception as e:
            #     logger.error(f"Failed to send confirmation email for event booking #{booking.id}: {str(e)}")
            logger.info(f"Event booking #{booking.id} confirmed successfully")

            return Response({
                'id': booking.id,
                'status': booking.status,
                'message': f'Booking #{booking.id} has been confirmed.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e),
                'message': 'Failed to confirm booking'
            }, status=status.HTTP_400_BAD_REQUEST)


class SiteContentView(APIView):
    """
    API View for Site Content - GET and PUT only (singleton)
    """

    def get(self, request):
        """Get site content"""
        content = SiteContent.get_content()
        serializer = SiteContentSerializer(content)
        return Response(serializer.data)

    def put(self, request):
        """Update site content"""
        content = SiteContent.get_content()
        serializer = SiteContentSerializer(content, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'data': serializer.data,
                'message': 'Site content updated successfully!'
            })

        return Response({
            'errors': serializer.errors,
            'message': 'Failed to update site content.'
        }, status=status.HTTP_400_BAD_REQUEST)


class GalleryImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Gallery Images - CRUD operations with soft delete
    """
    queryset = GalleryImage.objects.filter(is_active=True, is_deleted=False)
    serializer_class = GalleryImageSerializer

    def get_queryset(self):
        # Check if requesting deleted (recycle bin) images
        if self.request.query_params.get('deleted') == 'true':
            return GalleryImage.objects.filter(is_deleted=True).order_by('-deleted_at')
        # For admin, show all non-deleted images; for public, only active non-deleted ones
        if self.request.query_params.get('all') == 'true':
            return GalleryImage.objects.filter(is_deleted=False)
        return GalleryImage.objects.filter(is_active=True, is_deleted=False)

    def destroy(self, request, *args, **kwargs):
        """Soft delete - move to recycle bin instead of permanent delete"""
        from django.utils import timezone
        instance = self.get_object()
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        return Response({'message': 'Image moved to recycle bin'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore image from recycle bin - creates a new entry with latest ID"""
        try:
            # Get the deleted image
            deleted_image = GalleryImage.objects.get(pk=pk, is_deleted=True)

            # Get the highest current order
            max_order = GalleryImage.objects.filter(is_deleted=False).aggregate(
                max_order=models.Max('order')
            )['max_order'] or 0

            # Create a new image with the same data but new ID and order at end
            new_image = GalleryImage.objects.create(
                title=deleted_image.title,
                image_url=deleted_image.image_url,
                order=max_order + 1,
                is_active=True,
                is_deleted=False
            )

            # Permanently delete the old record
            deleted_image.delete()

            serializer = self.get_serializer(new_image)
            return Response({
                'message': 'Image restored successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except GalleryImage.DoesNotExist:
            return Response({'error': 'Image not found in recycle bin'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'])
    def permanent_delete(self, request, pk=None):
        """Permanently delete image from recycle bin"""
        try:
            deleted_image = GalleryImage.objects.get(pk=pk, is_deleted=True)
            deleted_image.delete()
            return Response({'message': 'Image permanently deleted'}, status=status.HTTP_200_OK)
        except GalleryImage.DoesNotExist:
            return Response({'error': 'Image not found in recycle bin'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload an image file and return its URL"""
        import os
        import uuid
        from django.conf import settings
        from rest_framework.parsers import MultiPartParser, FormParser

        try:
            if 'image' not in request.FILES:
                return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

            image_file = request.FILES['image']

            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if image_file.content_type not in allowed_types:
                return Response({'error': 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (max 5MB)
            if image_file.size > 5 * 1024 * 1024:
                return Response({'error': 'File size exceeds 5MB limit'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate unique filename
            ext = os.path.splitext(image_file.name)[1].lower()
            if not ext:
                ext = '.jpg'  # Default extension
            unique_filename = f"gallery_{uuid.uuid4().hex}{ext}"

            # Create uploads directory - use absolute path for Windows compatibility
            base_dir = str(settings.BASE_DIR)
            upload_dir = os.path.normpath(os.path.join(base_dir, '..', 'frontend', 'public', 'uploads', 'gallery'))
            os.makedirs(upload_dir, exist_ok=True)

            # Save the file
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)

            # Return the URL path
            image_url = f"/uploads/gallery/{unique_filename}"
            return Response({'image_url': image_url, 'message': 'Image uploaded successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error uploading image: {str(e)}")
            return Response({'error': f'Upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ExploreCardViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Explore Cards - CRUD operations with soft delete
    """
    queryset = ExploreCard.objects.filter(is_active=True, is_deleted=False)
    serializer_class = ExploreCardSerializer

    def get_queryset(self):
        # Check if requesting deleted (recycle bin) cards
        if self.request.query_params.get('deleted') == 'true':
            return ExploreCard.objects.filter(is_deleted=True).order_by('-deleted_at')
        # For admin, show all non-deleted cards; for public, only active non-deleted ones
        if self.request.query_params.get('all') == 'true':
            return ExploreCard.objects.filter(is_deleted=False).order_by('order', 'id')
        return ExploreCard.objects.filter(is_active=True, is_deleted=False).order_by('order', 'id')

    def destroy(self, request, *args, **kwargs):
        """Soft delete - move to recycle bin instead of permanent delete"""
        from django.utils import timezone
        instance = self.get_object()
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        return Response({'message': 'Card moved to recycle bin'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore card from recycle bin - creates a new entry with latest ID"""
        try:
            # Get the deleted card
            deleted_card = ExploreCard.objects.get(pk=pk, is_deleted=True)

            # Get the highest current order
            max_order = ExploreCard.objects.filter(is_deleted=False).aggregate(
                max_order=models.Max('order')
            )['max_order'] or 0

            # Create a new card with the same data but new ID and order at end
            new_card = ExploreCard.objects.create(
                title=deleted_card.title,
                short_description=deleted_card.short_description,
                full_description=deleted_card.full_description,
                image_url=deleted_card.image_url,
                order=max_order + 1,
                is_active=True,
                is_deleted=False
            )

            # Permanently delete the old record
            deleted_card.delete()

            serializer = self.get_serializer(new_card)
            return Response({
                'message': 'Card restored successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except ExploreCard.DoesNotExist:
            return Response({'error': 'Card not found in recycle bin'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'])
    def permanent_delete(self, request, pk=None):
        """Permanently delete card from recycle bin"""
        try:
            deleted_card = ExploreCard.objects.get(pk=pk, is_deleted=True)
            deleted_card.delete()
            return Response({'message': 'Card permanently deleted'}, status=status.HTTP_200_OK)
        except ExploreCard.DoesNotExist:
            return Response({'error': 'Card not found in recycle bin'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload an image file and return its URL"""
        import os
        import uuid
        from django.conf import settings

        try:
            if 'image' not in request.FILES:
                return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

            image_file = request.FILES['image']

            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if image_file.content_type not in allowed_types:
                return Response({'error': 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (max 5MB)
            if image_file.size > 5 * 1024 * 1024:
                return Response({'error': 'File size exceeds 5MB limit'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate unique filename
            ext = os.path.splitext(image_file.name)[1].lower()
            if not ext:
                ext = '.jpg'  # Default extension
            unique_filename = f"explore_{uuid.uuid4().hex}{ext}"

            # Create uploads directory - use absolute path for Windows compatibility
            base_dir = str(settings.BASE_DIR)
            upload_dir = os.path.normpath(os.path.join(base_dir, '..', 'frontend', 'public', 'uploads', 'explore'))
            os.makedirs(upload_dir, exist_ok=True)

            # Save the file
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)

            # Return the URL path
            image_url = f"/uploads/explore/{unique_filename}"
            return Response({'image_url': image_url, 'message': 'Image uploaded successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error uploading explore image: {str(e)}")
            return Response({'error': f'Upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HeroSlideViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Hero Slides - CRUD operations with soft delete
    """
    queryset = HeroSlide.objects.filter(is_active=True, is_deleted=False)
    serializer_class = HeroSlideSerializer

    def get_queryset(self):
        # Check if requesting deleted (recycle bin) slides
        if self.request.query_params.get('deleted') == 'true':
            return HeroSlide.objects.filter(is_deleted=True).order_by('-deleted_at')
        # For admin, show all non-deleted slides; for public, only active non-deleted ones
        if self.request.query_params.get('all') == 'true':
            return HeroSlide.objects.filter(is_deleted=False).order_by('order', 'id')
        return HeroSlide.objects.filter(is_active=True, is_deleted=False).order_by('order', 'id')

    def destroy(self, request, *args, **kwargs):
        """Soft delete - move to recycle bin instead of permanent delete"""
        from django.utils import timezone
        instance = self.get_object()
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        return Response({'message': 'Slide moved to recycle bin'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def restore(self, request, pk=None):
        """Restore slide from recycle bin"""
        try:
            deleted_slide = HeroSlide.objects.get(pk=pk, is_deleted=True)

            # Get the highest current order
            max_order = HeroSlide.objects.filter(is_deleted=False).aggregate(
                max_order=models.Max('order')
            )['max_order'] or 0

            # Create a new slide with the same data but new ID
            new_slide = HeroSlide.objects.create(
                title=deleted_slide.title,
                subtitle=deleted_slide.subtitle,
                image_url=deleted_slide.image_url,
                order=max_order + 1,
                is_active=True,
                is_deleted=False
            )

            # Permanently delete the old record
            deleted_slide.delete()

            serializer = self.get_serializer(new_slide)
            return Response({
                'message': 'Slide restored successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        except HeroSlide.DoesNotExist:
            return Response({'error': 'Slide not found in recycle bin'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'])
    def permanent_delete(self, request, pk=None):
        """Permanently delete slide from recycle bin"""
        try:
            deleted_slide = HeroSlide.objects.get(pk=pk, is_deleted=True)
            deleted_slide.delete()
            return Response({'message': 'Slide permanently deleted'}, status=status.HTTP_200_OK)
        except HeroSlide.DoesNotExist:
            return Response({'error': 'Slide not found in recycle bin'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def upload(self, request):
        """Upload an image file and return its URL"""
        import os
        import uuid
        from django.conf import settings

        try:
            if 'image' not in request.FILES:
                return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

            image_file = request.FILES['image']

            # Validate file type
            allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if image_file.content_type not in allowed_types:
                return Response({'error': 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP'}, status=status.HTTP_400_BAD_REQUEST)

            # Validate file size (max 5MB)
            if image_file.size > 5 * 1024 * 1024:
                return Response({'error': 'File size exceeds 5MB limit'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate unique filename
            ext = os.path.splitext(image_file.name)[1].lower()
            if not ext:
                ext = '.jpg'
            unique_filename = f"hero_{uuid.uuid4().hex}{ext}"

            # Create uploads directory
            base_dir = str(settings.BASE_DIR)
            upload_dir = os.path.normpath(os.path.join(base_dir, '..', 'frontend', 'public', 'uploads', 'hero'))
            os.makedirs(upload_dir, exist_ok=True)

            # Save the file
            file_path = os.path.join(upload_dir, unique_filename)
            with open(file_path, 'wb+') as destination:
                for chunk in image_file.chunks():
                    destination.write(chunk)

            # Return the URL path
            image_url = f"/uploads/hero/{unique_filename}"
            return Response({'image_url': image_url, 'message': 'Image uploaded successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error uploading hero image: {str(e)}")
            return Response({'error': f'Upload failed: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
