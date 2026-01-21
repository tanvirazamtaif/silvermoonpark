from django.core.management.base import BaseCommand
from api.models import GalleryImage, ExploreCard, HeroSlide


class Command(BaseCommand):
    help = 'Seeds the production database with initial data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding production database...')

        # Seed Hero Slides
        self.seed_hero_slides()

        # Seed Gallery Images
        self.seed_gallery_images()

        # Seed Explore Cards
        self.seed_explore_cards()

        self.stdout.write(self.style.SUCCESS('Production database seeded successfully!'))

    def seed_hero_slides(self):
        hero_slides = [
            {
                'title': 'Welcome to Silvermoon Park',
                'subtitle': 'Experience luxury and tranquility in the heart of nature',
                'image_url': '/hero-1.jpg',
                'order': 1,
            },
            {
                'title': 'Unforgettable Moments',
                'subtitle': 'Create memories that last a lifetime',
                'image_url': '/hero-2.jpg',
                'order': 2,
            },
            {
                'title': 'Nature\'s Paradise',
                'subtitle': 'Escape to serenity surrounded by natural beauty',
                'image_url': '/hero-3.jpg',
                'order': 3,
            },
        ]

        for slide_data in hero_slides:
            slide, created = HeroSlide.objects.get_or_create(
                image_url=slide_data['image_url'],
                defaults=slide_data
            )
            if created:
                self.stdout.write(f'  Created hero slide: {slide.title}')
            else:
                self.stdout.write(f'  Hero slide already exists: {slide.title}')

    def seed_gallery_images(self):
        gallery_images = [
            {'title': 'Resort View 1', 'image_url': '/WhatsApp Image 2026-01-14 at 5.37.32 PM.jpeg', 'order': 1},
            {'title': 'Resort View 2', 'image_url': '/WhatsApp Image 2026-01-14 at 5.37.33 PM.jpeg', 'order': 2},
            {'title': 'Resort View 3', 'image_url': '/WhatsApp Image 2026-01-14 at 5.37.39 PM.jpeg', 'order': 3},
            {'title': 'Resort View 4', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.12 PM.jpeg', 'order': 4},
            {'title': 'Resort View 5', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.14 PM.jpeg', 'order': 5},
            {'title': 'Resort View 6', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.16 PM.jpeg', 'order': 6},
            {'title': 'Resort View 7', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.23 PM.jpeg', 'order': 7},
            {'title': 'Resort View 8', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.27 PM.jpeg', 'order': 8},
            {'title': 'Resort View 9', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.35 PM.jpeg', 'order': 9},
            {'title': 'Resort View 10', 'image_url': '/WhatsApp Image 2026-01-14 at 5.38.36 PM.jpeg', 'order': 10},
            {'title': 'Resort View 11', 'image_url': '/WhatsApp Image 2026-01-16 at 12.22.11 AM.jpeg', 'order': 11},
            {'title': 'Resort View 12', 'image_url': '/WhatsApp Image 2026-01-16 at 12.22.12 AM.jpeg', 'order': 12},
        ]

        for img_data in gallery_images:
            img, created = GalleryImage.objects.get_or_create(
                image_url=img_data['image_url'],
                defaults=img_data
            )
            if created:
                self.stdout.write(f'  Created gallery image: {img.title}')
            else:
                self.stdout.write(f'  Gallery image already exists: {img.title}')

    def seed_explore_cards(self):
        explore_cards = [
            {
                'title': 'Luxury Cottages',
                'short_description': 'Experience comfort in our beautifully designed cottages surrounded by nature.',
                'image_url': '/WhatsApp Image 2026-01-14 at 5.37.32 PM.jpeg',
                'order': 1,
            },
            {
                'title': 'Swimming Pool',
                'short_description': 'Relax and refresh in our pristine swimming pool with scenic views.',
                'image_url': '/WhatsApp Image 2026-01-14 at 5.37.33 PM.jpeg',
                'order': 2,
            },
            {
                'title': 'Restaurant',
                'short_description': 'Savor delicious cuisine at our on-site restaurant serving local and international dishes.',
                'image_url': '/WhatsApp Image 2026-01-14 at 5.37.39 PM.jpeg',
                'order': 3,
            },
            {
                'title': 'Event Venue',
                'short_description': 'Host your special events in our elegant venue with professional services.',
                'image_url': '/WhatsApp Image 2026-01-14 at 5.38.12 PM.jpeg',
                'order': 4,
            },
        ]

        for card_data in explore_cards:
            card, created = ExploreCard.objects.get_or_create(
                title=card_data['title'],
                defaults=card_data
            )
            if created:
                self.stdout.write(f'  Created explore card: {card.title}')
            else:
                self.stdout.write(f'  Explore card already exists: {card.title}')
