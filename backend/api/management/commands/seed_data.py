from django.core.management.base import BaseCommand
from api.models import SiteContent, ImpactStat, Project, ClothesDonation, Volunteer, DonationRecord, ContactInquiry

class Command(BaseCommand):
    help = 'Seeds initial demo and live database records for Genzicon Foundation'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Genzicon Foundation initial data...")

        # 1. Site Content
        site_content, created = SiteContent.objects.get_or_create(
            id=1,
            defaults={
                'hero_title': "Grassroots Youth-Led Transformation Across Nepal",
                'hero_title_np': "नेपालभर युवा नेतृत्वमा प्रत्यक्ष सामाजिक रूपान्तरण",
                'hero_subtitle': "Bridging immediate community needs through civic transparency, verified ground impact, youth volunteer taskforces, and zero administrative waste.",
                'hero_subtitle_np': "पारदर्शी सेवा, प्रमाणित प्रभाव, युवा स्वयंसेवक परिचालन र प्रत्यक्ष सहयोग मार्फत समुदाय सशक्तिकरण।",
                'hero_image_url': "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600",
                'hero_banner_tag': "Grassroots Youth NGO",
                'hero_banner_tag_np': "युवा नेतृत्व गैरसरकारी संस्था",
            }
        )

        # 2. Impact Stats
        stats_data = [
            {'stat_id': 'beneficiaries', 'number': '12,500+', 'label': 'Lives Touched', 'label_np': 'प्रत्यक्ष लाभान्वित', 'order': 1},
            {'stat_id': 'clothes', 'number': '8,400+', 'label': 'Clothes Distributed', 'label_np': 'कपडा वितरण', 'order': 2},
            {'stat_id': 'districts', 'number': '14', 'label': 'Districts Covered', 'label_np': 'जिल्लाहरूमा विस्तार', 'order': 3},
            {'stat_id': 'volunteers', 'number': '350+', 'label': 'Active Youth Volunteers', 'label_np': 'सक्रिय युवा स्वयंसेवक', 'order': 4},
        ]
        for item in stats_data:
            ImpactStat.objects.update_or_create(stat_id=item['stat_id'], defaults=item)

        # 3. Initial Projects
        projects = [
            {
                'title': "Winter Warmth Drive 2026",
                'title_np': "जाडोमा न्यानो अभियान २०८२/८३",
                'category': "Clothes Bank",
                'district': "Siraha",
                'province': "Madhesh Province",
                'status': "Urgent",
                'target_amount': 250000,
                'raised_amount': 185000,
                'beneficiaries_count': "1,200 Families",
                'image_url': "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
                'description': "Distributing heavy thermal blankets, jackets, and winter clothing to vulnerable Musahar and Dalit families facing extreme cold waves in rural Siraha.",
                'description_np': "तराईको शितलहरबाट प्रभावित मुसहर तथा विपन्न परिवारलाई न्यानो कपडा, कम्बल तथा ज्याकेट वितरण।",
                'is_featured': True
            },
            {
                'title': "Rural School Stationery & Bag Support",
                'title_np': "ग्रामीण विद्यालय शैक्षिक सामग्री सहयोग",
                'category': "Education",
                'district': "Ramechhap",
                'province': "Bagmati Province",
                'status': "Active",
                'target_amount': 180000,
                'raised_amount': 95000,
                'beneficiaries_count': "450 Students",
                'image_url': "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
                'description': "Providing school backpacks, notebooks, pens, and hygiene kits for primary school children in remote hills.",
                'description_np': "दुर्गम क्षेत्रका बालबालिकालाई झोला, कापी, कलम तथा शैक्षिक सामग्री उपलब्ध गराउने।",
                'is_featured': True
            }
        ]
        for proj in projects:
            Project.objects.get_or_create(title=proj['title'], defaults=proj)

        # 4. Clothes Sample
        ClothesDonation.objects.get_or_create(
            ref_id="CB-2026-001",
            defaults={
                'donor_name': "Rohan Shrestha",
                'phone': "9841234567",
                'email': "rohan@gmail.com",
                'province': "Bagmati Province",
                'district': "Kathmandu",
                'city': "Baneshwor",
                'address': "Near Eyeplex Mall, Ward 10",
                'clothes_type': "Warm Winter Jackets & Sweaters",
                'approx_items_count': 18,
                'donation_mode': "doorstep_pickup",
                'status': "Scheduled"
            }
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Genzicon Foundation initial data!"))
