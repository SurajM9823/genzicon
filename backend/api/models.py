from django.db import models
from django.utils.crypto import get_random_string

def generate_reference_id(prefix='GZ'):
    return f"{prefix}-{get_random_string(6).upper()}"

class SiteContent(models.Model):
    """Dynamic Website CMS Hero Content & Taglines"""
    hero_title = models.CharField(max_length=255, default="Grassroots Youth-Led Transformation Across Nepal")
    hero_title_np = models.CharField(max_length=255, default="नेपालभर युवा नेतृत्वमा प्रत्यक्ष सामाजिक रूपान्तरण")
    hero_subtitle = models.TextField(default="Bridging immediate community needs through civic transparency, verified ground impact, youth volunteer taskforces, and zero administrative waste.")
    hero_subtitle_np = models.TextField(default="पारदर्शी सेवा, प्रमाणित प्रभाव, युवा स्वयंसेवक परिचालन र प्रत्यक्ष सहयोग मार्फत समुदाय सशक्तिकरण।")
    hero_image_url = models.URLField(max_length=500, default="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1600")
    hero_banner_tag = models.CharField(max_length=100, default="Grassroots Youth NGO")
    hero_banner_tag_np = models.CharField(max_length=100, default="युवा नेतृत्व गैरसरकारी संस्था")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Hero & Content"
        verbose_name_plural = "Site Hero & Content"

    def __str__(self):
        return f"Site Hero CMS (Updated: {self.updated_at.strftime('%Y-%m-%d')})"

class ImpactStat(models.Model):
    """Live Statistical Counters shown on homepage"""
    stat_id = models.CharField(max_length=50, unique=True)
    number = models.CharField(max_length=50)
    label = models.CharField(max_length=100)
    label_np = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name = "Impact Statistic"
        verbose_name_plural = "Impact Statistics"

    def __str__(self):
        return f"{self.number} - {self.label}"

class Project(models.Model):
    """Field Programs & Grassroots Projects"""
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Urgent', 'Urgent Support Required'),
        ('Completed', 'Successfully Completed'),
    ]

    title = models.CharField(max_length=255)
    title_np = models.CharField(max_length=255)
    category = models.CharField(max_length=100)  # Education, Health, Clothes Bank, Winter Relief
    district = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Active')
    target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    raised_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    beneficiaries_count = models.CharField(max_length=100)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField()
    description_np = models.TextField()
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Field Program"
        verbose_name_plural = "Field Programs"

    def __str__(self):
        return f"{self.title} ({self.district})"

class ClothesDonation(models.Model):
    """Clothes Bank Donor Pickup & Dropoff Pipeline"""
    STATUS_CHOICES = [
        ('Pending', 'Pending Review'),
        ('Scheduled', 'Pickup Scheduled'),
        ('Collected', 'Collected in Hub'),
        ('Distributed', 'Distributed to Community'),
    ]
    MODE_CHOICES = [
        ('doorstep_pickup', 'Doorstep Van Pickup'),
        ('dropoff_center', 'Drop-off at Local Hub'),
    ]

    ref_id = models.CharField(max_length=30, unique=True, default=generate_reference_id)
    donor_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True, null=True)
    province = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.TextField()
    clothes_type = models.CharField(max_length=100)
    approx_items_count = models.PositiveIntegerField(default=10)
    donation_mode = models.CharField(max_length=50, choices=MODE_CHOICES, default='doorstep_pickup')
    pickup_date = models.DateField(blank=True, null=True)
    dropoff_hub = models.CharField(max_length=150, blank=True, null=True)
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

    volunteer_id = models.CharField(max_length=30, unique=True, default=lambda: generate_reference_id('VOL'))
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

    receipt_number = models.CharField(max_length=40, unique=True, default=lambda: generate_reference_id('REC'))
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
