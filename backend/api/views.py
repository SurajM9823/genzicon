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
class SiteContentViewSet(viewsets.ModelViewSet):
    queryset = SiteContent.objects.all()
    serializer_class = SiteContentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'current']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def current(self, request):
        content = SiteContent.objects.first()
        if not content:
            content = SiteContent.objects.create()
        return Response(SiteContentSerializer(content).data)


class ImpactStatViewSet(viewsets.ModelViewSet):
    queryset = ImpactStat.objects.all()
    serializer_class = ImpactStatSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


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
