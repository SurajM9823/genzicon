from django.contrib import admin
from django.db import models
from django.utils.html import format_html
from .models import (
    SiteContent, ImpactStat, Project, ClothesDonor,
    ClothesDonation, Volunteer, DonationRecord, ContactInquiry, ClothesHubConfig, SiteSettings
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
    list_display = ('image_preview', 'volunteer_id', 'full_name', 'phone', 'district', 'province', 'interest', 'status', 'created_at')
    list_display_links = ('volunteer_id', 'full_name')
    list_editable = ('status',)
    list_filter = ('status', 'province')
    search_fields = ('volunteer_id', 'full_name', 'phone', 'email', 'district', 'skills')
    readonly_fields = ('image_preview', 'created_at')
    fieldsets = (
        ('Volunteer Identification & Photo', {
            'fields': ('volunteer_id', 'full_name', 'status', 'photo', 'image_url', 'image_preview')
        }),
        ('Contact Details', {
            'fields': ('phone', 'email')
        }),
        ('Regional Location', {
            'fields': ('province', 'district')
        }),
        ('Pillar Track & Availability', {
            'fields': ('interest', 'availability')
        }),
        ('Experience & Background Notes', {
            'fields': ('skills', 'created_at')
        }),
    )

    def image_preview(self, obj):
        url = obj.final_image_url
        if url:
            return format_html('<img src="{}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;" />', url)
        return "-"
    image_preview.short_description = "Photo"

    def save_model(self, request, obj, form, change):
        if not change and not obj.status:
            obj.status = 'Approved'
        super().save_model(request, obj, form, change)

    def has_change_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True

@admin.register(DonationRecord)
class DonationRecordAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('receipt_preview', 'receipt_number', 'donor_preview', 'donor_name', 'amount', 'currency', 'payment_method', 'donor_address', 'status', 'created_at')
    list_display_links = ('receipt_number', 'donor_name')
    list_editable = ('status',)
    list_filter = ('status', 'payment_method', 'currency')
    search_fields = ('receipt_number', 'donor_name', 'donor_phone', 'donor_email', 'donor_address')
    readonly_fields = ('receipt_preview', 'donor_preview', 'created_at')
    fieldsets = (
        ('Donation Details', {
            'fields': ('receipt_number', 'amount', 'currency', 'payment_method', 'status', 'project_name', 'is_public')
        }),
        ('Donor Identification', {
            'fields': ('donor_name', 'donor_phone', 'donor_email', 'donor_address', 'donor_photo', 'donor_photo_url', 'donor_preview')
        }),
        ('Payment Slip / Bank Transfer Receipt', {
            'fields': ('payment_slip', 'payment_slip_url', 'receipt_preview', 'note', 'created_at')
        }),
    )

    def receipt_preview(self, obj):
        url = obj.final_payment_slip_url
        if url:
            return format_html('<a href="{}" target="_blank"><img src="{}" style="max-height: 42px; border-radius: 3px; border: 1px solid #003c90;" /></a>', url, url)
        return "-"
    receipt_preview.short_description = "Slip / Receipt"

    def donor_preview(self, obj):
        url = obj.final_donor_photo_url
        if url:
            return format_html('<img src="{}" style="width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid #ddd;" />', url)
        return "-"
    donor_preview.short_description = "Avatar"

    def save_model(self, request, obj, form, change):
        if not change and not obj.status:
            obj.status = 'Verified'
        super().save_model(request, obj, form, change)

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

from django import forms

class ClothesHubConfigAdminForm(forms.ModelForm):
    google_maps_directions_url = forms.CharField(
        widget=forms.TextInput(attrs={
            'style': 'width: 100%; max-width: 750px; padding: 6px 10px; font-size: 13px;',
            'placeholder': 'Paste Google Maps link (e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=...)'
        }),
        required=False,
        label="Google Maps Location Link",
        help_text="Paste your Google Maps share link here (e.g. https://maps.app.goo.gl/...)."
    )

    class Meta:
        model = ClothesHubConfig
        fields = [
            'hub_name', 'hub_name_np',
            'phone1', 'phone2', 'email',
            'address', 'address_np', 'landmark', 'landmark_np', 'city', 'district', 'province',
            'operating_hours', 'operating_hours_np',
            'google_maps_directions_url',
            'contact_note', 'contact_note_np'
        ]

    def clean_google_maps_directions_url(self):
        url = self.cleaned_data.get('google_maps_directions_url', '') or ''
        trimmed = url.strip()
        if '<iframe' in trimmed.lower():
            import re
            match = re.search(r'src=["\']([^"\']+)["\']', trimmed, re.IGNORECASE)
            if match:
                trimmed = match.group(1)
        return trimmed

@admin.register(ClothesHubConfig)
class ClothesHubConfigAdmin(admin.ModelAdmin):
    form = ClothesHubConfigAdminForm
    save_on_top = True
    list_display = ('hub_name', 'phone1', 'phone2', 'city', 'operating_hours', 'updated_at')
    readonly_fields = ('updated_at',)
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
        ('Google Maps Link', {
            'fields': ('google_maps_directions_url',),
            'description': 'Paste your Google Maps link (e.g. https://maps.app.goo.gl/... or https://maps.google.com/?q=...)'
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


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    save_on_top = True
    list_display = ('org_name', 'head_office_phone', 'whatsapp_number', 'facebook_url', 'logo_preview', 'updated_at')
    readonly_fields = ('logo_preview', 'updated_at')
    fieldsets = (
        ('Organization Identity & Official Logo', {
            'fields': (
                'org_name', 'org_name_np',
                'tagline', 'tagline_np',
                'logo', 'logo_url', 'logo_preview',
                'about_text', 'about_text_np'
            ),
            'description': 'Upload your official Genzicon Foundation logo (file or URL) to appear in the Navbar and Footer.'
        }),
        ('Central Head Office (Kathmandu)', {
            'fields': (
                'head_office_title', 'head_office_title_np',
                'head_office_subtitle', 'head_office_subtitle_np',
                'head_office_address', 'head_office_address_np',
                'head_office_phone', 'head_office_email',
                'head_office_hours', 'head_office_hours_np'
            )
        }),
        ('Madhesh Regional Office (Janakpur)', {
            'fields': (
                'regional_office_title', 'regional_office_title_np',
                'regional_office_subtitle', 'regional_office_subtitle_np',
                'regional_office_address', 'regional_office_address_np',
                'regional_office_phone', 'regional_office_email',
                'regional_office_hours', 'regional_office_hours_np'
            )
        }),
        ('Direct Clothes Donation Help & Urgent Hotline', {
            'fields': (
                'hotline_title', 'hotline_title_np',
                'hotline_phone',
                'hotline_text', 'hotline_text_np'
            )
        }),
        ('Social Media Links & Floating Action Buttons', {
            'fields': (
                'whatsapp_number', 'whatsapp_message',
                'facebook_url', 'instagram_url', 'youtube_url',
                'linkedin_url', 'twitter_url'
            ),
            'description': 'Configure the WhatsApp Number and Facebook Page link used by the floating quick connect buttons.'
        }),
        ('Footer Offices Summary & System Timestamps', {
            'fields': (
                'footer_offices_summary', 'footer_offices_summary_np',
                'updated_at'
            )
        }),
    )

    def logo_preview(self, obj):
        url = obj.final_logo_url
        if url:
            return format_html('<img src="{}" style="max-height: 48px; max-width: 140px; object-fit: contain; background: #111c2d; padding: 4px; border-radius: 4px;" />', url)
        return "No Logo Set (Using Default Icon)"
    logo_preview.short_description = "Logo Preview"

    def has_change_permission(self, request, obj=None):
        return True

    def has_add_permission(self, request):
        # Only allow 1 singleton instance
        if SiteSettings.objects.count() >= 1:
            return False
        return True

    def has_delete_permission(self, request, obj=None):
        return False



