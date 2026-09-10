from django.contrib import admin
from django.db import models
from django.utils.html import format_html
from .models import (
    SiteContent, ImpactStat, Project, ClothesDonor,
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry, ClothesHubConfig
)

@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('order', 'hero_title', 'hero_banner_tag', 'is_active', 'media_preview', 'updated_at')
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
        ('Slide Background Media (Upload Image File OR Paste Rive / Media URL)', {
            'fields': ('hero_image', 'hero_image_url'),
            'description': 'Upload an image file (PNG/JPG/WEBP) from your device OR paste an Image URL, Rive Animation link (e.g. https://rive.app/s/...), or .riv URL.'
        }),
    )

    def has_change_permission(self, request, obj=None):
        return True

    def media_preview(self, obj):
        url = obj.hero_image.url if obj.hero_image else (obj.hero_image_url or "")
        if not url:
            return "-"
        
        # Check if Rive animation
        if 'rive.app' in url.lower() or url.lower().endswith('.riv') or '.riv?' in url.lower():
            embed_url = url
            if 'rive.app/s/' in url and not url.endswith('/embed'):
                embed_url = url.rstrip('/') + '/embed'
            return format_html(
                '<div style="display:inline-flex; align-items:center; gap:4px; padding:4px 8px; background:#f3e8ff; border:1px solid #d8b4fe; border-radius:4px; font-size:11px; font-weight:bold; color:#6b21a8;">'
                '<span style="background:#9333ea; color:white; padding:1px 4px; border-radius:3px; font-size:9px;">RIVE</span> '
                '<a href="{}" target="_blank" style="color:#6b21a8; text-decoration:underline;">Animation Preview &nearr;</a>'
                '</div>',
                embed_url
            )
        
        return format_html('<img src="{}" style="width: 70px; height: 42px; object-fit: cover; border-radius: 6px; border: 1px solid #ccc;" />', url)
    
    media_preview.short_description = "Media / Rive Preview"

@admin.register(ImpactStat)
class ImpactStatAdmin(admin.ModelAdmin):
    save_on_top = True
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

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
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

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(ClothesDonor)
class ClothesDonorAdmin(admin.ModelAdmin):
    save_on_top = True
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

    def has_change_permission(self, request, obj=None):
        return True

    def image_preview(self, obj):
        url = obj.final_image_url
        if url:
            return format_html('<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />', url)
        return "-"
    image_preview.short_description = "Avatar"

@admin.register(ClothesDonation)
class ClothesDonationAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('ref_id', 'donor_name', 'phone', 'district', 'approx_items_count', 'donation_mode', 'status', 'pickup_date')
    list_filter = ('status', 'donation_mode', 'province')
    search_fields = ('ref_id', 'donor_name', 'phone', 'city')

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('volunteer_id', 'full_name', 'phone', 'district', 'province', 'interest', 'status', 'created_at')
    list_filter = ('status', 'province')
    search_fields = ('volunteer_id', 'full_name', 'phone', 'email')

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(DonationRecord)
class DonationRecordAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('receipt_number', 'donor_name', 'amount', 'currency', 'payment_method', 'status', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('receipt_number', 'donor_name', 'donor_phone')

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('name', 'email', 'phone', 'subject', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name', 'email', 'subject', 'message')

    def has_change_permission(self, request, obj=None):
        return True

@admin.register(ClothesHubConfig)
class ClothesHubConfigAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('hub_name', 'phone1', 'phone2', 'city', 'operating_hours', 'updated_at')
    readonly_fields = ('updated_at', 'live_map_preview')
    formfield_overrides = {
        models.TextField: {
            'widget': admin.widgets.AdminTextareaWidget(
                attrs={
                    'rows': 3,
                    'style': 'width: 100%; max-width: 780px; font-family: monospace; font-size: 12px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;',
                    'placeholder': 'Paste Google Maps <iframe src="..."> code or direct https://www.google.com/maps/embed?... URL here'
                }
            )
        },
    }
    fieldsets = (
        ('Hub Identity & Names', {
            'fields': ('hub_name', 'hub_name_np')
        }),
        ('Contact Phones (At least 2 numbers)', {
            'fields': ('phone1', 'phone2', 'email')
        }),
        ('Location & Receiving Address', {
            'fields': ('address', 'address_np', 'landmark', 'landmark_np', 'city', 'district', 'province')
        }),
        ('Operating Hours', {
            'fields': ('operating_hours', 'operating_hours_np')
        }),
        ('Google Maps Embed & Directions', {
            'fields': ('map_embed_url', 'live_map_preview', 'google_maps_directions_url'),
            'description': 'Paste Google Maps <iframe> code, direct embed link, or location URL into the box below.'
        }),
        ('Rider & Parcel Delivery Instructions', {
            'fields': ('contact_note', 'contact_note_np')
        }),
        ('System Timestamps', {
            'fields': ('updated_at',),
            'classes': ('collapse',)
        }),
    )

    def has_change_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

    def live_map_preview(self, obj):
        if not obj or not obj.map_embed_url:
            return "No Google Maps embed URL entered yet."
        url = obj.map_embed_url.strip()
        if '<iframe' in url.lower():
            import re
            match = re.search(r'src=["\']([^"\']+)["\']', url, re.IGNORECASE)
            if match:
                url = match.group(1)
        return format_html(
            '<div style="max-width: 650px; height: 240px; border-radius: 8px; overflow: hidden; border: 2px solid #003c90; margin-top: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">'
            '<iframe src="{}" width="100%" height="100%" style="border:0;" allowfullscreen loading="lazy"></iframe>'
            '</div>',
            url
        )
    live_map_preview.short_description = "Live Google Maps Embed Preview"

