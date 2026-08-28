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


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'district', 'category', 'province']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


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
