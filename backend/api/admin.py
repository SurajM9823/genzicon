from django.contrib import admin
from .models import (
    SiteContent, ImpactStat, Project, 
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry
)

from django.utils.html import format_html

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('order', 'hero_title', 'hero_banner_tag', 'is_active', 'image_preview', 'updated_at')
    list_editable = ('order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('hero_title', 'hero_title_np', 'hero_subtitle')
    fieldsets = (
        ('Slide Visibility & Order', {
            'fields': ('is_active', 'order')
        }),
        ('English Content', {
            'fields': ('hero_banner_tag', 'hero_title', 'hero_subtitle')
        }),
        ('Nepali Content (नेपाली सामग्री)', {
            'fields': ('hero_banner_tag_np', 'hero_title_np', 'hero_subtitle_np')
        }),
        ('Slide Image (Upload Image File OR URL)', {
            'fields': ('hero_image', 'hero_image_url'),
            'description': 'You can upload an image file from your computer OR paste an image URL.'
        }),
    )

    def image_preview(self, obj):
        url = obj.hero_image.url if obj.hero_image else obj.hero_image_url
        if url:
            return format_html('<img src="{}" style="width: 70px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc;" />', url)
        return "-"
    image_preview.short_description = "Image Preview"

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
