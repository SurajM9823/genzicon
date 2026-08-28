from django.contrib import admin
from .models import (
    SiteContent, ImpactStat, Project, ClothesDonor,
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry
)

from django.utils.html import format_html

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('order', 'hero_title', 'hero_banner_tag', 'is_active', 'image_preview', 'updated_at')
    list_display_links = ('hero_title',)
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
    list_display = ('order', 'stat_id', 'number', 'label', 'label_np', 'color')
    list_display_links = ('number', 'label')
    list_editable = ('order', 'color')
    search_fields = ('stat_id', 'number', 'label', 'label_np', 'description')
    fieldsets = (
        ('Identification & Position', {
            'fields': ('stat_id', 'order', 'color')
        }),
        ('Metric & Labels', {
            'fields': ('number', 'label', 'label_np')
        }),
        ('Detailed Descriptions', {
            'fields': ('description', 'description_np')
        }),
    )

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'district', 'raised_amount', 'target_amount', 'donor_count', 'status', 'is_featured', 'created_at')
    list_editable = ('raised_amount', 'target_amount', 'donor_count', 'status', 'is_featured')
    list_filter = ('status', 'category', 'province', 'is_featured')
    search_fields = ('title', 'title_np', 'district', 'province', 'slug', 'description')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Basic Information & SEO', {
            'fields': ('title', 'title_np', 'slug', 'category', 'category_np', 'is_featured')
        }),
        ('Location & Outreach', {
            'fields': ('district', 'province', 'beneficiaries_count')
        }),
        ('Donation Goals & Live Tracking', {
            'fields': ('target_amount', 'raised_amount', 'donor_count', 'status')
        }),
        ('Media & Visuals', {
            'fields': ('image_url',)
        }),
        ('Story & Operational Detail', {
            'fields': ('description', 'description_np', 'full_description', 'full_description_np')
        }),
    )

@admin.register(ClothesDonor)
class ClothesDonorAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'items_count', 'clothes_type', 'date', 'is_verified', 'is_featured', 'image_preview')
    list_editable = ('items_count', 'is_verified', 'is_featured')
    list_filter = ('is_verified', 'is_featured', 'clothes_type')
    search_fields = ('name', 'name_np', 'location', 'location_np', 'clothes_type', 'note')
    fieldsets = (
        ('Donor Profile', {
            'fields': ('name', 'name_np', 'location', 'location_np', 'date')
        }),
        ('Contribution Details', {
            'fields': ('items_count', 'clothes_type', 'clothes_type_np', 'note', 'note_np')
        }),
        ('Photo / Avatar (Upload OR URL)', {
            'fields': ('donor_image', 'image_url')
        }),
        ('Display Settings', {
            'fields': ('is_verified', 'is_featured')
        })
    )

    def image_preview(self, obj):
        url = obj.final_image_url
        if url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />', url)
        return "-"
    image_preview.short_description = "Avatar"

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
