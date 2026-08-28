from django.contrib import admin
from .models import (
    SiteContent, ImpactStat, Project, 
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry
)

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('hero_title', 'hero_banner_tag', 'updated_at')

@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    list_display = ('number', 'label', 'label_np', 'order')
    list_editable = ('order',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'district', 'province', 'status', 'raised_amount', 'target_amount', 'is_featured')
    list_filter = ('status', 'province', 'category', 'is_featured')
    search_fields = ('title', 'district', 'description')

@admin.register(ClothesDonation)
class ClothesDonationAdmin(admin.ModelAdmin):
    list_display = ('ref_id', 'donor_name', 'phone', 'district', 'approx_items_count', 'donation_mode', 'status', 'pickup_date')
    list_filter = ('status', 'donation_mode', 'province')
    search_fields = ('ref_id', 'donor_name', 'phone', 'city')

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('volunteer_id', 'full_name', 'phone', 'district', 'province', 'interest', 'status', 'created_at')
    list_filter = ('status', 'province')
    search_fields = ('volunteer_id', 'full_name', 'phone', 'email')

@admin.register(DonationRecord)
class DonationRecordAdmin(admin.ModelAdmin):
    list_display = ('receipt_number', 'donor_name', 'amount', 'currency', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('receipt_number', 'donor_name', 'donor_phone')

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'subject', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name', 'email', 'subject', 'message')
