from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomBookingViewSet, EventBookingViewSet, SiteContentView, GalleryImageViewSet, ExploreCardViewSet, HeroSlideViewSet

router = DefaultRouter()
router.register(r'bookings/rooms', RoomBookingViewSet, basename='room-booking')
router.register(r'bookings/events', EventBookingViewSet, basename='event-booking')
router.register(r'gallery', GalleryImageViewSet, basename='gallery')
router.register(r'explore-cards', ExploreCardViewSet, basename='explore-cards')
router.register(r'hero-slides', HeroSlideViewSet, basename='hero-slides')

urlpatterns = [
    path('', include(router.urls)),
    path('site-content/', SiteContentView.as_view(), name='site-content'),
]
