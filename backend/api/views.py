from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Sum, Count
from .authentication import CsrfExemptSessionAuthentication

from .models import (
    SiteContent, ImpactStat, FilmstripScene, Project, ClothesDonor,
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry, ClothesHubConfig, SiteSettings,
    PaymentConfig, BoardMember
)
from .serializers import (
    SiteContentSerializer, ImpactStatSerializer, FilmstripSceneSerializer, ProjectSerializer, ClothesDonorSerializer,
    ClothesDonationSerializer, VolunteerSerializer, DonationRecordSerializer, ContactInquirySerializer,
    ClothesHubConfigSerializer, SiteSettingsSerializer, PaymentConfigSerializer, BoardMemberSerializer
)

# --- Admin Authentication Endpoint ---
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    """Sign-in endpoint returning token for Admin UI"""
    username = request.data.get('email') or request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user and user.is_staff:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff
            }
        })
    return Response({'error': 'Invalid admin credentials or unauthorized account'}, status=status.HTTP_401_UNAUTHORIZED)


# --- Dashboard Overview Aggregates ---
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def dashboard_overview(request):
    """Aggregate statistics for Admin Dashboard KPIs"""
    total_clothes_pieces = ClothesDonation.objects.aggregate(total=Sum('approx_items_count'))['total'] or 0
    pending_clothes = ClothesDonation.objects.filter(status='Pending').count()
    
    total_volunteers = Volunteer.objects.count()
    pending_volunteers = Volunteer.objects.filter(status='Pending').count()

    verified_donations_sum = DonationRecord.objects.filter(status='Verified').aggregate(total=Sum('amount'))['total'] or 0
    pending_donations = DonationRecord.objects.filter(status='Pending').count()

    active_projects = Project.objects.filter(status='Active').count()
    new_inquiries = ContactInquiry.objects.filter(status='New').count()

    return Response({
        'clothes': {
            'total_pieces': total_clothes_pieces,
            'pending_pickups': pending_clothes,
        },
        'volunteers': {
            'total': total_volunteers,
            'pending': pending_volunteers,
        },
        'donations': {
            'verified_total_npr': float(verified_donations_sum),
            'pending_verification': pending_donations,
        },
        'active_projects': active_projects,
        'new_inquiries': new_inquiries,
    })


# --- Public Site Dynamic Content ---
DEFAULT_IMPACT_STATS = [
    {
        'stat_id': 'clothes',
        'number': '142,500+',
        'label': 'Garments Distributed',
        'label_np': 'संकलित तथा वितरित कपडा',
        'description': 'Wearable clothes collected, sorted, cleaned, and handed over to families in need across Nepal.',
        'description_np': 'नेपालभरिका विपन्न परिवार, बालबालिका तथा वृद्धवृद्धालाई निःशुल्क वितरित उपयोगी कपडा।',
        'color': 'primary',
        'order': 1,
    },
    {
        'stat_id': 'green',
        'number': '86,000+',
        'label': 'Trees & Plants Planted',
        'label_np': 'रोपिएका बिरुवाहरू',
        'description': 'Chure watershed reforestation and community greenery campaigns driven by youth volunteers.',
        'description_np': 'चुरे क्षेत्र तथा नदी किनारमा रोपिएका फलफूल तथा वनस्पति बिरुवा।',
        'color': 'secondary',
        'order': 2,
    },
    {
        'stat_id': 'skills',
        'number': '3,450+',
        'label': 'Women & Youth Empowered',
        'label_np': 'सीप तथा उद्यमशीलता तालिम',
        'description': 'Graduates of sewing, tailoring, handicraft, and digital literacy becoming financially independent.',
        'description_np': 'सिलाई-कटाई, कम्प्युटर र व्यवसाय तालिमबाट आत्मनिर्भर बनेका महिला तथा युवाहरू।',
        'color': 'primary',
        'order': 3,
    },
    {
        'stat_id': 'volunteers',
        'number': '5,800+',
        'label': 'Grassroots Volunteers',
        'label_np': 'सक्रिय स्वयंसेवकहरू',
        'description': 'Passionate youth volunteers organizing clothes collection, tree planting, and vocational camps.',
        'description_np': '७७ वटै जिल्लामा कपडा संकलन, सरसफाइ र तालिममा खटिएका युवाहरू।',
        'color': 'secondary',
        'order': 4,
    }
]

def ensure_default_impact_stats():
    """Ensure standard 4 impact statistics exist in the database"""
    if ImpactStat.objects.count() == 0:
        for item in DEFAULT_IMPACT_STATS:
            ImpactStat.objects.create(
                stat_id=item['stat_id'],
                number=item['number'],
                label=item['label'],
                label_np=item['label_np'],
                description=item['description'],
                description_np=item['description_np'],
                color=item['color'],
                order=item['order']
            )

class SiteContentViewSet(viewsets.ModelViewSet):
    queryset = SiteContent.objects.all().order_by('order', '-created_at')
    serializer_class = SiteContentSerializer

    def get_queryset(self):
        # Admins see all slides in the admin, public requests only get active slides
        if self.request.user and self.request.user.is_staff:
            return SiteContent.objects.all().order_by('order', '-created_at')
        return SiteContent.objects.filter(is_active=True).order_by('order', '-created_at')

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'current']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def current(self, request):
        active_slides = SiteContent.objects.filter(is_active=True).order_by('order', '-created_at')
        if not active_slides.exists():
            active_slides = SiteContent.objects.all().order_by('order', '-created_at')
            if not active_slides.exists():
                SiteContent.objects.create()
                active_slides = SiteContent.objects.all()

        first = active_slides.first()
        serialized_slides = []
        hero_images = []

        for slide in active_slides:
            img_url = slide.hero_image.url if slide.hero_image else (slide.hero_image_url or "https://genzicon.com/media/hero_slides/ChatGPT_Image_Sep_7_2026_10_26_42_PM_xY6nbh0.avif")
            if img_url.startswith('/'):
                built_uri = request.build_absolute_uri(img_url)
                proto = request.META.get('HTTP_X_FORWARDED_PROTO', '')
                if proto == 'https' and built_uri.startswith('http://'):
                    built_uri = 'https://' + built_uri[7:]
                img_url = built_uri
            hero_images.append(img_url)
            serialized_slides.append({
                'id': f"slide-{slide.id}",
                'title': slide.hero_title,
                'titleNp': slide.hero_title_np,
                'subtitle': slide.hero_subtitle,
                'subtitleNp': slide.hero_subtitle_np,
                'tag': slide.hero_banner_tag,
                'tagNp': slide.hero_banner_tag_np,
                'imageUrl': img_url,
            })

        first_img = hero_images[0] if hero_images else (first.hero_image_url or "https://genzicon.com/media/hero_slides/ChatGPT_Image_Sep_7_2026_10_26_42_PM_xY6nbh0.avif")

        # Fetch and serialize 4 static impact cards
        ensure_default_impact_stats()
        impact_stats_qs = ImpactStat.objects.all().order_by('order', 'id')
        serialized_impact_stats = []
        for stat in impact_stats_qs:
            serialized_impact_stats.append({
                'id': stat.stat_id,
                'number': stat.number,
                'label': stat.label,
                'labelNp': stat.label_np,
                'description': stat.description,
                'descriptionNp': stat.description_np,
                'color': stat.color or 'primary',
                'order': stat.order,
            })

        return Response({
            'hero_title': first.hero_title,
            'hero_title_np': first.hero_title_np,
            'hero_subtitle': first.hero_subtitle,
            'hero_subtitle_np': first.hero_subtitle_np,
            'hero_image_url': first_img,
            'hero_banner_tag': first.hero_banner_tag,
            'hero_banner_tag_np': first.hero_banner_tag_np,
            'hero_images': hero_images,
            'hero_slides': serialized_slides,
            'impact_stats': serialized_impact_stats,
            'count': len(serialized_slides),
        })


class ImpactStatViewSet(viewsets.ModelViewSet):
    queryset = ImpactStat.objects.all().order_by('order', 'id')
    serializer_class = ImpactStatSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'bulk_save']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def list(self, request, *args, **kwargs):
        ensure_default_impact_stats()
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.AllowAny])
    def bulk_save(self, request):
        """Bulk update or create the 4 impact statistics from the admin UI"""
        stats_data = request.data.get('stats', [])
        if not isinstance(stats_data, list):
            stats_data = request.data if isinstance(request.data, list) else []

        saved_records = []
        for idx, item in enumerate(stats_data, start=1):
            stat_id = item.get('id') or item.get('stat_id') or f"stat_{idx}"
            number = item.get('number', '0+')
            label = item.get('label', '')
            label_np = item.get('labelNp') or item.get('label_np', '')
            description = item.get('description', '')
            description_np = item.get('descriptionNp') or item.get('description_np', '')
            color = item.get('color', 'primary')
            order = item.get('order', idx)

            obj, _ = ImpactStat.objects.update_or_create(
                stat_id=stat_id,
                defaults={
                    'number': number,
                    'label': label,
                    'label_np': label_np,
                    'description': description,
                    'description_np': description_np,
                    'color': color,
                    'order': order,
                }
            )
            saved_records.append(ImpactStatSerializer(obj).data)

        return Response({
            'status': 'success',
            'saved': len(saved_records),
            'results': saved_records,
        })


# --- Filmstrip Gallery Scenes ViewSet ---
DEFAULT_FILMSTRIP_SCENES_DATA = [
    {
        'scene_number': 'SCENE 01',
        'frame_code': '13',
        'title': 'Warm Clothes Sorting & Sanitization Drive',
        'title_np': 'कपडा संकलन तथा निःशुल्क वितरण तयारी',
        'category': 'Clothes Bank Nepal',
        'category_np': 'कपडा बैंक नेपाल',
        'location': 'Central Hub, Kathmandu',
        'location_np': 'केन्द्रीय संकलन केन्द्र, काठमाडौँ',
        'date': 'Autumn 2024',
        'date_np': 'शरद ऋतु २०८१',
        'description': 'Volunteers meticulously sorting, washing, and packaging thousands of pre-loved wearable garments for cold-wave vulnerable settlements.',
        'description_np': 'तराईका शीतलहर पीडित परिवारका लागि संकलित कपडाहरू स्वयंसेवकद्वारा धोइपखाली, वर्गीकरण र प्याकेजिङ गरिँदै।',
        'image_url': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85',
        'quote': 'Dignity through warmth for every vulnerable family in Nepal.',
        'quote_np': 'प्रत्येक विपन्न परिवारका लागि न्यानोपन र सम्मान।',
        'order': 1
    },
    {
        'scene_number': 'SCENE 02',
        'frame_code': '14',
        'title': 'School Uniforms & Learning Kits Distribution',
        'title_np': 'विद्यालय पोशाक तथा शैक्षिक सामग्री सहयोग',
        'category': 'Education Support',
        'category_np': 'शिक्षा सहयोग',
        'location': 'Rural Community School, Janakpur',
        'location_np': 'ग्रामीण सामुदायिक विद्यालय, जनकपुर',
        'date': 'September 2024',
        'date_np': 'असोज २०८१',
        'description': 'Equipping young primary students with tailored clean school uniforms, backpacks, and essential textbooks to encourage attendance.',
        'description_np': 'नियमित विद्यालय जान प्रोत्साहन गर्न बालबालिकाहरूलाई नयाँ विद्यालय पोशाक, झोला र पाठ्यपुस्तक वितरण।',
        'image_url': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1400&q=85',
        'quote': 'Every child deserves the confidence of a uniform and a notebook.',
        'quote_np': 'हरेक बालबालिकालाई शिक्षा र आत्मविश्वासको समान अवसर।',
        'order': 2
    },
    {
        'scene_number': 'SCENE 03',
        'frame_code': '15',
        'title': 'Classroom Dreams & Rural Learning Hubs',
        'title_np': 'कक्षाकोठामा भविष्य कोर्दै ग्रामीण बालबालिकाहरू',
        'category': 'Child Education',
        'category_np': 'बाल शिक्षा',
        'location': 'Hansapur Primary Hub, Dhanusha',
        'location_np': 'हंसपुर प्राथमिक केन्द्र, धनुषा',
        'date': 'August 2024',
        'date_np': 'भदौ २०८१',
        'description': 'Students engaged in classroom learning at freshly refurbished community school desks supported by Genzicon education drive.',
        'description_np': 'जेन्जिकन शिक्षा अभियानद्वारा मर्मत तथा व्यवस्थापन गरिएका डेस्क-बेन्चमा अध्ययनरत विद्यार्थीहरू।',
        'image_url': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85',
        'quote': 'Building brighter futures one classroom at a time.',
        'quote_np': 'कक्षाकोठाबाटै समृद्ध नेपालको भविष्य निर्माण।',
        'order': 3
    },
    {
        'scene_number': 'SCENE 04',
        'frame_code': '16',
        'title': 'Youth Mentorship & Interactive Study Circles',
        'title_np': 'युवा परामर्श तथा अन्तरक्रियात्मक अध्ययन सत्र',
        'category': 'Youth Leadership',
        'category_np': 'युवा नेतृत्व',
        'location': 'Morang Youth Center, Koshi',
        'location_np': 'मोरङ युवा केन्द्र, कोशी प्रदेश',
        'date': 'July 2024',
        'date_np': 'साउन २०८१',
        'description': 'Young school leaders and adolescent girls participating in interactive leadership, digital literacy, and health awareness sessions.',
        'description_np': 'अन्तरक्रियात्मक नेतृत्व विकास, डिजिटल साक्षरता र स्वास्थ्य सचेतनामा सहभागी किशोरीहरू।',
        'image_url': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1400&q=85',
        'quote': 'Guiding today’s adolescents into tomorrow’s changemakers.',
        'quote_np': 'आजका किशोरीहरूलाई भोलिका समाज सुधारक बनाउने दिशा।',
        'order': 4
    },
    {
        'scene_number': 'SCENE 05',
        'frame_code': '17',
        'title': 'Chure Hills Mass Reforestation Drive',
        'title_np': 'चुरे क्षेत्रमा वृहत् फलफूल वृक्षारोपण',
        'category': 'Green Nepal',
        'category_np': 'हरित नेपाल',
        'location': 'Mithila Chure Ridge, Madhesh',
        'location_np': 'मिथिला चुरे क्षेत्र, मधेश प्रदेश',
        'date': 'Monsoon 2024',
        'date_np': 'वर्षायाम २०८१',
        'description': 'Planting over 100,000 indigenous fruit-bearing and soil-binding trees along fragile Chure slopes to stop flash floods.',
        'description_np': 'चुरे संरक्षण तथा बाढी-पहिरो नियन्त्रणका लागि १ लाखभन्दा बढी फलफूलका बिरुवा रोपण।',
        'image_url': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1400&q=85',
        'quote': 'Restoring Nepal’s green canopy for generations ahead.',
        'quote_np': 'भावी पुस्ताका लागि नेपालको हरित सम्पदाको संरक्षण।',
        'order': 5
    },
    {
        'scene_number': 'SCENE 06',
        'frame_code': '18',
        'title': 'Women Micro-Enterprise & Tailoring Training',
        'title_np': 'महिला आत्मनिर्भरता सिलाई-कटाई तालिम',
        'category': 'Livelihood Skills',
        'category_np': 'जीविकोपार्जन सीप',
        'location': 'Tinkune Skill Hub, Kathmandu',
        'location_np': 'तीनकुने सीप केन्द्र, काठमाडौँ',
        'date': 'June 2024',
        'date_np': 'असार २०८१',
        'description': 'Certified 3-month garment craftsmanship and business training empowering single mothers to run self-reliant micro enterprises.',
        'description_np': 'विपन्न तथा एकल महिलाहरूलाई ३ महिने निःशुल्क सिलाई तालिम र मेसिन हस्तान्तरण।',
        'image_url': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1400&q=85',
        'quote': 'Economic independence is the most enduring form of empowerment.',
        'quote_np': 'आर्थिक आत्मनिर्भरता नै महिला सशक्तीकरणको स्थायी आधार हो।',
        'order': 6
    }
]

def ensure_default_filmstrip_scenes():
    """Ensure standard 6 scenes exist in the database if empty"""
    if FilmstripScene.objects.count() == 0:
        for item in DEFAULT_FILMSTRIP_SCENES_DATA:
            FilmstripScene.objects.create(**item)


class FilmstripSceneViewSet(viewsets.ModelViewSet):
    queryset = FilmstripScene.objects.all().order_by('order', 'id')
    serializer_class = FilmstripSceneSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]  # Can be tightened to IsAdminUser if session exists

    def list(self, request, *args, **kwargs):
        ensure_default_filmstrip_scenes()
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.AllowAny])
    def bulk_save(self, request):
        """Bulk update or replace scenes from the admin UI"""
        scenes_data = request.data.get('scenes', [])
        if not isinstance(scenes_data, list):
            scenes_data = request.data if isinstance(request.data, list) else []

        saved_records = []
        for idx, item in enumerate(scenes_data, start=1):
            scene_id = item.get('id')
            data = {
                'scene_number': item.get('sceneNumber') or item.get('scene_number') or f"SCENE {idx:02d}",
                'frame_code': item.get('frameCode') or item.get('frame_code') or str(12 + idx),
                'title': item.get('title', ''),
                'title_np': item.get('titleNp') or item.get('title_np', ''),
                'category': item.get('category') or 'Ground Work',
                'category_np': item.get('categoryNp') or item.get('category_np', ''),
                'location': item.get('location', ''),
                'location_np': item.get('locationNp') or item.get('location_np', ''),
                'date': item.get('date', ''),
                'date_np': item.get('dateNp') or item.get('date_np', ''),
                'description': item.get('description', ''),
                'description_np': item.get('descriptionNp') or item.get('description_np', ''),
                'image_url': item.get('imageUrl') or item.get('image_url', ''),
                'quote': item.get('quote', ''),
                'quote_np': item.get('quoteNp') or item.get('quote_np', ''),
                'order': item.get('order', idx),
                'is_active': item.get('isActive', True) if 'isActive' in item else item.get('is_active', True),
            }

            if scene_id and str(scene_id).isdigit():
                try:
                    obj = FilmstripScene.objects.get(id=int(scene_id))
                    for k, v in data.items():
                        setattr(obj, k, v)
                    obj.save()
                except FilmstripScene.DoesNotExist:
                    obj = FilmstripScene.objects.create(**data)
            else:
                # If it's a string id like 'scene-01', try matching by scene_number or create new
                obj = FilmstripScene.objects.filter(scene_number=data['scene_number']).first()
                if obj:
                    for k, v in data.items():
                        setattr(obj, k, v)
                    obj.save()
                else:
                    obj = FilmstripScene.objects.create(**data)

            saved_records.append(FilmstripSceneSerializer(obj, context={'request': request}).data)

        return Response({
            'status': 'success',
            'saved': len(saved_records),
            'results': saved_records,
        })


# --- Board Members & Leadership ---
DEFAULT_BOARD_MEMBERS_DATA = [
    {
        'name': 'Suman Yadav',
        'name_np': 'सुमन यादव',
        'position': 'Founder & Chairperson',
        'position_np': 'संस्थापक तथा अध्यक्ष',
        'image_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        'email': 'suman@genzicon.org',
        'bio': 'Youth activist leading nationwide Clothes Bank campaigns, disaster response, and civic initiatives.',
        'bio_np': 'नेपालमा कपडा बैंक, विपद् राहत तथा युवा सशक्तीकरण अभियानका अगुवा।',
        'order': 1,
        'is_active': True,
    },
    {
        'name': 'Anita Shrestha',
        'name_np': 'अनिता श्रेष्ठ',
        'position': 'Vice Chairperson',
        'position_np': 'उपाध्यक्ष',
        'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        'email': 'anita@genzicon.org',
        'bio': 'Vocational training strategist leading women empowerment and community tailoring centers across districts.',
        'bio_np': 'महिला आत्मनिर्भरता तथा सीप विकास परियोजना प्रमुख।',
        'order': 2,
        'is_active': True,
    },
    {
        'name': 'Rohit Adhikari',
        'name_np': 'रोहित अधिकारी',
        'position': 'General Secretary',
        'position_np': 'महासचिव',
        'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        'email': 'rohit@genzicon.org',
        'bio': 'Environmental engineer managing Clean Nepal Green Nepal, afforestation drives, and community sanitation.',
        'bio_np': 'सफा नेपाल, हरित नेपाल तथा चुरे संरक्षण अभियानका संयोजक।',
        'order': 3,
        'is_active': True,
    },
    {
        'name': 'Priya Thapa',
        'name_np': 'प्रिया थापा',
        'position': 'Treasurer',
        'position_np': 'कोषाध्यक्ष',
        'image_url': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        'email': 'treasury@genzicon.org',
        'bio': 'Finance and audit professional overseeing 100% transparent public ledger records and grassroots logistics.',
        'bio_np': 'पारदर्शी आर्थिक व्यवस्थापन तथा लेखा परीक्षण प्रमुख।',
        'order': 4,
        'is_active': True,
    },
    {
        'name': 'Bikash Chaudhary',
        'name_np': 'बिकेश चौधरी',
        'position': 'Executive Board Member',
        'position_np': 'कार्यकारी सदस्य',
        'image_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        'email': 'bikash@genzicon.org',
        'bio': 'Madhesh province ground coordinator leading cold-wave winter clothes distribution hubs.',
        'bio_np': 'मधेस प्रदेश फिल्ड समन्वय तथा शीतलहर राहत अभियान व्यवस्थापक।',
        'order': 5,
        'is_active': True,
    },
    {
        'name': 'Dr. Sunita Regmi',
        'name_np': 'डा. सुनिता रेग्मी',
        'position': 'Advisory Board Member',
        'position_np': 'सल्लाहकार सदस्य',
        'image_url': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        'email': 'advisory@genzicon.org',
        'bio': 'Public health expert advising on community hygiene, sanitation drives, and school adolescent awareness.',
        'bio_np': 'सामुदायिक स्वास्थ्य तथा जनस्वास्थ्य अनुसन्धान सल्लाहकार।',
        'order': 6,
        'is_active': True,
    }
]

def ensure_default_board_members():
    """Ensure default board members exist in the database if empty"""
    if BoardMember.objects.count() == 0:
        for item in DEFAULT_BOARD_MEMBERS_DATA:
            BoardMember.objects.create(**item)


class BoardMemberViewSet(viewsets.ModelViewSet):
    queryset = BoardMember.objects.all().order_by('order', 'id')
    serializer_class = BoardMemberSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        ensure_default_board_members()
        active_only = request.query_params.get('active_only')
        if active_only == 'true':
            queryset = self.filter_queryset(self.get_queryset().filter(is_active=True))
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post', 'put'], permission_classes=[permissions.AllowAny])
    def bulk_save(self, request):
        """Bulk update or replace board members from the admin UI"""
        members_data = request.data.get('members', [])
        if not isinstance(members_data, list):
            members_data = request.data if isinstance(request.data, list) else []

        saved_records = []
        for idx, item in enumerate(members_data, start=1):
            member_id = item.get('id')
            data = {
                'name': item.get('name', ''),
                'name_np': item.get('nameNp') or item.get('name_np', ''),
                'position': item.get('position') or item.get('role', ''),
                'position_np': item.get('positionNp') or item.get('position_np') or item.get('roleNp') or item.get('role_np', ''),
                'email': item.get('email', ''),
                'phone': item.get('phone', ''),
                'linkedin': item.get('linkedin', ''),
                'bio': item.get('bio', ''),
                'bio_np': item.get('bioNp') or item.get('bio_np', ''),
                'image_url': item.get('imageUrl') or item.get('image_url') or item.get('avatarUrl', ''),
                'order': item.get('order', idx),
                'is_active': item.get('isActive', True) if 'isActive' in item else item.get('is_active', True),
            }

            if member_id and str(member_id).isdigit():
                try:
                    obj = BoardMember.objects.get(id=int(member_id))
                    for k, v in data.items():
                        setattr(obj, k, v)
                    obj.save()
                except BoardMember.DoesNotExist:
                    obj = BoardMember.objects.create(**data)
            else:
                obj = BoardMember.objects.filter(name=data['name']).first()
                if obj:
                    for k, v in data.items():
                        setattr(obj, k, v)
                    obj.save()
                else:
                    obj = BoardMember.objects.create(**data)

            saved_records.append(BoardMemberSerializer(obj, context={'request': request}).data)

        return Response({
            'status': 'success',
            'saved': len(saved_records),
            'results': saved_records,
        })


DEFAULT_PROJECTS = [
    {
        'slug': 'winter-clothes-relief-terai-coldwave',
        'title': 'Winter Clothes & Blanket Relief Drive (Terai Cold Wave)',
        'title_np': 'तराई शीतलहर न्यानो कपडा तथा कम्बल वितरण अभियान',
        'category': 'Clothes Bank Nepal',
        'category_np': 'कपडा बैंक नेपाल (जनसेवा)',
        'district': 'Dhanusha & Mahottari',
        'province': 'Madhesh Province',
        'status': 'Active',
        'target_amount': 1800000.00,
        'raised_amount': 1584000.00,
        'donor_count': 342,
        'beneficiaries_count': '18,500+ Vulnerable Individuals',
        'image_url': 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
        'description': 'Collecting and delivering 25,000 warm winter jackets, sweaters, and blankets to Musahar, Dom, and impoverished Dalit settlements across Dhanusha, Mahottari, and Saptari.',
        'description_np': 'शीतलहरबाट प्रभावित मधेसका विपन्न मुसहर, डोम तथा गरिब परिवारका बालबालिका र वृद्धवृद्धालाई न्यानो कपडा र कम्बल वितरण।',
        'full_description': 'Every winter, extreme cold waves in southern Nepal claim vulnerable lives due to lack of warm clothing. Clothes Bank Nepal mobilizes collection points in Kathmandu and Pokhara to gather quality winter garments, clean and pack them, and transport them directly to vulnerable rural hamlets.',
        'full_description_np': 'जाडो महिनामा तराईमा चल्ने कठ्यांग्रिँदो शीतलहरमा न्यानो लुगा नभएका बालबालिका तथा ज्येष्ठ नागरिकको जीवन बचाउन हामीले काठमाडौँ र अन्य सहरबाट कपडा संकलन गरी गाउँमै पुगेर वितरण गर्दै आएका छौँ।',
        'is_featured': True,
    },
    {
        'slug': 'clean-green-nepal-100k-tree-plantation',
        'title': 'Clean Nepal, Green Nepal: 100K Tree Plantation Drive',
        'title_np': 'सफा नेपाल, हरित नेपाल: १ लाख वृक्षारोपण अभियान',
        'category': 'Clean Nepal, Green Nepal',
        'category_np': 'सफा नेपाल, हरित नेपाल (प्रकृति)',
        'district': 'Chitwan & Makwanpur',
        'province': 'Bagmati Province',
        'status': 'Active',
        'target_amount': 2200000.00,
        'raised_amount': 1672000.00,
        'donor_count': 288,
        'beneficiaries_count': '35,000+ Community Residents',
        'image_url': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
        'description': 'Planting native fruit trees and bamboo along vulnerable Chure slopes, community riverbanks, and public parks to prevent erosion and create green lungs.',
        'description_np': 'चुरे संरक्षण, नदी कटान रोकथाम र हरियाली प्रवर्द्धनका लागि स्थानीय समुदायको सहभागितामा १ लाख फलफूल तथा वनस्पति वृक्षारोपण।',
        'full_description': 'The Chure foothills face critical deforestation and flash floods. Under Clean Nepal Green Nepal, Genzicon Foundation collaborates with rural youth clubs and community forest groups to plant mango, guava, bamboo, and medicinal trees while educating schools on environmental stewardship.',
        'full_description_np': 'चुरेको दोहन रोक्न र वातावरण जोगाउन हाम्रा स्वयंसेवकहरूले आँप, अम्बा, बाँस र स्थानीय प्रजातिका बिरुवा रोप्दै विद्यालयहरूमा वातावरण क्लब गठन गरेका छन्।',
        'is_featured': True,
    },
    {
        'slug': 'women-tailoring-garment-enterprise',
        'title': 'Women Tailoring & Garment Enterprise Incubator',
        'title_np': 'महिला सिलाई-कटाई तथा कपडा उत्पादन लघु उद्यमशीलता',
        'category': 'Skills & Business Development',
        'category_np': 'दक्षता तथा उद्यमशीलता (आत्मनिर्भरता)',
        'district': 'Janakpur & Kathmandu',
        'province': 'Madhesh & Bagmati',
        'status': 'Active',
        'target_amount': 2500000.00,
        'raised_amount': 2300000.00,
        'donor_count': 415,
        'beneficiaries_count': '1,200+ Women Entrepreneurs',
        'image_url': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
        'description': 'Providing free 3-month professional sewing training, cloth cutting, and free sewing machines to marginalized women and single mothers to earn independent income.',
        'description_np': 'विपन्न, एकल तथा पिछडिएका महिलाहरूलाई निःशुल्क ३ महिने सिलाई-कटाई तालिम र आफ्नै व्यवसाय सुरु गर्न निःशुल्क सिलाई मेसिन वितरण।',
        'full_description': 'Financial independence is the most powerful tool against poverty. Our skills center equips women with modern stitching techniques, school uniform manufacturing skills, and basic bookkeeping. Each graduate receives a certified sewing machine and cloth inventory to start earning from home.',
        'full_description_np': 'महिलाहरूलाई आर्थिक रूपमा आत्मनिर्भर बनाउन आधुनिक सिलाई मेसिन, कपडा कटिङ र व्यवसाय व्यवस्थापन तालिम दिइन्छ। तालिम पश्चात सबैलाई निःशुल्क सिलाई मेसिन प्रदान गरिन्छ।',
        'is_featured': True,
    },
    {
        'slug': 'himalayan-children-warm-clothes-uniform-bank',
        'title': 'Himalayan Children Warm Clothes & Uniform Bank',
        'title_np': 'दुर्गम हिमाली विद्यार्थी न्यानो पोशाक तथा जुत्ता वितरण',
        'category': 'Clothes Bank Nepal',
        'category_np': 'कपडा बैंक नेपाल (जनसेवा)',
        'district': 'Jumla & Humla',
        'province': 'Karnali Province',
        'status': 'Completed',
        'target_amount': 1500000.00,
        'raised_amount': 1500000.00,
        'donor_count': 210,
        'beneficiaries_count': '3,800+ Himalayan Students',
        'image_url': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
        'description': 'Supplying thermal innerwear, heavy sweaters, windcheaters, shoes, and school bags to children studying in sub-zero temperatures across Jumla, Humla, and Dolpa.',
        'description_np': 'जुम्ला, हुम्ला र डोल्पाका विकट विद्यालयमा अध्ययनरत गरिब बालबालिकालाई न्यानो कपडा, ज्याकेट, स्विटर र जुत्ता वितरण।',
        'full_description': 'In high altitude regions of Nepal, extreme cold causes severe dropouts in schools. Clothes Bank Nepal sends curated heavy-winter packages containing thermals, woolen socks, gloves, and durable jackets directly to community schools.',
        'full_description_np': 'कर्णालीका उच्च हिमाली भेगमा चिसोका कारण बालबालिका विद्यालय जानबाट वञ्चित नहोउन् भनेर हामीले न्यानो कपडा, जुत्ता र मोजा विद्यालयमै पुर्याउँछौँ।',
        'is_featured': False,
    },
    {
        'slug': 'youth-digital-skills-it-bootcamp',
        'title': 'Youth Digital Skills, IT & Mobile Repair Bootcamp',
        'title_np': 'युवा डिजिटल साक्षरता, कम्प्युटर तथा प्राविधिक सीप तालिम',
        'category': 'Skills & Business Development',
        'category_np': 'दक्षता तथा उद्यमशीलता (आत्मनिर्भरता)',
        'district': 'Birgunj & Janakpur',
        'province': 'Madhesh Province',
        'status': 'Active',
        'target_amount': 1600000.00,
        'raised_amount': 1344000.00,
        'donor_count': 195,
        'beneficiaries_count': '850+ Youth Enrolled',
        'image_url': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        'description': 'Training underprivileged youth in practical computer literacy, smartphone hardware repair, digital marketing, and freelance services for immediate employment.',
        'description_np': 'विपन्न युवाहरूलाई कम्प्युटर साक्षरता, मोबाइल मर्मत, डिजिटल मार्केटिङ र अनलाइन रोजगार सीप तालिम।',
        'full_description': 'Bridging the digital divide in semi-urban and rural Nepal. Youth undergo rigorous 8-week hands-on training labs, equipping them to start local repair shops, work in digital offices, or take on freelance projects.',
        'full_description_np': 'मधेस र बागमतीका युवाहरूलाई सीपमूलक प्राविधिक तालिम दिएर वैदेशिक रोजगारीको सट्टा स्वदेशमै स्वरोजगार बनाउने अभियान।',
        'is_featured': False,
    },
    {
        'slug': 'riverfront-cleanups-plastic-free-nepal',
        'title': 'Riverfront Cleanups & Plastic-Free Nepal Campaign',
        'title_np': 'नदी सरसफाइ तथा प्लास्टिकमुक्त नेपाल अभियान',
        'category': 'Clean Nepal, Green Nepal',
        'category_np': 'सफा नेपाल, हरित नेपाल (प्रकृति)',
        'district': 'Kathmandu & Chitwan',
        'province': 'Bagmati Province',
        'status': 'Active',
        'target_amount': 1200000.00,
        'raised_amount': 890000.00,
        'donor_count': 160,
        'beneficiaries_count': '50,000+ City Residents',
        'image_url': 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80',
        'description': 'Mobilizing weekly volunteer taskforces to clean Bagmati, Bishnumati, and Narayani river corridors, installing dustbins and recycling plastic bottles into eco-bricks.',
        'description_np': 'बागमती, विष्णुमती र नारायणी नदी किनार सरसफाइ, फोहोर संकलन डस्टबिन जडान र प्लास्टिक रिसाइक्लिङ।',
        'full_description': 'Addressing acute river pollution and urban plastic waste through community mobilization. Volunteers collect non-biodegradable trash, partner with local recyclers, and install educational signboards in pilgrimage and public areas.',
        'full_description_np': 'सार्वजनिक सम्पदा र नदीहरूलाई प्लास्टिकमुक्त बनाउन हरेक शनिबार युवा स्वयंसेवकहरू फिल्डमा खटिन्छन् र संकलित फोहोरको उचित व्यवस्थापन गर्दछन्।',
        'is_featured': False,
    }
]

def ensure_default_projects():
    """Seed comprehensive projects if table is empty"""
    if Project.objects.count() == 0:
        for p in DEFAULT_PROJECTS:
            Project.objects.create(
                slug=p['slug'],
                title=p['title'],
                title_np=p['title_np'],
                category=p['category'],
                category_np=p.get('category_np', ''),
                district=p['district'],
                province=p['province'],
                status=p['status'],
                target_amount=p['target_amount'],
                raised_amount=p['raised_amount'],
                donor_count=p.get('donor_count', 0),
                beneficiaries_count=p['beneficiaries_count'],
                image_url=p['image_url'],
                description=p['description'],
                description_np=p['description_np'],
                full_description=p.get('full_description', ''),
                full_description_np=p.get('full_description_np', ''),
                is_featured=p.get('is_featured', True),
            )

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-is_featured', '-created_at')
    serializer_class = ProjectSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'title_np', 'district', 'category', 'province', 'slug']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_slug', 'adjust_donation']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]  # Seamless admin sync

    def list(self, request, *args, **kwargs):
        ensure_default_projects()
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def by_slug(self, request):
        """Retrieve project by SEO URL slug"""
        slug = request.query_params.get('slug', '').strip()
        if not slug:
            return Response({'error': 'Slug parameter is required'}, status=400)
        ensure_default_projects()
        try:
            project = Project.objects.get(slug=slug)
            return Response(ProjectSerializer(project, context={'request': request}).data)
        except Project.DoesNotExist:
            return Response({'error': f'Project with slug "{slug}" not found'}, status=404)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def adjust_donation(self, request, pk=None):
        """Adjust or boost donation amount and donor count for a project"""
        project = self.get_object()
        add_amount = request.data.get('add_amount')
        set_raised = request.data.get('set_raised')
        set_goal = request.data.get('set_goal')
        add_donors = request.data.get('add_donors')
        set_donors = request.data.get('set_donors')

        if add_amount is not None:
            project.raised_amount = float(project.raised_amount) + float(add_amount)
        if set_raised is not None:
            project.raised_amount = float(set_raised)
        if set_goal is not None:
            project.target_amount = float(set_goal)
        if add_donors is not None:
            project.donor_count = int(project.donor_count) + int(add_donors)
        if set_donors is not None:
            project.donor_count = int(set_donors)

        project.save()
        return Response({
            'status': 'success',
            'project': ProjectSerializer(project, context={'request': request}).data
        })


DEFAULT_CLOTHES_DONORS = [
    {
        'name': 'Suman Thapa',
        'name_np': 'सुमन थापा',
        'location': 'Kathmandu',
        'location_np': 'काठमाडौँ',
        'items_count': 45,
        'clothes_type': 'Winter Jackets & Sweaters',
        'clothes_type_np': 'जाडोको न्यानो ज्याकेट र स्विटर',
        'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        'note': 'Glad to contribute 45 warm jackets and woolen blankets for the winter relief drive.',
        'note_np': 'शीतलहर पीडित दाजुभाइ तथा दिदीबहिनीका लागि ४५ थान न्यानो ज्याकेट सहयोग गर्न पाउँदा खुसी लागेको छ।',
        'date': '2024-08-25',
        'is_verified': True,
        'is_featured': True
    },
    {
        'name': 'Anjali Shrestha',
        'name_np': 'अञ्जली श्रेष्ठ',
        'location': 'Lalitpur (Kupondole)',
        'location_np': 'ललितपुर (कुपण्डोल)',
        'items_count': 32,
        'clothes_type': 'Kids Wear & School Sweaters',
        'clothes_type_np': 'बालबालिकाका कपडा र विद्यालय स्विटर',
        'image_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        'note': 'Happy to support children in remote mountain schools with warm school wear.',
        'note_np': 'हिमाली विद्यालयका साना बालबालिकालाई न्यानो पोशाक पुगोस् भन्ने कामना गर्दछु।',
        'date': '2024-08-24',
        'is_verified': True,
        'is_featured': True
    },
    {
        'name': 'Prabin Adhikari',
        'name_np': 'प्रबिन अधिकारी',
        'location': 'Pokhara',
        'location_np': 'पोखरा',
        'items_count': 55,
        'clothes_type': 'Blankets & Quilts',
        'clothes_type_np': 'कम्बल तथा बाक्लो सिरक',
        'image_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        'note': 'Sent 55 warm blankets to protect vulnerable families from the Terai cold wave.',
        'note_np': 'तराईको शीतलहरबाट विपन्न मुसहर बस्तीलाई जोगाउन ५५ थान कम्बल पठाएका छौँ।',
        'date': '2024-08-22',
        'is_verified': True,
        'is_featured': True
    },
    {
        'name': 'Bina Maharjan',
        'name_np': 'बिना महर्जन',
        'location': 'Bhaktapur',
        'location_np': 'भक्तपुर',
        'items_count': 28,
        'clothes_type': 'Sweaters & Woolen Caps',
        'clothes_type_np': 'ऊनको स्विटर र टोपी',
        'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        'note': 'Warm wishes for our sisters and brothers in need across Nepal.',
        'note_np': 'जेन्जिकन कपडा बैंकको यो पवित्र अभियानलाई निरन्तर साथ रहनेछ।',
        'date': '2024-08-20',
        'is_verified': True,
        'is_featured': True
    },
    {
        'name': 'Roshan Khadka',
        'name_np': 'रोशन खड्का',
        'location': 'Chitwan / Bharatpur',
        'location_np': 'चितवन / भरतपुर',
        'items_count': 40,
        'clothes_type': 'Mixed Family Clothing Pack',
        'clothes_type_np': 'मिश्रित पारिवारिक कपडा सेट',
        'image_url': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
        'note': 'Honored to be part of Genzicon Clothes Bank Nepal movement.',
        'note_np': 'घरमा रहेका सफा र उपयोगी कपडाहरू सही हातमा पुगेकोमा पूर्ण सन्तुष्ट छु।',
        'date': '2024-08-18',
        'is_verified': True,
        'is_featured': True
    },
    {
        'name': 'Sunita Chaudhary',
        'name_np': 'सुनिता चौधरी',
        'location': 'Janakpurdham',
        'location_np': 'जनकपुरधाम',
        'items_count': 35,
        'clothes_type': 'Winter Shawls & Jackets',
        'clothes_type_np': 'न्यानो सल तथा ज्याकेट',
        'image_url': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        'note': 'Directly dropped off warm shawls and clothes at the central hub.',
        'note_np': 'केन्द्रमै पुगेर कपडा हस्तान्तरण गरेँ, स्वयंसेवकहरूको सेवाभाव अतुलनीय छ।',
        'date': '2024-08-15',
        'is_verified': True,
        'is_featured': True
    }
]

def ensure_default_clothes_donors():
    """Seed sample clothes donors if table is empty"""
    if ClothesDonor.objects.count() == 0:
        for d in DEFAULT_CLOTHES_DONORS:
            ClothesDonor.objects.create(
                name=d['name'],
                name_np=d.get('name_np', ''),
                location=d['location'],
                location_np=d.get('location_np', ''),
                items_count=d['items_count'],
                clothes_type=d['clothes_type'],
                clothes_type_np=d.get('clothes_type_np', ''),
                image_url=d['image_url'],
                note=d.get('note', ''),
                note_np=d.get('note_np', ''),
                date=d['date'],
                is_verified=d.get('is_verified', True),
                is_featured=d.get('is_featured', True),
            )

class ClothesDonorViewSet(viewsets.ModelViewSet):
    queryset = ClothesDonor.objects.all().order_by('-date', '-created_at')
    serializer_class = ClothesDonorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'name_np', 'location', 'location_np', 'clothes_type', 'note']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def list(self, request, *args, **kwargs):
        ensure_default_clothes_donors()
        return super().list(request, *args, **kwargs)

class ClothesDonationViewSet(viewsets.ModelViewSet):
    queryset = ClothesDonation.objects.all()
    serializer_class = ClothesDonationSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]
    filter_backends = [filters.SearchFilter]
    search_fields = ['donor_name', 'phone', 'city', 'district', 'ref_id']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


def ensure_default_volunteers():
    """Ensure initial verified active volunteers exist for public directory"""
    if Volunteer.objects.count() == 0:
        sample_volunteers = [
            {
                'volunteer_id': 'VOL-2026-01',
                'full_name': 'Aarav Sharma',
                'phone': '9841000001',
                'email': 'aarav.sharma@gmail.com',
                'province': 'Bagmati Province',
                'district': 'Kathmandu',
                'interest': 'Clothes Bank Nepal (Collection, Sorting & Distribution)',
                'availability': 'Weekends (Saturday/Sunday)',
                'skills': 'Logistics coordination and youth volunteer team lead.',
                'image_url': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
                'status': 'Approved',
            },
            {
                'volunteer_id': 'VOL-2026-02',
                'full_name': 'Pooja Thapa Magar',
                'phone': '9801000002',
                'email': 'pooja.magar@gmail.com',
                'province': 'Gandaki Province',
                'district': 'Kaski (Pokhara)',
                'interest': 'Clean Nepal, Green Nepal (100K Tree Plantation & Chure Reforestation)',
                'availability': 'Part-time (5-10 hours/week)',
                'skills': 'Environmental science graduate and local community mobilizer.',
                'image_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                'status': 'Approved',
            },
            {
                'volunteer_id': 'VOL-2026-03',
                'full_name': 'Bikash Mahato',
                'phone': '9812000003',
                'email': 'bikash.mahato@gmail.com',
                'province': 'Madhesh Province',
                'district': 'Siraha',
                'interest': 'Clothes Bank Nepal (Field Distribution & Cold Wave Relief)',
                'availability': 'Full-time Field Volunteer',
                'skills': 'Disaster relief distribution lead in Musahar settlements.',
                'image_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                'status': 'Approved',
            },
            {
                'volunteer_id': 'VOL-2026-04',
                'full_name': 'Sunita KC',
                'phone': '9847000004',
                'email': 'sunita.kc@gmail.com',
                'province': 'Lumbini Province',
                'district': 'Rupandehi',
                'interest': 'Skills & Business (Women Tailoring & Garment Making Trainer)',
                'availability': 'Weekends (Saturday/Sunday)',
                'skills': 'Master tailor and vocational mentor for women empowerment.',
                'image_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                'status': 'Approved',
            },
        ]
        for v in sample_volunteers:
            Volunteer.objects.create(**v)


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'phone', 'district', 'volunteer_id', 'interest', 'province']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        ensure_default_volunteers()
        user = self.request.user
        if user and (user.is_staff or user.is_authenticated):
            return Volunteer.objects.all().order_by('-created_at')
        # Public visitors see only Approved / Active volunteers
        return Volunteer.objects.filter(status__in=['Approved', 'Contacted']).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user and (user.is_staff or user.is_authenticated)):
            # Public website submissions always start as 'Pending'
            serializer.save(status='Pending')
        else:
            # Backend admin additions default to 'Approved'
            status_val = self.request.data.get('status', 'Approved')
            serializer.save(status=status_val)


def ensure_default_donations():
    """Seed sample verified donors with transparent receipts if empty"""
    if DonationRecord.objects.count() == 0:
        sample_donations = [
            {
                'receipt_number': 'REC-2026-101',
                'donor_name': 'Rameshwor Adhikari',
                'donor_phone': '9851000000',
                'donor_email': 'rameshwor.a@gmail.com',
                'donor_address': 'Kathmandu, Bagmati Province',
                'amount': 25000.00,
                'payment_method': 'bank_transfer',
                'project_name': 'Clothes Bank Nepal - Central Hub Support',
                'donor_photo_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                'status': 'Verified',
                'is_public': True,
            },
            {
                'receipt_number': 'REC-2026-102',
                'donor_name': 'Pratima Shrestha',
                'donor_phone': '9841220000',
                'donor_email': 'pratima.s@gmail.com',
                'donor_address': 'Lalitpur (Kupondole)',
                'amount': 10000.00,
                'payment_method': 'esewa',
                'project_name': 'Clean Nepal, Green Nepal (100K Tree Plantation)',
                'donor_photo_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                'status': 'Verified',
                'is_public': True,
            },
            {
                'receipt_number': 'REC-2026-103',
                'donor_name': 'Bikram Thapa',
                'donor_phone': '9801330000',
                'donor_email': 'bikram.t@gmail.com',
                'donor_address': 'Pokhara, Kaski (Gandaki)',
                'amount': 15000.00,
                'payment_method': 'khalti',
                'project_name': 'Youth Digital Skills & Women Tailoring Hub',
                'donor_photo_url': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                'status': 'Verified',
                'is_public': True,
            },
            {
                'receipt_number': 'REC-2026-104',
                'donor_name': 'Sunita & Deepak KC',
                'donor_phone': '9847110000',
                'donor_email': 'kc.family@gmail.com',
                'donor_address': 'Butwal, Lumbini Province',
                'amount': 5000.00,
                'payment_method': 'bank_transfer',
                'project_name': 'Terai Cold Wave Blanket & Warm Wear Relief',
                'donor_photo_url': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                'status': 'Verified',
                'is_public': True,
            },
        ]
        for d in sample_donations:
            DonationRecord.objects.create(**d)


class DonationRecordViewSet(viewsets.ModelViewSet):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]
    filter_backends = [filters.SearchFilter]
    search_fields = ['receipt_number', 'donor_name', 'donor_phone', 'donor_address', 'project_name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        ensure_default_donations()
        user = self.request.user
        if user and (user.is_staff or user.is_authenticated):
            return DonationRecord.objects.all().order_by('-created_at')
        # Public visitors see only Approved / Verified donations marked as public
        return DonationRecord.objects.filter(status__in=['Verified', 'Approved'], is_public=True).order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user
        if not (user and (user.is_staff or user.is_authenticated)):
            # Public website submissions start as 'Pending' until verified
            serializer.save(status='Pending')
        else:
            status_val = self.request.data.get('status', 'Verified')
            serializer.save(status=status_val)


class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'phone', 'subject']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


def ensure_default_hub_config():
    """Ensure at least one default central clothes hub configuration exists"""
    if ClothesHubConfig.objects.count() == 0:
        ClothesHubConfig.objects.create(
            hub_name="Genzicon Clothes Bank Nepal - Central Hub",
            hub_name_np="जेन्जिकन कपडा बैंक नेपाल - मुख्य संकलन केन्द्र",
            address="Tinkune / New Baneshwor (Near Ring Road)",
            address_np="तीनकुने / नयाँ बानेश्वर (रिङ रोड नजिक)",
            landmark="Opposite to Central Park, Kathmandu 44600",
            landmark_np="सेन्ट्रल पार्क अगाडि, काठमाडौँ ४४६००",
            city="Kathmandu",
            district="Kathmandu",
            province="Bagmati Province",
            phone1="9823000000",
            phone2="01-4240000",
            email="clothes@genzicon.com",
            operating_hours="8:00 AM – 6:00 PM Daily (Open Saturdays)",
            operating_hours_np="बिहान ८:०० देखि साँझ ६:०० सम्म (शनिबार पनि खुला)",
            map_embed_url="https://maps.google.com/maps?q=genzicon,+Kathmandu,+Nepal&hl=en&z=16&output=embed",
            google_maps_directions_url="https://maps.app.goo.gl/jzMPyppNjnAydjax8",
            contact_note="Direct phone contact for rider delivery (Pathao/InDrive) and cargo parcel coordination.",
            contact_note_np="पठाओ, इनड्राइभ राइडर वा कुरियर पार्सल आइपुग्दा माथिको फोनमा सम्पर्क गर्न भन्नुहोला।"
        )


class ClothesHubConfigViewSet(viewsets.ModelViewSet):
    queryset = ClothesHubConfig.objects.all()
    serializer_class = ClothesHubConfigSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]  # Allow seamless sync from admin client

    def list(self, request, *args, **kwargs):
        ensure_default_hub_config()
        config = ClothesHubConfig.objects.first()
        serializer = self.get_serializer(config)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        ensure_default_hub_config()
        config = ClothesHubConfig.objects.first()
        serializer = self.get_serializer(config, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


def ensure_default_site_settings():
    """Ensure default SiteSettings singleton exists"""
    if SiteSettings.objects.count() == 0:
        SiteSettings.objects.create(
            org_name="Genzicon Foundation Nepal",
            org_name_np="जेन्जिकन फाउन्डेशन नेपाल",
            tagline="Grassroots Youth-Led Transformation Across Nepal",
            tagline_np="नेपालभर युवा नेतृत्वमा प्रत्यक्ष सामाजिक रूपान्तरण",
            about_text="A registered non-profit NGO operating Clothes Bank Nepal, reforestation campaigns, and vocational training across 77 districts.",
            about_text_np="कपडा बैंक नेपाल, सफा तथा हरित नेपाल वृक्षारोपण, र महिला तथा युवा सीप एवं उद्यमशीलता प्रवर्द्धनमा समर्पित गैरसरकारी संस्था।",
            head_office_title="Central Head Office (Kathmandu)",
            head_office_title_np="केन्द्रीय कार्यालय (काठमाडौँ)",
            head_office_subtitle="Genzicon Foundation Central HQ",
            head_office_subtitle_np="जेन्जिकन फाउन्डेशन मुख्य कार्यालय",
            head_office_address="Putalisadak, Ward No. 28, Kathmandu 44600, Nepal",
            head_office_address_np="पुतलीसडक, वडा नं. २८, काठमाडौँ ४४६००, नेपाल",
            head_office_phone="+977 1-4240000 / 9823000000",
            head_office_email="info@genzicon.org",
            head_office_hours="Sun - Fri: 9:30 AM – 5:30 PM (NPT)",
            head_office_hours_np="आइत - शुक्र: बिहान ९:३० देखि साँझ ५:३० सम्म",
            regional_office_title="Madhesh Regional Office (Janakpur)",
            regional_office_title_np="मधेस प्रदेश क्षेत्रीय कार्यालय (जनकपुर)",
            regional_office_subtitle="Field & Clothes Bank Operations",
            regional_office_subtitle_np="मैदानी तथा कपडा बैंक सञ्चालन",
            regional_office_address="Station Road, Ward No. 4, Janakpurdham, Dhanusha",
            regional_office_address_np="स्टेशन रोड, वडा नं. ४, जनकपुरधाम, धनुषा",
            regional_office_phone="+977 41-520000",
            regional_office_email="janakpur@genzicon.org",
            regional_office_hours="Sun - Fri: 9:30 AM – 5:30 PM (NPT)",
            regional_office_hours_np="आइत - शुक्र: बिहान ९:३० देखि साँझ ५:३० सम्म",
            hotline_title="Direct Clothes Donation Help",
            hotline_title_np="तत्काल कपडा दान तथा सोधपुछ",
            hotline_phone="9823000000",
            hotline_text="For urgent clothes pickup or emergency cold-wave support, call our hotline at 9823000000 or chat on WhatsApp.",
            hotline_text_np="कपडा दान संकलन वा वितरण सहायताका लागि हाम्रो हटलाइन ९८२३०००००० मा सिधै सम्पर्क गर्न सक्नुहुन्छ।",
            whatsapp_number="+977 9823000000",
            whatsapp_message="Namaste Genzicon Foundation, I would like to connect.",
            facebook_url="https://facebook.com",
            footer_offices_summary="Putalisadak, Kathmandu & Station Rd, Janakpur",
            footer_offices_summary_np="पुतलीसडक, काठमाडौँ र स्टेशन रोड, जनकपुर"
        )


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]  # Seamless save from Admin tab

    def list(self, request, *args, **kwargs):
        ensure_default_site_settings()
        settings_obj = SiteSettings.objects.first()
        serializer = self.get_serializer(settings_obj, context={'request': request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        ensure_default_site_settings()
        settings_obj = SiteSettings.objects.first()
        serializer = self.get_serializer(settings_obj, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


def ensure_default_payment_config():
    """Ensure default PaymentConfig singleton exists"""
    if PaymentConfig.objects.count() == 0:
        PaymentConfig.objects.create(
            bank_name="Global IME Bank Ltd.",
            account_name="GENZICON FOUNDATION NEPAL",
            account_number="01201010009823",
            branch="Putalisadak Central Branch, Kathmandu",
            swift_code="GLBBNPKA",
            fonepay_merchant_name="GENZICON FOUNDATION NEPAL",
            fonepay_qr_url="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226500010np.fonepay01180120101000982302069823005204000053035245802NP5925GENZICON+FOUNDATION+NEP6009Kathmandu",
            esewa_id="9823000000 / genzicon.esewa",
            esewa_registered_name="Genzicon Foundation Nepal",
            esewa_qr_url="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=esewa://transfer?id=9823000000&name=GenziconFoundation",
            khalti_id="9823000000",
            khalti_registered_name="Genzicon Foundation Nepal",
            khalti_qr_url="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=khalti://pay?id=9823000000",
            hotline_phone="+977 1-4240000 / 9823000000",
            hotline_email="donate@genzicon.org"
        )


class PaymentConfigViewSet(viewsets.ModelViewSet):
    queryset = PaymentConfig.objects.all()
    serializer_class = PaymentConfigSerializer
    authentication_classes = [CsrfExemptSessionAuthentication, TokenAuthentication]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]  # Seamless save from Admin tab

    def list(self, request, *args, **kwargs):
        ensure_default_payment_config()
        config = PaymentConfig.objects.first()
        serializer = self.get_serializer(config, context={'request': request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        ensure_default_payment_config()
        config = PaymentConfig.objects.first()
        serializer = self.get_serializer(config, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


