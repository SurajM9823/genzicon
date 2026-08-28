from rest_framework import serializers
from .models import (
    SiteContent, ImpactStat, Project, ClothesDonor,
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry, ClothesHubConfig
)

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
        return obj.hero_image_url or "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600"

class ProjectSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_progress_percentage(self, obj):
        if obj.target_amount > 0:
            return round(min((float(obj.raised_amount) / float(obj.target_amount)) * 100, 100), 1)
        return 0

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
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['volunteer_id', 'created_at']

class DonationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationRecord
        fields = '__all__'
        read_only_fields = ['receipt_number', 'created_at']

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
