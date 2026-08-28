from rest_framework import serializers
from .models import (
    SiteContent, ImpactStat, Project, 
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry
)

class ImpactStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactStat
        fields = '__all__'

class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_progress_percentage(self, obj):
        if obj.target_amount > 0:
            return round(min((float(obj.raised_amount) / float(obj.target_amount)) * 100, 100), 1)
        return 0

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
