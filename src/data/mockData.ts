import { 
  Project, 
  StatMetric, 
  TeamMember, 
  PillarData,
  DropoffHub,
  ClothesDonor,
  ClothesDonationRequest,
  ClothesAssistanceRequest,
  DonationRecord, 
  VolunteerRecord,
  SiteContentConfig,
  BankAndQrConfig,
  ContactMessage
} from '../types';


export const PILLARS_DATA: PillarData[] = [
  {
    id: 'clothes-bank',
    key: 'people',
    title: 'Clothes Bank Nepal',
    titleNp: 'कपडा बैंक नेपाल',
    subtitle: 'Genzicon for People • Generosity in Action',
    subtitleNp: 'जेन्जिकन जनसेवा • पुराना तथा उपयोगी कपडा संकलन र न्यानो वितरण',
    badge: 'Pillar 01: People',
    badgeNp: 'स्तम्भ १: जनसेवा',
    description: 'We collect clean, usable pre-loved clothes from households, schools, and offices across Nepal. Our dedicated team sorts, cleans, repairs, and delivers them with dignity to cold-wave victims, remote mountain villages, underprivileged children, and flood-affected families.',
    descriptionNp: 'नेपालभरिका नागरिक तथा संघ-संस्थाबाट प्रयोगयोग्य कपडा संकलन गरी छनोट, सफाइ र प्याकिङ गरेर तराईका मुसहर बस्ती, हिमाली विकट गाउँ, अनाथालय तथा बाढी-शीतलहर पीडितलाई सम्मानपूर्वक निःशुल्क वितरण गर्दछौँ।',
    highlights: [
      'Doorstep pickup and permanent Drop-off Hubs across major cities in Nepal',
      'Hygiene check, washing, repair, and seasonal sorting (Winter, Summer, Kids, Blankets)',
      'Free distribution drives with full photographic verification and local community dignity',
      'Over 140,000 garments distributed to 28,000+ vulnerable families'
    ],
    highlightsNp: [
      'काठमाडौँ, ललितपुर, भक्तपुर, जनकपुर, पोखरा लगायत सहरहरूमा संकलन केन्द्र तथा होम पिकअप',
      'कपडाको गुणस्तर जाँच, धुलाई, मर्मत र उमेर/मौसम अनुसार व्यवस्थित प्याकिङ',
      'तराईका शीतलहर प्रभावित बस्ती, विकट हिमाली विद्यालय तथा विपद् क्षेत्रमा निःशुल्क वितरण',
      'हालसम्म १ लाख ४० हजारभन्दा बढी कपडा २८,०००+ विपन्न परिवारलाई हस्तान्तरण'
    ],
    metrics: [
      { value: '142,500+', label: 'Garments Distributed', labelNp: 'कपडा वितरण' },
      { value: '28,400+', label: 'Families Warmed', labelNp: 'लाभान्वित परिवार' },
      { value: '34 Hubs', label: 'Drop-off Centers', labelNp: 'संकलन केन्द्रहरू' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'clean-green-nepal',
    key: 'nature',
    title: 'Clean Nepal, Green Nepal',
    titleNp: 'सफा नेपाल, हरित नेपाल',
    subtitle: 'Genzicon for Nature • Climate Action & Clean Communities',
    subtitleNp: 'जेन्जिकन प्रकृति • वातावरण संरक्षण, सरसफाइ तथा वृक्षारोपण',
    badge: 'Pillar 02: Nature',
    badgeNp: 'स्तम्भ २: प्रकृति संरक्षण',
    description: 'Spearheading mass native tree plantations across vulnerable Chure foothills, urban green zones, and riverbanks. Mobilizing youth brigades for plastic-free river cleanups, school environmental clubs, and sustainable rural waste management.',
    descriptionNp: 'चुरे संरक्षण तथा पहिरो नियन्त्रणका लागि फलफूल तथा बाँस वृक्षारोपण, बागमती र स्थानीय नदी सरसफाइ, प्लास्टिक न्यूनीकरण तथा विद्यालयहरूमा वातावरण क्लब गठनमार्फत सफा र हरियाली नेपाल निर्माण अभियान।',
    highlights: [
      '100,000+ native saplings and fruit trees planted along river corridors and Chure hills',
      'Bi-weekly community cleanup drives eliminating tons of single-use plastic waste',
      'School Eco-Clubs establishing waste segregation and environmental leadership in 77 districts',
      'Soil erosion prevention and community forestry livelihoods'
    ],
    highlightsNp: [
      'चुरे तथा नदी किनारहरूमा १ लाखभन्दा बढी फलफूल तथा स्थानीय प्रजातिका बिरुवा रोपण',
      'युवा स्वयंसेवकद्वारा नियमित नदी, सम्पदा तथा बस्ती सरसफाइ अभियान',
      'विद्यालयहरूमा वातावरण क्लब गठन र फोहोर वर्गीकरण अभ्यास',
      'भू-क्षय नियन्त्रण र हरियाली प्रवर्द्धनमा स्थानीय समुदायको सहभागिता'
    ],
    metrics: [
      { value: '86,000+', label: 'Trees Planted', labelNp: 'रोपिएका बिरुवा' },
      { value: '124+', label: 'Cleanup Drives', labelNp: 'सम्पन्न सरसफाइ' },
      { value: '48 Tonnes', label: 'Plastic Cleared', labelNp: 'संकलित फोहोर' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'skills-development',
    key: 'sustainability',
    title: 'Skills & Business Development',
    titleNp: 'दक्षता तथा उद्यमशीलता विकास',
    subtitle: 'Genzicon for Sustainable Development • Self-Reliance & Prosperity',
    subtitleNp: 'जेन्जिकन आत्मनिर्भरता • महिला तथा युवा सीप, लघु उद्यम र रोजगारी',
    badge: 'Pillar 03: Sustainable Growth',
    badgeNp: 'स्तम्भ ३: आत्मनिर्भरता',
    description: 'Transforming lives through practical vocational training: professional sewing and tailoring for marginalized women, youth digital literacy, technical trade skills, and seed toolkits so underprivileged families can launch thriving micro-enterprises and become self-reliant.',
    descriptionNp: 'विपन्न महिलाहरूलाई सिलाई-कटाई, हस्तकला तथा उद्यमशीलता तालिम, युवाहरूलाई डिजिटल साक्षरता र कम्प्युटर सीप, तथा निःशुल्क सिलाई मेसिन र बिउ पुँजी प्रदान गरी आफ्नै खुट्टामा उभिने अवसर।',
    highlights: [
      'Free 3-month certified Tailoring, Garment Making & Handicraft Courses for rural women',
      'Distribution of sewing machines and starter toolkits to graduated trainees',
      'Youth IT, computer programming, mobile repair, and digital freelancing bootcamps',
      'Market linkage and cooperative formation to sell local handmade crafts and agro-products'
    ],
    highlightsNp: [
      'विपन्न तथा एकल महिलाहरूलाई ३ महिने निःशुल्क सिलाई-कटाई र बुनाई तालिम',
      'तालिम पूरा गरेका महिलाहरूलाई निःशुल्क सिलाई मेसिन र सुरुवाती सामग्री वितरण',
      'युवाहरूका लागि कम्प्युटर साक्षरता, मोबाइल मर्मत र डिजिटल रोजगार तालिम',
      'उत्पादित सामग्रीको बजार व्यवस्थापन र लघु सहकारी स्थापना'
    ],
    metrics: [
      { value: '3,450+', label: 'Women & Youth Trained', labelNp: 'तालिम प्राप्त नागरिक' },
      { value: '880+', label: 'Sewing Machines Donated', labelNp: 'वितरित सिलाई मेसिन' },
      { value: '1,220+', label: 'Micro Businesses Born', labelNp: 'सुरु भएका साना उद्यम' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'
  }
];

export const DROPOFF_HUBS_DATA: DropoffHub[] = [
  {
    id: 'hub-ktm-putalisadak',
    name: 'Kathmandu Central Hub',
    nameNp: 'काठमाडौँ केन्द्रीय संकलन केन्द्र',
    city: 'Kathmandu',
    district: 'Kathmandu',
    address: 'Putalisadak, Ward No. 28 (Near Star Mall), Kathmandu',
    addressNp: 'पुतलीसडक, वडा नं २८ (स्टार मल नजिक), काठमाडौँ',
    phone: '+977 1-4240000 / 9823000000',
    timing: 'Sunday – Friday: 9:00 AM – 6:00 PM',
    timingNp: 'आइतबार – शुक्रबार: बिहान ९:०० – साँझ ६:००'
  },
  {
    id: 'hub-lalitpur-jawalakhel',
    name: 'Lalitpur Collection Station',
    nameNp: 'ललितपुर संकलन केन्द्र (जावलाखेल)',
    city: 'Lalitpur',
    district: 'Lalitpur',
    address: 'Jawalakhel Chowk (Opposite Zoo Road), Lalitpur',
    addressNp: 'जावलाखेल चोक, ललितपुर',
    phone: '+977 9812345678',
    timing: 'Everyday: 10:00 AM – 5:30 PM',
    timingNp: 'दैनिक: बिहान १०:०० – साँझ ५:३०'
  },
  {
    id: 'hub-bhaktapur-surya',
    name: 'Bhaktapur Drop-off Hub',
    nameNp: 'भक्तपुर संकलन केन्द्र (सूर्यविनायक)',
    city: 'Bhaktapur',
    district: 'Bhaktapur',
    address: 'Suryabinayak Chowk, Arniko Highway, Bhaktapur',
    addressNp: 'सूर्यविनायक चोक, अरनिको राजमार्ग, भक्तपुर',
    phone: '+977 9841002233',
    timing: 'Sun – Sat: 9:30 AM – 5:00 PM',
    timingNp: 'साताको सातै दिन: बिहान ९:३० – साँझ ५:००'
  },
  {
    id: 'hub-janakpur-station',
    name: 'Janakpur Madhesh Regional Hub',
    nameNp: 'जनकपुर क्षेत्रीय संकलन केन्द्र',
    city: 'Janakpurdham',
    district: 'Dhanusha',
    address: 'Station Road, Ward No. 4, Janakpurdham, Dhanusha',
    addressNp: 'स्टेशन रोड, वडा नं ४, जनकपुरधाम, धनुषा',
    phone: '+977 41-520000 / 9807100000',
    timing: 'Sunday – Friday: 8:00 AM – 6:00 PM',
    timingNp: 'आइतबार – शुक्रबार: बिहान ८:०० – साँझ ६:००'
  },
  {
    id: 'hub-pokhara-chipledhunga',
    name: 'Pokhara Gandaki Hub',
    nameNp: 'पोखरा गण्डकी संकलन केन्द्र',
    city: 'Pokhara',
    district: 'Kaski',
    address: 'Chipledhunga, Ward No. 4, Pokhara',
    addressNp: 'चिपलेढुङ्गा, वडा नं ४, पोखरा',
    phone: '+977 61-530000',
    timing: 'Sunday – Friday: 10:00 AM – 5:00 PM',
    timingNp: 'आइतबार – शुक्रबार: बिहान १०:०० – साँझ ५:००'
  },
  {
    id: 'hub-chitwan-bharatpur',
    name: 'Chitwan Drop-off Center',
    nameNp: 'चितवन संकलन केन्द्र (भरतपुर)',
    city: 'Bharatpur',
    district: 'Chitwan',
    address: 'Lions Chowk, Narayangarh - Bharatpur',
    addressNp: 'लायन्स चोक, नारायणगढ - भरतपुर',
    phone: '+977 56-521100',
    timing: 'Sunday – Saturday: 9:00 AM – 5:00 PM',
    timingNp: 'दैनिक: बिहान ९:०० – साँझ ५:००'
  }
];

export const IMPACT_STATS: StatMetric[] = [
  {
    id: 'clothes',
    number: '142,500+',
    label: 'Garments Distributed',
    labelNp: 'संकलित तथा वितरित कपडा',
    color: 'primary',
    description: 'Wearable clothes collected, sorted, cleaned, and handed over to families in need across Nepal.',
    descriptionNp: 'नेपालभरिका विपन्न परिवार, बालबालिका तथा वृद्धवृद्धालाई निःशुल्क वितरित उपयोगी कपडा।'
  },
  {
    id: 'green',
    number: '86,000+',
    label: 'Trees & Plants Planted',
    labelNp: 'रोपिएका बिरुवाहरू',
    color: 'secondary',
    description: 'Chure watershed reforestation and community greenery campaigns driven by youth volunteers.',
    descriptionNp: 'चुरे क्षेत्र तथा नदी किनारमा रोपिएका फलफूल तथा वनस्पति बिरुवा।'
  },
  {
    id: 'skills',
    number: '3,450+',
    label: 'Women & Youth Empowered',
    labelNp: 'सीप तथा उद्यमशीलता तालिम',
    color: 'primary',
    description: 'Graduates of sewing, tailoring, handicraft, and digital literacy becoming financially independent.',
    descriptionNp: 'सिलाई-कटाई, कम्प्युटर र व्यवसाय तालिमबाट आत्मनिर्भर बनेका महिला तथा युवाहरू।'
  },
  {
    id: 'volunteers',
    number: '5,800+',
    label: 'Grassroots Volunteers',
    labelNp: 'सक्रिय स्वयंसेवकहरू',
    color: 'secondary',
    description: 'Passionate youth volunteers organizing clothes collection, tree planting, and vocational camps.',
    descriptionNp: '७७ वटै जिल्लामा कपडा संकलन, सरसफाइ र तालिममा खटिएका युवाहरू।'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'clothes-bank-terai-coldwave',
    title: 'Winter Clothes & Blanket Relief Drive (Terai Cold Wave)',
    titleNp: 'तराई शीतलहर न्यानो कपडा तथा कम्बल वितरण अभियान',
    category: 'Clothes Bank Nepal',
    categoryNp: 'कपडा बैंक नेपाल (जनसेवा)',
    categoryType: 'relief',
    description: 'Collecting and delivering 25,000 warm winter jackets, sweaters, and blankets to Musahar, Dom, and impoverished Dalit settlements across Dhanusha, Mahottari, and Saptari.',
    descriptionNp: 'शीतलहरबाट प्रभावित मधेसका विपन्न मुसहर, डोम तथा गरिब परिवारका बालबालिका र वृद्धवृद्धालाई न्यानो कपडा र कम्बल वितरण।',
    fullDescription: 'Every winter, extreme cold waves in southern Nepal claim vulnerable lives due to lack of warm clothing. Clothes Bank Nepal mobilizes collection points in Kathmandu and Pokhara to gather quality winter garments, clean and pack them, and transport them directly to vulnerable rural hamlets.',
    fullDescriptionNp: 'जाडो महिनामा तराईमा चल्ने कठ्यांग्रिँदो शीतलहरमा न्यानो लुगा नभएका बालबालिका तथा ज्येष्ठ नागरिकको जीवन बचाउन हामीले काठमाडौँ र अन्य सहरबाट कपडा संकलन गरी गाउँमै पुगेर वितरण गर्दै आएका छौँ।',
    status: 'Active',
    fundedPercentage: 88,
    goalAmountNpr: 1800000,
    raisedAmountNpr: 1584000,
    goalAmountUsd: 13500,
    raisedAmountUsd: 11880,
    location: 'Dhanusha, Mahottari, Sarlahi, Saptari',
    locationNp: 'धनुषा, महोत्तरी, सर्लाही, सप्तरी (मधेस प्रदेश)',
    beneficiaries: '18,500+ Vulnerable Individuals',
    beneficiariesNp: '१८,५००+ विपन्न नागरिकहरू',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Clothes Bank donation distribution to needy families in Nepal',
    updates: [
      {
        date: 'Winter 2024',
        title: 'Distributed 6,200 Jackets in Janakpur & Hansapur',
        titleNp: 'जनकपुर र हंशपुरमा ६,२०० ज्याकेट वितरण',
        description: 'Successfully distributed warm clothes kits to 1,400 Dalit households.',
        descriptionNp: '१,४०० दलित परिवारलाई न्यानो कपडा सेट हस्तान्तरण।'
      }
    ]
  },
  {
    id: 'clean-green-nepal-chure',
    title: 'Clean Nepal, Green Nepal: 100K Tree Plantation Drive',
    titleNp: 'सफा नेपाल, हरित नेपाल: १ लाख वृक्षारोपण अभियान',
    category: 'Clean Nepal, Green Nepal',
    categoryNp: 'सफा नेपाल, हरित नेपाल (प्रकृति)',
    categoryType: 'agriculture',
    description: 'Planting native fruit trees and bamboo along vulnerable Chure slopes, community riverbanks, and public parks to prevent erosion and create green lungs.',
    descriptionNp: 'चुरे संरक्षण, नदी कटान रोकथाम र हरियाली प्रवर्द्धनका लागि स्थानीय समुदायको सहभागितामा १ लाख फलफूल तथा वनस्पति वृक्षारोपण।',
    fullDescription: 'The Chure foothills face critical deforestation and flash floods. Under Clean Nepal Green Nepal, Genzicon Foundation collaborates with rural youth clubs and community forest groups to plant mango, guava, bamboo, and medicinal trees while educating schools on environmental stewardship.',
    fullDescriptionNp: 'चुरेको दोहन रोक्न र वातावरण जोगाउन हाम्रा स्वयंसेवकहरूले आँप, अम्बा, बाँस र स्थानीय प्रजातिका बिरुवा रोप्दै विद्यालयहरूमा वातावरण क्लब गठन गरेका छन्।',
    status: 'Active',
    fundedPercentage: 76,
    goalAmountNpr: 2200000,
    raisedAmountNpr: 1672000,
    goalAmountUsd: 16500,
    raisedAmountUsd: 12540,
    location: 'Chitwan, Makwanpur, Dhanusha Chure Belt',
    locationNp: 'चितवन, मकवानपुर तथा धनुषा चुरे क्षेत्र',
    beneficiaries: '35,000+ Community Residents',
    beneficiariesNp: '३५,०००+ स्थानीय बासिन्दा',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Volunteers planting saplings for Clean Nepal Green Nepal',
    updates: [
      {
        date: 'July 2024',
        title: 'Phase 4: 25,000 Saplings Planted along Riverbank',
        titleNp: 'चौथो चरण: नदी किनारमा २५,००० बिरुवा रोपण',
        description: 'Completed monsoon plantation with 85% survival rate tracking.',
        descriptionNp: 'मनसुन वृक्षारोपण सफलतापूर्वक सम्पन्न।'
      }
    ]
  },
  {
    id: 'women-tailoring-micro-business',
    title: 'Women Tailoring & Garment Enterprise Incubator',
    titleNp: 'महिला सिलाई-कटाई तथा कपडा उत्पादन लघु उद्यमशीलता',
    category: 'Skills & Business Development',
    categoryNp: 'दक्षता तथा उद्यमशीलता (आत्मनिर्भरता)',
    categoryType: 'education',
    description: 'Providing free 3-month professional sewing training, cloth cutting, and free sewing machines to marginalized women and single mothers to earn independent income.',
    descriptionNp: 'विपन्न, एकल तथा पिछडिएका महिलाहरूलाई निःशुल्क ३ महिने सिलाई-कटाई तालिम र आफ्नै व्यवसाय सुरु गर्न निःशुल्क सिलाई मेसिन वितरण।',
    fullDescription: 'Financial independence is the most powerful tool against poverty. Our skills center equips women with modern stitching techniques, school uniform manufacturing skills, and basic bookkeeping. Each graduate receives a certified sewing machine and cloth inventory to start earning from home.',
    fullDescriptionNp: 'महिलाहरूलाई आर्थिक रूपमा आत्मनिर्भर बनाउन आधुनिक सिलाई मेसिन, कपडा कटिङ र व्यवसाय व्यवस्थापन तालिम दिइन्छ। तालिम पश्चात सबैलाई निःशुल्क सिलाई मेसिन प्रदान गरिन्छ।',
    status: 'Active',
    fundedPercentage: 92,
    goalAmountNpr: 2500000,
    raisedAmountNpr: 2300000,
    goalAmountUsd: 18750,
    raisedAmountUsd: 17250,
    location: 'Kathmandu, Janakpur, Chitwan Centers',
    locationNp: 'काठमाडौँ, जनकपुर, चितवन तालिम केन्द्रहरू',
    beneficiaries: '1,200+ Women Entrepreneurs',
    beneficiariesNp: '१,२००+ महिला उद्यमीहरू',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Rural women learning tailoring and stitching in vocational workshop',
    updates: [
      {
        date: 'August 2024',
        title: '120 Women Graduated and Received Sewing Machines',
        titleNp: '१२० महिलालाई दीक्षान्त तथा सिलाई मेसिन हस्तान्तरण',
        description: 'All 120 women launched their independent home-based tailoring services.',
        descriptionNp: 'सबै महिलाहरूले घरमै बसेर मासिक आयआर्जन सुरु गरेका छन्।'
      }
    ]
  },
  {
    id: 'clothes-bank-himalayan-schools',
    title: 'Himalayan Children Warm Clothes & School Uniform Bank',
    titleNp: 'दुर्गम हिमाली विद्यार्थी न्यानो पोशाक तथा जुत्ता वितरण',
    category: 'Clothes Bank Nepal',
    categoryNp: 'कपडा बैंक नेपाल (जनसेवा)',
    categoryType: 'relief',
    description: 'Supplying thermal innerwear, heavy sweaters, windcheaters, shoes, and school bags to children studying in sub-zero temperatures across Jumla, Humla, and Dolpa.',
    descriptionNp: 'जुम्ला, हुम्ला र डोल्पाका विकट विद्यालयमा अध्ययनरत गरिब बालबालिकालाई न्यानो कपडा, ज्याकेट, स्विटर र जुत्ता वितरण।',
    fullDescription: 'In high altitude regions of Nepal, extreme cold causes severe dropouts in schools. Clothes Bank Nepal sends curated heavy-winter packages containing thermals, woolen socks, gloves, and durable jackets directly to community schools.',
    fullDescriptionNp: 'कर्णालीका उच्च हिमाली भेगमा चिसोका कारण बालबालिका विद्यालय जानबाट वञ्चित नहोउन् भनेर हामीले न्यानो कपडा, जुत्ता र मोजा विद्यालयमै पुर्याउँछौँ।',
    status: 'Completed',
    fundedPercentage: 100,
    goalAmountNpr: 1500000,
    raisedAmountNpr: 1500000,
    goalAmountUsd: 11250,
    raisedAmountUsd: 11250,
    location: 'Jumla, Humla & Dolpa (Karnali)',
    locationNp: 'जुम्ला, हुम्ला र डोल्पा (कर्णाली प्रदेश)',
    beneficiaries: '3,800+ Himalayan Schoolchildren',
    beneficiariesNp: '३,८००+ हिमाली विद्यार्थीहरू',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'School children in remote Nepal receiving warm winter clothes',
    updates: [
      {
        date: 'May 2024',
        title: '3,800 Warm Winter Kits Delivered',
        titleNp: '३,८०० न्यानो किट हस्तान्तरण सम्पन्न',
        description: 'Successfully reached 18 remote schools before monsoon.',
        descriptionNp: '१८ वटा विकट विद्यालयमा सामान हस्तान्तरण।'
      }
    ]
  },
  {
    id: 'youth-digital-tech-skills',
    title: 'Youth Digital Skills, IT & Mobile Repair Bootcamp',
    titleNp: 'युवा डिजिटल साक्षरता, कम्प्युटर तथा प्राविधिक सीप तालिम',
    category: 'Skills & Business Development',
    categoryNp: 'दक्षता तथा उद्यमशीलता (आत्मनिर्भरता)',
    categoryType: 'education',
    description: 'Training underprivileged youth in practical computer literacy, smartphone hardware repair, digital marketing, and freelance services for immediate employment.',
    descriptionNp: 'विपन्न युवाहरूलाई कम्प्युटर साक्षरता, मोबाइल मर्मत, डिजिटल मार्केटिङ र अनलाइन रोजगार सीप तालिम।',
    fullDescription: 'Bridging the digital divide in semi-urban and rural Nepal. Youth undergo rigorous 8-week hands-on training labs, equipping them to start local repair shops, work in digital offices, or take on freelance projects.',
    fullDescriptionNp: 'मधेस र बागमतीका युवाहरूलाई सीपमूलक प्राविधिक तालिम दिएर वैदेशिक रोजगारीको सट्टा स्वदेशमै स्वरोजगार बनाउने अभियान।',
    status: 'Active',
    fundedPercentage: 84,
    goalAmountNpr: 1600000,
    raisedAmountNpr: 1344000,
    goalAmountUsd: 12000,
    raisedAmountUsd: 10080,
    location: 'Janakpurdham, Birgunj, Kathmandu',
    locationNp: 'जनकपुरधाम, वीरगन्ज र काठमाडौँ',
    beneficiaries: '850+ Youth Enrolled',
    beneficiariesNp: '८५०+ युवाहरू',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Youth learning digital technology skills in classroom',
    updates: [
      {
        date: 'July 2024',
        title: 'Batch 6 Graduation: 65 Youth Certified',
        titleNp: 'छैटौँ ब्याच: ६५ जना युवाले तालिम पूरा गरे',
        description: '42 graduates opened local mobile and electronics repair kiosks.',
        descriptionNp: '४२ जनाले आफ्नै पसल र मर्मत केन्द्र सुरु गरे।'
      }
    ]
  },
  {
    id: 'river-clean-plastic-free',
    title: 'Riverfront Cleanups & Plastic-Free Nepal Campaign',
    titleNp: 'नदी सरसफाइ तथा प्लास्टिकमुक्त नेपाल अभियान',
    category: 'Clean Nepal, Green Nepal',
    categoryNp: 'सफा नेपाल, हरित नेपाल (प्रकृति)',
    categoryType: 'agriculture',
    description: 'Mobilizing weekly volunteer taskforces to clean Bagmati, Bishnumati, and Narayani river corridors, installing dustbins and recycling plastic bottles into eco-bricks.',
    descriptionNp: 'बागमती, विष्णुमती र नारायणी नदी किनार सरसफाइ, फोहोर संकलन डस्टबिन जडान र प्लास्टिक रिसाइक्लिङ।',
    fullDescription: 'Addressing acute river pollution and urban plastic waste through community mobilization. Volunteers collect non-biodegradable trash, partner with local recyclers, and install educational signboards in pilgrimage and public areas.',
    fullDescriptionNp: 'सार्वजनिक सम्पदा र नदीहरूलाई प्लास्टिकमुक्त बनाउन हरेक शनिबार युवा स्वयंसेवकहरू फिल्डमा खटिन्छन् र संकलित फोहोरको उचित व्यवस्थापन गर्दछन्।',
    status: 'Active',
    fundedPercentage: 70,
    goalAmountNpr: 1200000,
    raisedAmountNpr: 840000,
    goalAmountUsd: 9000,
    raisedAmountUsd: 6300,
    location: 'Kathmandu Valley & Chitwan',
    locationNp: 'काठमाडौँ उपत्यका र चितवन',
    beneficiaries: '25,000+ Citizens Reached',
    beneficiariesNp: '२५,०००+ नागरिक सचेतना',
    imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Volunteers cleaning community riverbank and collecting plastic waste in Nepal',
    updates: [
      {
        date: 'August 2024',
        title: '15 Tonnes of Plastic Waste Recovered',
        titleNp: '१५ टन प्लास्टिक फोहोर संकलन तथा रिसाइकल',
        description: 'Cleaned a 4km stretch of riverbank with 350 student volunteers.',
        descriptionNp: '३५० विद्यार्थी स्वयंसेवकद्वारा ४ कि.मि. नदी क्षेत्र सफा।'
      }
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'suman-yadav',
    name: 'Suman Yadav',
    nameNp: 'सुमन यादव',
    role: 'Executive Director & Founder',
    roleNp: 'कार्यकारी निर्देशक तथा संस्थापक',
    category: 'core',
    bio: 'Social activist and youth leader dedicated to poverty alleviation, Clothes Bank expansion, and grassroots environmental action in Nepal.',
    bioNp: 'नेपालमा कपडा बैंक, वातावरण संरक्षण र युवा सशक्तीकरणमा सक्रिय सामाजिक अभियन्ता।',
    location: 'Kathmandu / Janakpurdham',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: 'suman@genzicon.org'
  },
  {
    id: 'anita-shrestha',
    name: 'Anita Shrestha',
    nameNp: 'अनिता श्रेष्ठ',
    role: 'Director of Skills & Livelihoods',
    roleNp: 'निर्देशक - सीप तथा उद्यमशीलता',
    category: 'core',
    bio: 'Vocational training specialist leading women tailoring empowerment hubs and micro-enterprise development programs.',
    bioNp: 'महिला सिलाई-कटाई तथा लघु उद्यम तालिम कार्यक्रमकी प्रमुख।',
    location: 'Kathmandu, Nepal',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'anita@genzicon.org'
  },
  {
    id: 'rohit-adhikari',
    name: 'Rohit Adhikari',
    nameNp: 'रोहित अधिकारी',
    role: 'Lead, Clean Nepal Green Nepal',
    roleNp: 'संयोजक - सफा नेपाल, हरित नेपाल',
    category: 'core',
    bio: 'Environmental engineer leading large-scale reforestation in Chure hills, river sanitation, and community eco-clubs.',
    bioNp: 'चुरे संरक्षण तथा वृक्षारोपण अभियानका वातावरण इन्जिनियर।',
    location: 'Chitwan / Kathmandu',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'rohit@genzicon.org'
  },
  {
    id: 'priya-thapa',
    name: 'Priya Thapa',
    nameNp: 'प्रिया थापा',
    role: 'Clothes Bank Operations Lead',
    roleNp: 'प्रमुख - कपडा बैंक नेपाल',
    category: 'volunteer',
    bio: 'Logistics coordinator managing nationwide clothes collection hubs, sorting facilities, and winter relief distribution networks.',
    bioNp: 'कपडा संकलन केन्द्र, गुणस्तर जाँच र फिल्ड वितरण व्यवस्थापक।',
    location: 'Lalitpur, Nepal',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'clothesbank@genzicon.org'
  }
];

export const INITIAL_VOLUNTEER_RECORDS: VolunteerRecord[] = [
  {
    id: 'vol-101',
    volunteerId: 'VNP-84920',
    fullName: 'Bikash Chaudhary',
    email: 'bikash.c@gmail.com',
    phone: '9841298374',
    province: 'Madhesh Province',
    district: 'Dhanusha',
    interest: 'Clothes Bank Nepal (Sorting & Distribution)',
    availability: 'Weekends (Saturday/Sunday)',
    reason: 'I want to help distribute warm clothes to poor families in my hometown during cold waves.',
    submittedAt: '2024-08-20',
    status: 'Approved'
  },
  {
    id: 'vol-102',
    volunteerId: 'VNP-84921',
    fullName: 'Srijana Karki',
    email: 'srijana.k@outlook.com',
    phone: '9860123984',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    interest: 'Clean Nepal, Green Nepal (Tree Plantation & Cleanups)',
    availability: '10+ Hours/Week',
    reason: 'Passionate about environmental protection and plastic cleanup in Bagmati corridor.',
    submittedAt: '2024-08-22',
    status: 'Approved'
  },
  {
    id: 'vol-103',
    volunteerId: 'VNP-84922',
    fullName: 'Ramesh Poudel',
    email: 'ramesh.p@gmail.com',
    phone: '9812938475',
    province: 'Gandaki Province',
    district: 'Kaski',
    interest: 'Skills & Business Development (Trainer / Mentor)',
    availability: 'Flexible / Remote',
    reason: 'I have 5 years experience in tailoring and want to teach rural women sewing skills.',
    submittedAt: '2024-08-24',
    status: 'Pending'
  }
];

export const INITIAL_DONATION_RECORDS: DonationRecord[] = [
  {
    id: 'don-01',
    donorName: 'Dr. Sandeep Regmi',
    donorEmail: 'sandeep.regmi@gmail.com',
    donorPhone: '9851029384',
    amount: 25000,
    currency: 'NPR',
    frequency: 'one-time',
    paymentMethod: 'fonepay',
    projectName: 'Winter Clothes & Blanket Relief Drive (Terai Cold Wave)',
    date: '2024-08-24',
    receiptNumber: 'REC-GZ-2025-4819',
    status: 'Verified'
  },
  {
    id: 'don-02',
    donorName: 'Sunita Gurung',
    donorEmail: 'sunita.g@outlook.com',
    amount: 15000,
    currency: 'NPR',
    frequency: 'monthly',
    paymentMethod: 'esewa',
    projectName: 'Women Tailoring & Garment Enterprise Incubator',
    date: '2024-08-22',
    receiptNumber: 'REC-GZ-2025-4818',
    status: 'Verified'
  },
  {
    id: 'don-03',
    donorName: 'Bipin Shrestha',
    donorEmail: 'bipin.shrestha@gmail.com',
    amount: 10000,
    currency: 'NPR',
    frequency: 'one-time',
    paymentMethod: 'khalti',
    projectName: 'Clean Nepal, Green Nepal: 100K Tree Plantation Drive',
    date: '2024-08-20',
    receiptNumber: 'REC-GZ-2025-4817',
    status: 'Verified'
  }
];

export const SAMPLE_CLOTHES_DONORS: ClothesDonor[] = [
  {
    id: 'c-donor-01',
    name: 'Suman Thapa',
    nameNp: 'सुमन थापा',
    location: 'Baneshwor, Kathmandu',
    locationNp: 'बानेश्वर, काठमाडौँ',
    itemsCount: 45,
    clothesType: 'Winter Jackets & Sweaters',
    clothesTypeNp: 'जाडोको न्यानो ज्याकेट र स्विटर',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    note: 'Glad to contribute 45 warm jackets and woolen blankets for the winter relief drive.',
    noteNp: 'शीतलहर पीडित दाजुभाइ तथा दिदीबहिनीका लागि ४५ थान न्यानो ज्याकेट सहयोग गर्न पाउँदा खुसी लागेको छ।',
    date: '2024-08-25',
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'c-donor-02',
    name: 'Anjali Shrestha',
    nameNp: 'अञ्जली श्रेष्ठ',
    location: 'Kupondole, Lalitpur',
    locationNp: 'कुपण्डोल, ललितपुर',
    itemsCount: 32,
    clothesType: 'Kids Wear & School Uniforms',
    clothesTypeNp: 'बालबालिकाका कपडा र विद्यालय पोशाक',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    note: 'Happy to support children in remote mountain schools with warm school wear.',
    noteNp: 'हिमाली विद्यालयका साना बालबालिकालाई न्यानो पोशाक पुगोस् भन्ने कामना गर्दछु।',
    date: '2024-08-24',
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'c-donor-03',
    name: 'Prabin Adhikari',
    nameNp: 'प्रबिन अधिकारी',
    location: 'Lakeside, Pokhara',
    locationNp: 'लेकसाइड, पोखरा',
    itemsCount: 55,
    clothesType: 'Blankets & Quilts',
    clothesTypeNp: 'कम्बल तथा बाक्लो सिरक',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    note: 'Sent 55 warm blankets to protect vulnerable families from the Terai cold wave.',
    noteNp: 'तराईको शीतलहरबाट विपन्न मुसहर बस्तीलाई जोगाउन ५५ थान कम्बल पठाएका छौँ।',
    date: '2024-08-22',
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'c-donor-04',
    name: 'Bina Maharjan',
    nameNp: 'बिना महर्जन',
    location: 'Suryabinayak, Bhaktapur',
    locationNp: 'सूर्यविनायक, भक्तपुर',
    itemsCount: 28,
    clothesType: 'Sweaters & Woolen Caps',
    clothesTypeNp: 'ऊनको स्विटर र टोपी',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    note: 'Warm wishes for our sisters and brothers in need across Nepal.',
    noteNp: 'जेन्जिकन कपडा बैंकको यो पवित्र अभियानलाई निरन्तर साथ रहनेछ।',
    date: '2024-08-20',
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'c-donor-05',
    name: 'Roshan Khadka',
    nameNp: 'रोशन खड्का',
    location: 'Bharatpur, Chitwan',
    locationNp: 'भरतपुर, चितवन',
    itemsCount: 40,
    clothesType: 'Mixed Family Clothing Pack',
    clothesTypeNp: 'मिश्रित पारिवारिक कपडा सेट',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    note: 'Honored to be part of Genzicon Clothes Bank Nepal movement.',
    noteNp: 'घरमा रहेका सफा र उपयोगी कपडाहरू सही हातमा पुगेकोमा पूर्ण सन्तुष्ट छु।',
    date: '2024-08-18',
    isVerified: true,
    isFeatured: true
  },
  {
    id: 'c-donor-06',
    name: 'Sunita Chaudhary',
    nameNp: 'सुनिता चौधरी',
    location: 'Ramanand Chowk, Janakpurdham',
    locationNp: 'रामानन्द चोक, जनकपुरधाम',
    itemsCount: 35,
    clothesType: 'Winter Shawls & Jackets',
    clothesTypeNp: 'न्यानो सल तथा ज्याकेट',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    note: 'Directly dropped off warm shawls and clothes at the central hub.',
    noteNp: 'केन्द्रमै पुगेर कपडा हस्तान्तरण गरेँ, स्वयंसेवकहरूको सेवाभाव अतुलनीय छ।',
    date: '2024-08-15',
    isVerified: true,
    isFeatured: true
  }
];

export const SAMPLE_CLOTHES_DONATION_REQUESTS: ClothesDonationRequest[] = [
  {
    id: 'cd-01',
    donorName: 'Aayush Maharjan',
    phone: '9841887766',
    email: 'aayush.m@gmail.com',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    city: 'Kathmandu',
    address: 'Baneshwor, Ward 10, Near Civil Hospital',
    clothesType: 'winter',
    approxItemsCount: 35,
    donationMode: 'doorstep_pickup',
    pickupDate: '2024-08-28',
    notes: 'Good condition jackets, woolen sweaters and children coats.',
    date: '2024-08-25',
    status: 'Scheduled'
  },
  {
    id: 'cd-02',
    donorName: 'Rashmi Sharma',
    phone: '9801234567',
    email: 'rashmi.s@hotmail.com',
    province: 'Bagmati Province',
    district: 'Lalitpur',
    city: 'Lalitpur',
    address: 'Kupondole, Ward 1',
    clothesType: 'kids',
    approxItemsCount: 50,
    donationMode: 'dropoff_center',
    dropoffHub: 'Lalitpur Collection Station (Jawalakhel)',
    notes: 'Primary school uniforms and summer clothes for children aged 5-12.',
    date: '2024-08-24',
    status: 'Collected'
  },
  {
    id: 'cd-03',
    donorName: 'Gopal Krishna Jha',
    phone: '9854011223',
    email: 'gopal.jha@gmail.com',
    province: 'Madhesh Province',
    district: 'Dhanusha',
    city: 'Janakpurdham',
    address: 'Ramanand Chowk, Janakpur',
    clothesType: 'blankets',
    approxItemsCount: 20,
    donationMode: 'doorstep_pickup',
    pickupDate: '2024-08-27',
    notes: 'Warm blankets and shawls for cold wave relief.',
    date: '2024-08-25',
    status: 'Pending'
  }
];

export const SAMPLE_CLOTHES_ASSISTANCE_REQUESTS: ClothesAssistanceRequest[] = [
  {
    id: 'car-01',
    applicantName: 'Manoj Paswan (Ward Member)',
    organization: 'Hansapur Rural Municipality Ward 3',
    phone: '9812003344',
    email: 'hansapur.ward3@gmail.com',
    province: 'Madhesh Province',
    district: 'Dhanusha',
    locationDetails: 'Musahar Tole, Hansapur Ward 3 (85 households without winter clothing)',
    beneficiaryCount: 250,
    urgencyReason: 'winter_cold_wave',
    requiredTypes: ['Winter Jackets', 'Sweaters', 'Blankets', 'Kids Wear'],
    notes: 'Urgent winter warmth required before peak cold wave begins.',
    date: '2024-08-24',
    status: 'Approved'
  },
  {
    id: 'car-02',
    applicantName: 'Karma Lama (Headmaster)',
    organization: 'Shree Himalaya Basic School',
    phone: '9868112233',
    province: 'Karnali Province',
    district: 'Humla',
    locationDetails: 'Simkot Rural Municipality, Humla',
    beneficiaryCount: 120,
    urgencyReason: 'remote_school',
    requiredTypes: ['Warm Jackets', 'Woolen Socks & Gloves', 'School Shoes'],
    notes: 'Students walking 1 hour in snow to reach school.',
    date: '2024-08-22',
    status: 'Dispatched'
  }
];

export const FINANCIAL_ALLOCATION_DATA = [
  {
    category: 'Direct Programs',
    label: 'Direct Grassroots Program Execution',
    labelNp: 'प्रत्यक्ष फिल्ड कार्यक्रम खर्च',
    percentage: 88,
    color: '#00743a',
    description: 'Clothes Bank sorting & logistics, sapling sapling nurseries, tailoring kits and sewing machine grants.',
    descriptionNp: 'कपडा संकलन तथा ढुवानी, वृक्षारोपण, सिलाई मेसिन र सीप तालिम सामग्री।'
  },
  {
    category: 'Logistics & Hub Operations',
    label: 'Warehousing, Hub Operations & Transport',
    labelNp: 'गोदाम, संकलन केन्द्र तथा ढुवानी',
    percentage: 7,
    color: '#003c90',
    description: 'City drop-off hub leases, vehicle fuel for remote delivery, and hygiene washing facilities.',
    descriptionNp: 'संकलन केन्द्र, कपडा धुलाई तथा विकट जिल्लामा राहत ढुवानी।'
  },
  {
    category: 'Audits & Admin',
    label: 'Statutory Audits & Administration',
    labelNp: 'प्रशासनिक तथा कानुनी लेखापरीक्षण',
    percentage: 5,
    color: '#737784',
    description: 'Statutory CA audits, government filing, server hosting, and transparency compliance.',
    descriptionNp: 'स्वतन्त्र सीए लेखापरीक्षण, सरकारी कर चुक्ता र संस्थागत सुशासन।'
  }
];

export const EXPENSE_LEDGER_DATA = [
  {
    id: 'exp-01',
    date: '2024-08-20',
    item: 'Winter Warm Jackets & Thermal Innerwear (Direct Purchase for Cold Wave)',
    itemNp: 'तराई शीतलहरका लागि ज्याकेट तथा थर्मकोट खरिद',
    category: 'Clothes Bank Nepal',
    project: 'Clothes Bank Nepal: Terai Winter Relief',
    vendor: 'Kathmandu Garment Wholesale Mandi',
    amountNpr: 145000,
    status: 'Verified' as const
  },
  {
    id: 'exp-02',
    date: '2024-08-16',
    item: 'Fruit & Native Saplings (15,000 Saplings from Nursery)',
    itemNp: 'चुरे क्षेत्रका लागि १५,००० फलफूलका बिरुवा खरिद',
    category: 'Clean Nepal, Green Nepal',
    project: 'Clean Nepal, Green Nepal: 100K Tree Plantation',
    vendor: 'Chitwan Community Botanical Nursery',
    amountNpr: 180000,
    status: 'Audited' as const
  },
  {
    id: 'exp-03',
    date: '2024-08-10',
    item: 'Sewing Machines (Jack F4 Industrial Models) for Women Cohort 12',
    itemNp: 'सिलाई तालिम प्राप्त महिलाहरूका लागि १२ थान सिलाई मेसिन',
    category: 'Skills & Business',
    project: 'Women Vocational Tailoring & Micro-Business Hub',
    vendor: 'Singer Nepal Sewing Center',
    amountNpr: 216000,
    status: 'Verified' as const
  }
];

export const ANNUAL_AUDIT_REPORTS = [
  {
    id: 'rep-2080-81',
    fiscalYear: 'FY 2080/81 (2023-2024)',
    title: 'Statutory Financial Audit Report & SWC Compliance Submission',
    titleNp: 'आर्थिक वर्ष २०८०/८१ को वार्षिक लेखापरीक्षण प्रतिवेदन',
    fileSize: '4.8 MB (PDF)',
    auditor: 'K.B. Shrestha & Associates, Chartered Accountants (ICAN Reg. 204)',
    totalIncomeNpr: 18450000,
    totalExpenditureNpr: 17820000
  },
  {
    id: 'rep-2079-80',
    fiscalYear: 'FY 2079/80 (2022-2023)',
    title: 'Statutory Financial Audit Report & Tax Clearance Certificate',
    titleNp: 'आर्थिक वर्ष २०७९/८० को वार्षिक लेखापरीक्षण प्रतिवेदन',
    fileSize: '3.9 MB (PDF)',
    auditor: 'G.P. Gautam & Co., Chartered Accountants',
    totalIncomeNpr: 14200000,
    totalExpenditureNpr: 13910000
  }
];

export const NEWS_ARTICLES_DATA = [
  {
    id: 'news-01',
    title: 'Clothes Bank Nepal Launches 10 New Drop-off Hubs across Lalitpur & Bhaktapur',
    titleNp: 'कपडा बैंक नेपालद्वारा काठमाडौँ उपत्यकामा १० नयाँ संकलन केन्द्र स्थापना',
    category: 'Clothes Bank Nepal',
    date: 'August 24, 2024',
    readTime: '3 min read',
    author: 'Genzicon Outreach Team',
    summary: 'Expanding community drop-off stations to make pre-loved clothes donation effortless for urban households.',
    summaryNp: 'घरमै रहेका उपयोगी कपडा सहजै दान गर्न मिल्ने गरी काठमाडौँ उपत्यकाका मुख्य स्थानहरूमा संकलन बाकस स्थापना।',
    content: 'Clothes Bank Nepal has officially partnered with local youth clubs and municipal ward offices to install 10 weather-proof clothes collection hubs.',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-02',
    title: 'Clean Nepal Green Nepal Achieves 86,000 Tree Milestone in Chure Range',
    titleNp: 'सफा नेपाल, हरित नेपाल अभियान अन्तर्गत ८६,००० बिरुवा रोपण सम्पन्न',
    category: 'Clean Nepal, Green Nepal',
    date: 'August 18, 2024',
    readTime: '4 min read',
    author: 'Forestry Taskforce',
    summary: 'Mobilizing over 1,200 student volunteers and community forestry groups for monsoon plantation.',
    summaryNp: 'चुरे संरक्षण तथा पहिरो नियन्त्रणका लागि स्थानीय समुदायको सहकार्यमा फलफूलका बिरुवा रोपण तीव्र।',
    content: 'The plantation drive covered degraded slopes in Dhanusha, Mahottari, and Makwanpur districts.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  }
];

export const GALLERY_ITEMS_DATA = [
  {
    id: 'gal-01',
    title: 'Clothes Bank Distribution in Musahar Settlement',
    titleNp: 'मुसहर बस्तीमा कपडा बैंक निःशुल्क वितरण',
    category: 'Disaster Relief' as const,
    type: 'photo' as const,
    mediaUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=80',
    location: 'Hansapur, Dhanusha',
    date: 'August 2024'
  },
  {
    id: 'gal-02',
    title: 'Chure Range Mass Tree Plantation',
    titleNp: 'चुरे क्षेत्रमा वृहत् फलफूल वृक्षारोपण',
    category: 'Agriculture & Environment' as const,
    type: 'photo' as const,
    mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
    location: 'Mithila, Dhanusha',
    date: 'July 2024'
  }
];

export const DEFAULT_SITE_CONTENT: SiteContentConfig = {
  heroImageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80',
  heroCarouselImages: [
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80'
  ],
  heroTitle: 'Empowering Communities Across Nepal',
  heroTitleNp: 'जनसेवा, हरित अभियान र सीप विकास',
  heroSubtitle: 'Grassroots clothes banking, native reforestation, and vocational skill training across Nepal.',
  heroSubtitleNp: 'कपडा बैंक नेपालमार्फत कपडा वितरण, चुरे तथा नदी हरित अभियान, र विपन्न परिवारका लागि स्वरोजगार सीप।',
  heroBannerTag: 'Grassroots Community Action Nepal',
  heroBannerTagNp: 'नेपालव्यापी जनसेवा अभियान',
  impactStats: IMPACT_STATS
};

export const DEFAULT_BANK_QR_CONFIG: BankAndQrConfig = {
  bankName: 'Global IME Bank Ltd.',
  accountName: 'GENZICON FOUNDATION NEPAL',
  accountNumber: '01201010009823',
  branch: 'Putalisadak Central Branch, Kathmandu',
  swiftCode: 'GLBBNPKA',
  fonepayMerchantName: 'GENZICON FOUNDATION NEPAL',
  fonepayQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226500010np.fonepay01180120101000982302069823005204000053035245802NP5925GENZICON+FOUNDATION+NEP6009Kathmandu',
  esewaId: '9823000000 / genzicon.esewa',
  esewaQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=esewa://transfer?id=9823000000&name=GenziconFoundation',
  khaltiId: '9823000000',
  khaltiQrImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=khalti://pay?id=9823000000',
  hotlinePhone: '+977 1-4240000 / 9823000000',
  hotlineEmail: 'donate@genzicon.org'
};

export const INITIAL_CONTACT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-01',
    name: 'Sushil Rijal',
    email: 'sushil.rijal@gmail.com',
    phone: '9841223344',
    subject: 'Partnership for Clothes Drop-off Box in Baneshwor',
    message: 'Namaste. We run a youth club in Old Baneshwor and would love to install a permanent Clothes Bank collection box at our community center.',
    date: '2024-08-25',
    status: 'New'
  },
  {
    id: 'msg-02',
    name: 'Anjali Tamang',
    email: 'anjali.t@yahoo.com',
    phone: '9803112233',
    subject: 'Inquiry about Sewing Machine Training Cohort 13',
    message: 'Hello Genzicon Team, when will the next batch of free tailoring training start in Kathmandu? I want to recommend 3 women from our neighborhood.',
    date: '2024-08-23',
    status: 'Replied'
  },
  {
    id: 'msg-03',
    name: 'Dr. Binod Karki',
    email: 'binod.karki@kuh.edu.np',
    phone: '9851009988',
    subject: 'Tree Plantation Collaboration in Kavrepalanchok',
    message: 'We have 5 acres of community hillside land in Dhulikhel and would like to join hands for the Clean Nepal Green Nepal native tree plantation.',
    date: '2024-08-20',
    status: 'Resolved'
  }
];

