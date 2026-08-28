from django.db import models
from django.utils.crypto import get_random_string
from django.utils import timezone

def generate_reference_id(prefix='GZ'):
    return f"{prefix}-{get_random_string(6).upper()}"

def generate_volunteer_id():
    return f"VOL-{get_random_string(6).upper()}"

def generate_receipt_number():
    return f"REC-{get_random_string(6).upper()}"

class SiteContent(models.Model):
    """Dynamic Website CMS Hero Content & Carousel Slides"""
    hero_title = models.CharField(max_length=255, default="Grassroots Youth-Led Transformation Across Nepal", verbose_name="Hero Title (English)")
    hero_title_np = models.CharField(max_length=255, default="नेपालभर युवा नेतृत्वमा प्रत्यक्ष सामाजिक रूपान्तरण", verbose_name="Hero Title (Nepali)")
    hero_subtitle = models.TextField(default="Bridging immediate community needs through civic transparency, verified ground impact, youth volunteer taskforces, and zero administrative waste.", verbose_name="Subtitle (English)")
    hero_subtitle_np = models.TextField(default="पारदर्शी सेवा, प्रमाणित प्रभाव, युवा स्वयंसेवक परिचालन र प्रत्यक्ष सहयोग मार्फत समुदाय सशक्तिकरण।", verbose_name="Subtitle (Nepali)")
    
    # Image upload OR external URL
    hero_image = models.ImageField(upload_to='hero_slides/', blank=True, null=True, verbose_name="Upload Hero Image (File)")
    hero_image_url = models.URLField(max_length=500, default="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600", blank=True, null=True, verbose_name="Or Image URL (Unsplash / CDN)")
    
    hero_banner_tag = models.CharField(max_length=100, default="Grassroots Youth NGO", verbose_name="Badge Tag (English)")
    hero_banner_tag_np = models.CharField(max_length=100, default="युवा नेतृत्व गैरसरकारी संस्था", verbose_name="Badge Tag (Nepali)")
    
    order = models.PositiveIntegerField(default=0, verbose_name="Slide Display Order")
    is_active = models.BooleanField(default=True, verbose_name="Is Active Slide?")
    created_at = models.DateTimeField(default=timezone.now, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = "Hero Carousel Slide"
        verbose_name_plural = "Hero Carousel Slides"

    @property
    def final_image_url(self):
        if self.hero_image:
            return self.hero_image.url
        return self.hero_image_url or "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600"

    def __str__(self):
        status = "Active" if self.is_active else "Inactive"
        return f"Slide #{self.order}: {self.hero_title[:40]} [{status}]"

class ImpactStat(models.Model):
    """Live Statistical Counters shown on homepage (4 Static Impact Cards)"""
    stat_id = models.CharField(max_length=50, unique=True, verbose_name="Unique Key (e.g. clothes, green, skills, volunteers)")
    number = models.CharField(max_length=50, default="142,500+", verbose_name="Display Number (e.g. 142,500+)")
    label = models.CharField(max_length=100, default="Garments Distributed", verbose_name="Label (English)")
    label_np = models.CharField(max_length=100, blank=True, default="संकलित तथा वितरित कपडा", verbose_name="Label (Nepali)")
    description = models.TextField(blank=True, default="Wearable clothes collected, sorted, cleaned, and handed over to families in need across Nepal.", verbose_name="Description (English)")
    description_np = models.TextField(blank=True, default="नेपालभरिका विपन्न परिवार, बालबालिका तथा वृद्धवृद्धालाई निःशुल्क वितरित उपयोगी कपडा।", verbose_name="Description (Nepali)")
    color = models.CharField(max_length=20, default='primary', choices=[('primary', 'Primary (Blue)'), ('secondary', 'Secondary (Green)')], verbose_name="Accent Color")
    order = models.PositiveIntegerField(default=0, verbose_name="Display Order")

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Impact Statistic"
        verbose_name_plural = "Impact Statistics"

    def __str__(self):
        return f"#{self.order} {self.number} - {self.label} [{self.stat_id}]"

class Project(models.Model):
    """Field Programs & Grassroots Projects"""
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Urgent', 'Urgent Support Required'),
        ('Completed', 'Successfully Completed'),
    ]

    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True, verbose_name="SEO URL Slug (e.g. winter-clothes-drive-terai)")
    title = models.CharField(max_length=255, verbose_name="Title (English)")
    title_np = models.CharField(max_length=255, blank=True, verbose_name="Title (Nepali)")
    category = models.CharField(max_length=100, default='Clothes Bank Nepal', verbose_name="Category")
    category_np = models.CharField(max_length=100, blank=True, default='कपडा बैंक नेपाल', verbose_name="Category (Nepali)")
    district = models.CharField(max_length=100, default='Kathmandu', verbose_name="District")
    province = models.CharField(max_length=100, default='Bagmati Province', verbose_name="Province")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Active', verbose_name="Operational Status")
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=500000.00, verbose_name="Target Goal (NPR)")
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="Donations Raised (NPR)")
    donor_count = models.PositiveIntegerField(default=0, verbose_name="Verified Donor Count")
    beneficiaries_count = models.CharField(max_length=100, default='1,000+ Citizens', verbose_name="Beneficiaries Reached")
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Hero Image URL")
    description = models.TextField(verbose_name="Short Summary (English)")
    description_np = models.TextField(blank=True, verbose_name="Short Summary (Nepali)")
    full_description = models.TextField(blank=True, verbose_name="Full Story / Operational Goals (English)")
    full_description_np = models.TextField(blank=True, verbose_name="Full Story / Operational Goals (Nepali)")
    is_featured = models.BooleanField(default=True, verbose_name="Featured on Homepage")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-created_at']
        verbose_name = "Field Program"
        verbose_name_plural = "Field Programs"

    def save(self, *args, **kwargs):
        if not self.slug:
            import re
            base = re.sub(r'[^a-zA-Z0-9\s-]', '', self.title).strip().lower()
            candidate = re.sub(r'[\s]+', '-', base)
            if not candidate:
                candidate = f"program-{uuid.uuid4().hex[:6]}"
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} [{self.district}] (रू {self.raised_amount} / रू {self.target_amount})"

class ClothesDonor(models.Model):
    """Dynamic Clothes Bank Donors for Gratitude Wall / Showcase"""
    name = models.CharField(max_length=150, verbose_name="Donor Name")
    name_np = models.CharField(max_length=150, blank=True, null=True, verbose_name="Donor Name (Nepali)")
    location = models.CharField(max_length=150, default="Kathmandu", verbose_name="Location / City")
    location_np = models.CharField(max_length=150, blank=True, null=True, verbose_name="Location (Nepali)")
    items_count = models.PositiveIntegerField(default=25, verbose_name="Garments Donated Count")
    clothes_type = models.CharField(max_length=150, default="Winter Wear & Jackets", verbose_name="Clothes Category")
    clothes_type_np = models.CharField(max_length=150, blank=True, null=True, verbose_name="Clothes Category (Nepali)")
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="Donor Photo / Avatar URL")
    donor_image = models.ImageField(upload_to='clothes_donors/', blank=True, null=True, verbose_name="Upload Donor Photo")
    note = models.TextField(blank=True, null=True, verbose_name="Donor Quote / Note")
    note_np = models.TextField(blank=True, null=True, verbose_name="Donor Quote (Nepali)")
    date = models.DateField(default=timezone.now, verbose_name="Donation Date")
    is_verified = models.BooleanField(default=True, verbose_name="Verified Donation")
    is_featured = models.BooleanField(default=True, verbose_name="Featured on Sliding Wall")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = "Clothes Donor"
        verbose_name_plural = "Clothes Donors"

    @property
    def final_image_url(self):
        if self.donor_image:
            return self.donor_image.url
        return self.image_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400"

    def __str__(self):
        return f"{self.name} ({self.location}) - {self.items_count} pcs"

class ClothesDonation(models.Model):
    """Clothes Bank Donor Dropoff & Parcel Pipeline"""
    STATUS_CHOICES = [
        ('Pending', 'Pending / In Transit'),
        ('Received', 'Received at Central Hub'),
        ('Sanitized', 'Sanitized & Sorted'),
        ('Distributed', 'Distributed to Community'),
    ]
    MODE_CHOICES = [
        ('dropoff_hub', 'Self Drop-off at Genzicon Hub'),
        ('courier_parcel', 'Courier / Pathao / Bus Parcel'),
        ('doorstep_pickup', 'Doorstep Van Pickup (Legacy)'),
    ]

    ref_id = models.CharField(max_length=30, unique=True, default=generate_reference_id)
    donor_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True, null=True)
    province = models.CharField(max_length=100, default="Bagmati Province")
    district = models.CharField(max_length=100, default="Kathmandu")
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    clothes_type = models.CharField(max_length=100, default="winter")
    approx_items_count = models.PositiveIntegerField(default=10)
    donation_mode = models.CharField(max_length=50, choices=MODE_CHOICES, default='dropoff_hub')
    pickup_date = models.DateField(blank=True, null=True)
    dropoff_hub = models.CharField(max_length=150, blank=True, null=True, default="Genzicon Central Hub, Tinkune, Kathmandu")
    notes = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Clothes Donation Request"
        verbose_name_plural = "Clothes Donation Requests"

    def __str__(self):
        return f"{self.ref_id} - {self.donor_name} ({self.approx_items_count} pcs)"

class Volunteer(models.Model):
    """Youth Volunteer Network Submissions"""
    STATUS_CHOICES = [
        ('Pending', 'Pending Review'),
        ('Approved', 'Approved Active Volunteer'),
        ('Contacted', 'Contacted by Field Lead'),
    ]

    volunteer_id = models.CharField(max_length=30, unique=True, default=generate_volunteer_id)
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    province = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    interest = models.CharField(max_length=150)
    availability = models.CharField(max_length=100)
    skills = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Youth Volunteer"
        verbose_name_plural = "Youth Volunteers"

    def __str__(self):
        return f"{self.volunteer_id} - {self.full_name} ({self.district})"

class DonationRecord(models.Model):
    """Monetary Donations & QR Bank Slips Ledger"""
    STATUS_CHOICES = [
        ('Verified', 'Verified by Finance'),
        ('Pending', 'Pending Bank Statement Slip Confirmation'),
        ('Failed', 'Cancelled / Failed'),
    ]

    receipt_number = models.CharField(max_length=40, unique=True, default=generate_receipt_number)
    donor_name = models.CharField(max_length=150)
    donor_email = models.EmailField(blank=True, null=True)
    donor_phone = models.CharField(max_length=30, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='NPR')
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    project_name = models.CharField(max_length=255, blank=True, null=True)
    payment_method = models.CharField(max_length=50)  # fonepay_qr, bank_transfer, esewa, cash
    frequency = models.CharField(max_length=20, default='one-time')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Donation Record"
        verbose_name_plural = "Donation Records"

    def __str__(self):
        return f"{self.receipt_number} - {self.donor_name} (रू {self.amount})"

class ContactInquiry(models.Model):
    """Citizen Questions & Partnership Inquiries"""
    STATUS_CHOICES = [
        ('New', 'New / Unread'),
        ('Replied', 'Replied'),
        ('Resolved', 'Resolved'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, null=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='New')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Inquiry"
        verbose_name_plural = "Contact Inquiries"

    def __str__(self):
        return f"{self.name} - {self.subject}"
