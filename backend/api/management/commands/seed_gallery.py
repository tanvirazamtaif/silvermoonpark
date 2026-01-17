from django.core.management.base import BaseCommand
from api.models import GalleryImage


class Command(BaseCommand):
    help = 'Seeds the gallery with the 12 existing images from frontend/public folder'

    def handle(self, *args, **options):
        # The 12 gallery images from frontend/public folder in order
        gallery_images = [
            {'title': 'Silvermoon Resort View 1', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.37.32%20PM.jpeg', 'order': 1},
            {'title': 'Silvermoon Resort View 2', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.37.33%20PM.jpeg', 'order': 2},
            {'title': 'Silvermoon Resort View 3', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.37.39%20PM.jpeg', 'order': 3},
            {'title': 'Silvermoon Resort View 4', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.12%20PM.jpeg', 'order': 4},
            {'title': 'Silvermoon Resort View 5', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.14%20PM.jpeg', 'order': 5},
            {'title': 'Silvermoon Resort View 6', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.16%20PM.jpeg', 'order': 6},
            {'title': 'Silvermoon Resort View 7', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.23%20PM.jpeg', 'order': 7},
            {'title': 'Silvermoon Resort View 8', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.27%20PM.jpeg', 'order': 8},
            {'title': 'Silvermoon Resort View 9', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.35%20PM.jpeg', 'order': 9},
            {'title': 'Silvermoon Resort View 10', 'image_url': '/WhatsApp%20Image%202026-01-14%20at%205.38.36%20PM.jpeg', 'order': 10},
            {'title': 'Silvermoon Resort View 11', 'image_url': '/WhatsApp%20Image%202026-01-16%20at%2012.22.11%20AM.jpeg', 'order': 11},
            {'title': 'Silvermoon Resort View 12', 'image_url': '/WhatsApp%20Image%202026-01-16%20at%2012.22.12%20AM.jpeg', 'order': 12},
        ]

        created_count = 0
        for img_data in gallery_images:
            obj, created = GalleryImage.objects.get_or_create(
                image_url=img_data['image_url'],
                defaults={
                    'title': img_data['title'],
                    'order': img_data['order'],
                    'is_active': True
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f"Created: {img_data['title']}")
            else:
                self.stdout.write(f"Already exists: {img_data['title']}")

        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully seeded {created_count} gallery images!'))
