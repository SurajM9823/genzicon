from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Sum, Count

from .models import (
    SiteContent, ImpactStat, Project, 
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry
)
from .serializers import (
    SiteContentSerializer, ImpactStatSerializer, ProjectSerializer,
    ClothesDonationSerializer, VolunteerSerializer, DonationRecordSerializer, ContactInquirySerializer
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
            img_url = slide.hero_image.url if slide.hero_image else (slide.hero_image_url or "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600")
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

        first_img = hero_images[0] if hero_images else (first.hero_image_url or "")

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
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'title_np', 'district', 'category', 'province', 'slug']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_slug', 'adjust_donation']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

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


class ClothesDonationViewSet(viewsets.ModelViewSet):
    queryset = ClothesDonation.objects.all()
    serializer_class = ClothesDonationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['donor_name', 'phone', 'city', 'district', 'ref_id']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['full_name', 'phone', 'district', 'volunteer_id']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class DonationRecordViewSet(viewsets.ModelViewSet):
    queryset = DonationRecord.objects.all()
    serializer_class = DonationRecordSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['receipt_number', 'donor_name', 'donor_phone']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'phone', 'subject']

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
