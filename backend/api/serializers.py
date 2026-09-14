from rest_framework import serializers
from .models import (
    SiteContent, ImpactStat, FilmstripScene, Project, ClothesDonor,
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry, ClothesHubConfig, SiteSettings,
    PaymentConfig
)

class FilmstripSceneSerializer(serializers.ModelSerializer):
    final_image_url = serializers.SerializerMethodField()

    class Meta:
        model = FilmstripScene
        fields = '__all__'

    def get_final_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1400&q=85"

class ImpactStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactStat
        fields = '__all__'

class SiteContentSerializer(serializers.ModelSerializer):
    final_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteContent
        fields = '__all__'

    def get_final_image_url(self, obj):
        request = self.context.get('request')
        if obj.hero_image:
            if request is not None:
                return request.build_absolute_uri(obj.hero_image.url)
            return obj.hero_image.url
        return obj.hero_image_url or "https://genzicon.com/media/hero_slides/ChatGPT_Image_Sep_7_2026_10_26_42_PM_xY6nbh0.avif"

class ProjectSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()
    final_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_progress_percentage(self, obj):
        if obj.target_amount > 0:
            return round(min((float(obj.raised_amount) / float(obj.target_amount)) * 100, 100), 1)
        return 0

    def get_final_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200"

class ClothesDonorSerializer(serializers.ModelSerializer):
    final_image_url = serializers.SerializerMethodField()

    class Meta:
        model = ClothesDonor
        fields = '__all__'

    def get_final_image_url(self, obj):
        request = self.context.get('request')
        if obj.donor_image:
            if request is not None:
                return request.build_absolute_uri(obj.donor_image.url)
            return obj.donor_image.url
        return obj.image_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400"

class ClothesDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesDonation
        fields = '__all__'
        read_only_fields = ['ref_id', 'created_at']

class VolunteerSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    final_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['volunteer_id', 'created_at']

    def validate_image_url(self, value):
        if not value:
            return ""
        # If client sends base64 data URL, ignore it so it doesn't fail URL validation
        if value.startswith("data:"):
            return ""
        return value[:500]

    def get_final_image_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            if request is not None:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return obj.image_url or ""

class DonationRecordSerializer(serializers.ModelSerializer):
    donor_photo_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    payment_slip_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    final_donor_photo_url = serializers.SerializerMethodField()
    final_payment_slip_url = serializers.SerializerMethodField()

    class Meta:
        model = DonationRecord
        fields = '__all__'
        read_only_fields = ['receipt_number', 'created_at']

    def validate_donor_photo_url(self, value):
        if not value:
            return ""
        if value.startswith("data:"):
            return ""
        return value[:500]

    def validate_payment_slip_url(self, value):
        if not value:
            return ""
        if value.startswith("data:"):
            return ""
        return value[:500]

    def get_final_donor_photo_url(self, obj):
        request = self.context.get('request')
        if obj.donor_photo:
            if request is not None:
                return request.build_absolute_uri(obj.donor_photo.url)
            return obj.donor_photo.url
        return obj.donor_photo_url or ""

    def get_final_payment_slip_url(self, obj):
        request = self.context.get('request')
        if obj.payment_slip:
            if request is not None:
                return request.build_absolute_uri(obj.payment_slip.url)
            return obj.payment_slip.url
        return obj.payment_slip_url or ""

class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInquiry
        fields = '__all__'
        read_only_fields = ['created_at']

class ClothesHubConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothesHubConfig
        fields = '__all__'
        read_only_fields = ['updated_at']

class SiteSettingsSerializer(serializers.ModelSerializer):
    final_logo_url = serializers.SerializerMethodField()
    logo_url = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = SiteSettings
        fields = '__all__'
        read_only_fields = ['updated_at']

    def validate_logo_url(self, value):
        if not value:
            return ""
        if value.startswith("data:"):
            return ""
        return value[:500]

    def get_final_logo_url(self, obj):
        request = self.context.get('request')
        if obj.logo:
            if request is not None:
                return request.build_absolute_uri(obj.logo.url)
            return obj.logo.url
        return obj.logo_url or ""


class PaymentConfigSerializer(serializers.ModelSerializer):
    final_fonepay_qr_url = serializers.SerializerMethodField()
    final_esewa_qr_url = serializers.SerializerMethodField()
    final_khalti_qr_url = serializers.SerializerMethodField()

    class Meta:
        model = PaymentConfig
        fields = '__all__'
        read_only_fields = ['updated_at']

    def get_final_fonepay_qr_url(self, obj):
        request = self.context.get('request')
        if obj.fonepay_qr:
            if request is not None:
                return request.build_absolute_uri(obj.fonepay_qr.url)
            return obj.fonepay_qr.url
        return obj.fonepay_qr_url or ""

    def get_final_esewa_qr_url(self, obj):
        request = self.context.get('request')
        if obj.esewa_qr:
            if request is not None:
                return request.build_absolute_uri(obj.esewa_qr.url)
            return obj.esewa_qr.url
        return obj.esewa_qr_url or ""

    def get_final_khalti_qr_url(self, obj):
        request = self.context.get('request')
        if obj.khalti_qr:
            if request is not None:
                return request.build_absolute_uri(obj.khalti_qr.url)
            return obj.khalti_qr.url
        return obj.khalti_qr_url or ""

