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
                'short_description': 'Cozy cottages with scenic views',
                'full_description': 'Experience ultimate comfort in our luxury cottages featuring private balconies, modern amenities, and breathtaking views of the surrounding nature. Perfect for couples seeking a romantic getaway.',
                'image_url': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
                'order': 1,
            },
            {
                'title': 'Premium Suites',
                'short_description': 'Spacious suites with elegance',
                'full_description': 'Our premium suites offer expansive living spaces with separate bedroom and living areas, luxury bathrooms, and premium furnishings. Ideal for families or guests seeking extra space and comfort.',
                'image_url': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop',
                'order': 2,
            },
            {
                'title': 'Infinity Pool',
                'short_description': 'Stunning pool with mountain views',
                'full_description': 'Dive into luxury at our temperature-controlled infinity pool overlooking the mountains. Complete with poolside cabanas, a swim-up bar, and dedicated lifeguard service for your safety.',
                'image_url': 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop',
                'order': 3,
            },
            {
                'title': 'Fine Dining',
                'short_description': 'Multi-cuisine restaurant',
                'full_description': 'Savor exquisite flavors at our award-winning restaurant featuring international cuisine, local specialties, and an extensive wine collection. Open for breakfast, lunch, and dinner with indoor and outdoor seating.',
                'image_url': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop',
                'order': 4,
            },
            {
                'title': 'BBQ Nights',
                'short_description': 'Outdoor grilling experiences',
                'full_description': 'Enjoy memorable evenings at our outdoor BBQ area with live grilling stations, bonfire seating, and live entertainment. Perfect for group gatherings and special celebrations under the stars.',
                'image_url': 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop',
                'order': 5,
            },
            {
                'title': 'Kids Zone',
                'short_description': 'Fun activities for children',
                'full_description': 'Keep your little ones entertained at our supervised kids zone featuring play equipment, games, creative activities, and trained staff. A safe and fun environment for children of all ages.',
                'image_url': 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=600&h=400&fit=crop',
                'order': 6,
            },
            {
                'title': 'Conference Hall',
                'short_description': 'State-of-the-art meeting spaces',
                'full_description': 'Host successful corporate events in our fully-equipped conference hall with modern AV equipment, high-speed WiFi, flexible seating arrangements, and professional catering services.',
                'image_url': 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
                'order': 7,
            },
            {
                'title': 'Wedding Lawn',
                'short_description': 'Beautiful outdoor venue',
                'full_description': 'Create your dream wedding at our picturesque lawn surrounded by lush gardens. Accommodates up to 500 guests with complete event planning, catering, and decoration services available.',
                'image_url': 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=400&fit=crop',
                'order': 8,
            },
            {
                'title': 'Wellness Spa',
                'short_description': 'Rejuvenating spa treatments',
                'full_description': 'Indulge in ultimate relaxation at our wellness spa offering traditional therapies, aromatherapy, massage treatments, and beauty services. Professional therapists ensure a rejuvenating experience.',
                'image_url': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=400&fit=crop',
                'order': 9,
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
