import { 
  Project, 
  StatMetric, 
  TeamMember, 
  GalleryMedia, 
  NewsArticle, 
  DonationRecord, 
  VolunteerRecord 
} from '../types';

export const IMPACT_STATS: StatMetric[] = [
  {
    id: 'projects',
    number: '148+',
    label: 'Community Projects',
    labelNp: 'सम्पन्न सामाजिक परियोजनाहरू',
    color: 'primary',
    description: 'Direct grassroots social interventions completed across Madhesh, Karnali, and Bagmati provinces.',
    descriptionNp: 'मधेस, कर्णाली र बागमती प्रदेशमा सम्पन्न प्रभावकारी सामाजिक कार्यक्रमहरू।'
  },
  {
    id: 'volunteers',
    number: '5,800+',
    label: 'Youth Volunteers',
    labelNp: 'सक्रिय युवा स्वयंसेवकहरू',
    color: 'secondary',
    description: 'Passionate youth changemakers actively driving healthcare, education, and relief in 77 districts.',
    descriptionNp: '७७ वटै जिल्लामा शिक्षा, स्वास्थ्य र राहत कार्यमा खटिएका युवाहरू।'
  },
  {
    id: 'lives',
    number: '250,000+',
    label: 'Lives Empowered',
    labelNp: 'प्रत्यक्ष लाभान्वित नागरिकहरू',
    color: 'primary',
    description: 'Rural families receiving clean drinking water, modern school lighting, health checkups, and disaster relief.',
    descriptionNp: 'शुद्ध खानेपानी, सौर्य ऊर्जा, स्वास्थ्य सेवा र विपद् राहत पाएका नेपाली परिवारहरू।'
  },
  {
    id: 'funds',
    number: 'रू 8.5 Crore',
    label: 'Direct Relief & Aid',
    labelNp: 'पारदर्शी परिचालन रकम',
    color: 'secondary',
    description: '100% transparently audited capital deployed with 88% on-ground project execution efficiency.',
    descriptionNp: '८८% प्रत्यक्ष फिल्ड खर्च र पूर्ण अडिट गरिएको पारदर्शी बजेट।'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'karnali-solar-schools',
    title: 'Solar Powered Classrooms in Karnali',
    titleNp: 'कर्णालीका विद्यालयहरूमा सौर्य ऊर्जा परियोजना',
    category: 'Clean Energy & Education',
    categoryNp: 'सौर्य ऊर्जा र शिक्षा',
    categoryType: 'clean-energy',
    description: 'Installing solar panels and battery banks in remote mountainous schools of Humla and Jumla to run computers and lights.',
    descriptionNp: 'हुम्ला र जुम्लाका विकट विद्यालयहरूमा कम्प्युटर र बत्ती बाल्न सौर्य ऊर्जा जडान।',
    fullDescription: 'Due to severe lack of national grid power in upper Karnali, students previously studied in dark rooms during harsh winters. Genzicon Foundation installs 5kW solar micro-systems, LED classroom lighting, digital smart boards, and 15 low-power desktop computers per school.',
    fullDescriptionNp: 'कर्णालीका विकट गाउँहरूमा बिजुली नहुँदा विद्यार्थीहरू अन्धकारमा पढ्न बाध्य थिए। हामीले ५ किलोवाटको सोलार, कम्प्युटर ल्याब र डिजिटल कक्षा कोठा स्थापना गरेका छौँ।',
    status: 'Active',
    fundedPercentage: 82,
    goalAmountNpr: 3500000,
    raisedAmountNpr: 2870000,
    goalAmountUsd: 26000,
    raisedAmountUsd: 21320,
    location: 'Jumla & Humla, Karnali Province',
    locationNp: 'जुम्ला र हुम्ला, कर्णाली प्रदेश',
    beneficiaries: '3,800 Himalayan Students',
    beneficiariesNp: '३,८०० हिमाली विद्यार्थीहरू',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH8bChtrw6y2Tpibsu23vIf3PU4ttZ_5v8Db3OfiRVt__uN4QTE0C2naFfMxTRcfkpG2sRJi7MvcspfbZ2FOLnzeHdtxVuH5asnmBjb7VlbcptF3iht3wPlUNaYAOt-AT-SAcS-Tij03CjGYjAhugqmSXKUiyYoJcJlNKR4oZHrhqkpeWTMt9EDbWX6FOAU1QxbIZ1ltGfs3ddRvurbUqSVIah9Us8RRje0kTkAHIEFpT1mdtmGyIm',
    imageAlt: 'Solar panels installed on rural school roof in Nepal mountains',
    updates: [
      {
        date: 'July 2024',
        title: 'Phase 3 Power Installation Complete',
        titleNp: 'तेस्रो चरणको सोलार जडान सम्पन्न',
        description: 'Successfully brought 24/7 electricity to 4 secondary schools in Jumla.',
        descriptionNp: 'जुम्लाका ४ माध्यमिक विद्यालयहरूमा २४सै घण्टा बिजुली सुचारु।'
      },
      {
        date: 'May 2024',
        title: 'Digital Literacy Hub Opened',
        titleNp: 'डिजिटल साक्षरता केन्द्र सुरु',
        description: 'Delivered 30 refurbished computers with offline Nepal Government digital curriculum.',
        descriptionNp: 'नेपाल सरकारको पाठ्यक्रमसहित ३० वटा कम्प्युटर हस्तान्तरण।'
      }
    ]
  },
  {
    id: 'dhanusha-clean-water',
    title: 'Deep Tube-well & Solar Water Filtration in Dhanusha',
    titleNp: 'धनुषामा सौर्य खानेपानी तथा डिप ट्युबवेल',
    category: 'Clean Water',
    categoryNp: 'शुद्ध खानेपानी',
    categoryType: 'water',
    description: 'Drilling 250-foot arsenic-safe deep tube-wells and solar automated filtration taps in drought-prone Terai villages.',
    descriptionNp: 'धनुषाका ग्रामीण बस्तीमा आर्सेनिकमुक्त डिप बोरिङ र सौर्य फिल्टर प्रणाली।',
    fullDescription: 'High arsenic levels in surface tube-wells caused widespread waterborne diseases in Dhanusha. Genzicon Foundation drilled deep aquifers and built communal solar water kiosks providing tested clean potable drinking water to over 15,000 villagers.',
    fullDescriptionNp: 'धनुषाका बस्तीहरूमा आर्सेनिक र दूषित पानीको समस्या समाधान गर्न २५० फिट गहिरो बोरिङ र फिल्टर ट्याङ्की निर्माण गरी गाउँलेलाई स्वच्छ पानी वितरण गरिएको छ।',
    status: 'Active',
    fundedPercentage: 74,
    goalAmountNpr: 2800000,
    raisedAmountNpr: 2072000,
    goalAmountUsd: 21000,
    raisedAmountUsd: 15540,
    location: 'Janakpurdham & Hansapur, Dhanusha',
    locationNp: 'जनकपुरधाम र हंशपुर, धनुषा (मधेस प्रदेश)',
    beneficiaries: '15,200 Local Residents',
    beneficiariesNp: '१५,२०० स्थानीय बासिन्दा',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOQGkojkO4B_hUwE_zrw9f3p7nwwQucT0wCS9Uc3yk9QR2-vh84Qg-BiMiInKVTb7k3ftu-GAD01VdYtO0qVJIlIWO2q8ooQwLD_JwaGK07eKzo5Kr5uACaIynElRa--Ca6C5L3YuWoCUdXcsZ28P-UJ_J8TA-NAa5K2zKvwHpwFxhZdMRJUoZ2EHdYTs-rt5j_3GIAqP62rdLytUiGqaYQglqIM_Bk4VzhuCYJC6xFYkU4ZARWTZ3',
    imageAlt: 'Community clean water solar tap station in Terai Nepal',
    updates: [
      {
        date: 'June 2024',
        title: 'Water Quality Certified by Lab',
        titleNp: 'पानी परीक्षण प्रयोगशालाबाट प्रमाणित',
        description: 'Zero arsenic and zero bacterial contamination confirmed in government lab testing.',
        descriptionNp: 'सरकारी ल्याब परीक्षणमा पानी १००% पिउन योग्य प्रमाणित।'
      }
    ]
  },
  {
    id: 'saptari-mobile-health',
    title: 'Rural Terai Mobile Medical & Eye Camps',
    titleNp: 'सप्तरी तथा सिराहा ग्रामीण स्वास्थ्य तथा आँखा शिविर',
    category: 'Healthcare',
    categoryNp: 'स्वास्थ्य सेवा',
    categoryType: 'healthcare',
    description: 'Providing free doctor consultations, diabetes screening, free medicine distribution, and cataract eye surgeries.',
    descriptionNp: 'नि:शुल्क विशेषज्ञ डाक्टर परामर्श, औषधि वितरण तथा मोतियाबिन्दुको नि:शुल्क शल्यक्रिया।',
    fullDescription: 'Many marginalized communities in rural Terai lack nearby hospitals. Our volunteer team of doctors, optometrists, and nurses travel with a mobile diagnostic van, conducting bi-weekly health camps, maternal care checkups, and free spectacles distribution.',
    fullDescriptionNp: 'गाउँघरमै पुगेर विशेषज्ञ चिकित्सकहरूद्वारा महिला, बालबालिका तथा ज्येष्ठ नागरिकहरूलाई नि:शुल्क स्वास्थ्य परीक्षण, औषधि र आँखाको उपचार प्रदान गरिन्छ।',
    status: 'Completed',
    fundedPercentage: 100,
    goalAmountNpr: 1800000,
    raisedAmountNpr: 1800000,
    goalAmountUsd: 13500,
    raisedAmountUsd: 13500,
    location: 'Saptari & Siraha Districts',
    locationNp: 'सप्तरी र सिराहा जिल्ला',
    beneficiaries: '8,400 Rural Patients',
    beneficiariesNp: '८,४०० ग्रामीण बिरामीहरू',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0z46Jn64S7vCSHgkIz60Q_faCHOjo6M-LlOU0prJ2u4hR_AeLGU0Aiwuqz5BS9bCaC4i3Ez4TLOiyEJt4eO_TKDMUROkF4kcINLxC4cjVSa_ZVu2pXKQc6Z-G5LQXzjhBXnm-qpoq2KNvK3jCf_LB1H9sWO7py4nfilNHEvRHWbLeb2D4pqHXmzC0JEiwSAvsapaUVhJfiNb9xZ2faNW9DmOM74T-FX3RVMzj804zclsvNcZecDC7',
    imageAlt: 'Doctors examining patient in rural health camp Nepal',
    updates: [
      {
        date: 'August 2024',
        title: '320 Free Cataract Surgeries Completed',
        titleNp: '३२० जनाको सफल मोतियाबिन्दु शल्यक्रिया',
        description: 'Elderly citizens restored their vision in partnership with Sagarmatha Choudhary Eye Hospital.',
        descriptionNp: 'सगरमाथा चौधरी आँखा अस्पतालसँगको सहकार्यमा दृष्टि फिर्ता।'
      }
    ]
  },
  {
    id: 'janakpur-girls-code',
    title: 'Girls in Tech & Digital Skills Hub',
    titleNp: 'जनकपुर बालिका डिजिटल तथा कोडिङ तालिम',
    category: 'Education & Youth',
    categoryNp: 'शिक्षा र युवा सशक्तीकरण',
    categoryType: 'education',
    description: 'Empowering young girls and underprivileged youth from Madhesh with free computer programming, web design, and digital literacy.',
    descriptionNp: 'मधेसका विपन्न छात्राहरूलाई निःशुल्क कम्प्युटर, कोडिङ र डिजिटल सीप तालिम।',
    fullDescription: 'Providing a safe, supportive learning space equipped with laptops and high-speed internet in Janakpurdham. Over 450 young women have completed our 12-week web development, office productivity, and freelancing training.',
    fullDescriptionNp: 'जनकपुरधाममा आधुनिक ल्यापटप ल्याब स्थापना गरी ४५० भन्दा बढी किशोरीहरूलाई वेब डिजाइन, प्रोग्रामिङ र डिजिटल रोजगार सम्बन्धी सीप दिइएको छ।',
    status: 'Active',
    fundedPercentage: 90,
    goalAmountNpr: 2200000,
    raisedAmountNpr: 1980000,
    goalAmountUsd: 16500,
    raisedAmountUsd: 14850,
    location: 'Janakpurdham, Madhesh',
    locationNp: 'जनकपुरधाम, मधेस प्रदेश',
    beneficiaries: '650+ Young Women',
    beneficiariesNp: '६५०+ किशोरी तथा युवा',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtUyJzbIqX-ZbD4kIapVkAYPrsgGu26zgyR4Ogdq45BtVhowNPVFQwg8qJBKVejKu3IvMGEplSpi63ZrKDytGB8Pjy7j-3NmKQPNPxVxc-ld-pkv2kr67gn1dwkpIyXsM0jdF2M5P1U0JoZDSj44Rw_6dpSQbCFPznPc73Jsd-JdKJFDUGulbwQYeTdZM_ekIy9nGVkWZvDLyzpcA-SbqDJIQaD0M_EwlwpLuKQhjDxgRgktB3TOYo',
    imageAlt: 'Young female students coding in computer training classroom in Nepal',
    updates: [
      {
        date: 'August 2024',
        title: 'Graduation of 5th Batch',
        titleNp: 'पाँचौँ ब्याचको दीक्षान्त',
        description: '48 girls completed web development training with 14 securing remote internships.',
        descriptionNp: '४८ जना छात्राहरूले तालिम पूरा गरे र १४ जनाले इन्टर्नसिप प्राप्त गरे।'
      }
    ]
  },
  {
    id: 'terai-flood-relief',
    title: 'Emergency Flood Relief & Food Kits in Rautahat & Sarlahi',
    titleNp: 'रौतहट तथा सर्लाही बाढी पीडित राहत कार्यक्रम',
    category: 'Disaster Relief',
    categoryNp: 'विपद् राहत',
    categoryType: 'relief',
    description: 'Distributing emergency food rations, dry beaten rice, water purification tablets, tarpaulins, and mosquito nets to flood-affected families.',
    descriptionNp: 'बाढी प्रभावित गरिब तथा विपन्न परिवारलाई खाद्यान्न, त्रिपाल, झुल र पानी शुद्धिकरण औषधि वितरण।',
    fullDescription: 'During severe monsoon inundation in southern plains along Bagmati and Lalbakaiya rivers, Genzicon emergency volunteer taskforces reached inundated settlements by boat, distributing 2,500 comprehensive relief packages.',
    fullDescriptionNp: 'वर्षायाममा बाढीबाट विस्थापित भएका परिवारलाई हाम्रा स्वयंसेवकहरूले डुङ्गामार्फत गाउँमै पुगेर चामल, दाल, तेल, त्रिपाल र औषधि वितरण गरे।',
    status: 'Completed',
    fundedPercentage: 100,
    goalAmountNpr: 4200000,
    raisedAmountNpr: 4200000,
    goalAmountUsd: 31500,
    raisedAmountUsd: 31500,
    location: 'Rautahat, Sarlahi & Mahottari',
    locationNp: 'रौतहट, सर्लाही र महोत्तरी',
    beneficiaries: '18,500 Flood Survivors',
    beneficiariesNp: '१८,५०० बाढी प्रभावित नागरिक',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL4Mfh5GFiLxesJe3tOcT5KWd_ZkdYVcWP_ej1Fja92C7ZN9fJciSHe5ZRKrJZBH2Sps_dTSLEt9FX3jcg80yXzqF-crJbXnyevYYWpfcw4lrHPl7mzRKWzRWTt06z_MhcBQ_Xpd9iRg_gg8gILWw6uq7miWek7jXxu3L75jmd_QgR5LJc8_UEA3GUDk7qfT_Ywhzea7yLUuT32S41_Yip0U_82rJ5MF0z1N9OSNgFCvQSUc0DKesM',
    imageAlt: 'Volunteer team delivering essential relief supplies in Nepal',
    updates: [
      {
        date: 'July 2024',
        title: 'Emergency Response Deployment',
        titleNp: 'आपतकालीन राहत परिचालन',
        description: 'Supplied dry food packages and clean water tablets across 12 flooded village councils.',
        descriptionNp: '१२ वटा बाढीग्रस्त वडामा खाद्यान्न र शुद्ध पानी वितरण सम्पन्न।'
      }
    ]
  },
  {
    id: 'chure-reforestation',
    title: 'Chure Range Green Reforestation & Agroforestry',
    titleNp: 'चुरे संरक्षण तथा वृक्षारोपण अभियान',
    category: 'Environment & Agriculture',
    categoryNp: 'वातावरण र कृषि',
    categoryType: 'agriculture',
    description: 'Planting 100,000 fruit-bearing trees and bamboo along vulnerable riverbanks to prevent soil erosion and empower farmers.',
    descriptionNp: 'नदी कटान रोक्न र कृषकको आय बढाउन १ लाख फलफूल तथा बाँसका बिरुवा रोपण।',
    fullDescription: 'The Chure foothills are critical for ground water recharge across southern Nepal. Our community nurseries provide mango, litchi, and medicinal saplings to youth clubs and women farming cooperatives.',
    fullDescriptionNp: 'चुरे क्षेत्रको संरक्षण गर्न महिला समूह र युवा क्लबहरूको सहकार्यमा फलफूलका बिरुवा रोपी स्थानीय कृषकको आयआर्जन बढाइएको छ।',
    status: 'Active',
    fundedPercentage: 65,
    goalAmountNpr: 1500000,
    raisedAmountNpr: 975000,
    goalAmountUsd: 11250,
    raisedAmountUsd: 7310,
    location: 'Chitwan & Makwanpur Foothills',
    locationNp: 'चितवन र मकवानपुर चुरे क्षेत्र',
    beneficiaries: '4,200 Farming Households',
    beneficiariesNp: '४,२०० कृषक परिवार',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCBV2KuoURS0j_G6llugl2ho0MhnTB33Il_69xHvyO77aJTpPoa4SMWsJo7tSe9m4LGGay6phSrhKcvtxUh_epntVEBM5bPmGlJ1cvS2YyLbhDVqSBhy1mQeAy7MPceBlvZfu2bt1YAFCZMkXy9ZxKB5FBPVfcjr3tObzlPdWLOKCZabGlWVcKXXSWg3-nRrTU3jwTn2NaJyrUaQzhSRhwFQtaI0ZsvK5cb6T0V9F9zzVF6GerAPg',
    imageAlt: 'Young saplings planted along green foothills in Nepal',
    updates: [
      {
        date: 'July 2024',
        title: 'Monsoon Plantation Drive Complete',
        titleNp: 'मनसुन वृक्षारोपण सम्पन्न',
        description: '25,000 bamboo and fruit saplings planted with 350 youth volunteers participating.',
        descriptionNp: '३५० स्वयंसेवकको सहभागितामा २५,००० बिरुवा रोपियो।'
      }
    ]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'suman-yadav',
    name: 'Suman Yadav',
    nameNp: 'सुमन यादव',
    role: 'Founder & Executive Director',
    roleNp: 'संस्थापक तथा कार्यकारी निर्देशक',
    category: 'core',
    bio: 'Social entrepreneur and software engineer passionate about leveraging technology, youth volunteerism, and transparent governance for grassroots progress in Nepal.',
    bioNp: 'नेपालमा प्रविधि, युवा स्वयंसेवा र पारदर्शी सुशासनमार्फत सामाजिक रूपान्तरणमा समर्पित सामाजिक अभियन्ता।',
    location: 'Janakpurdham & Kathmandu',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    email: 'suman@genzicon.org',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com'
  },
  {
    id: 'puja-mahato',
    name: 'Er. Puja Mahato',
    nameNp: 'ई. पूजा महतो',
    role: 'Head of Infrastructure & Water Projects',
    roleNp: 'पूर्वाधार तथा खानेपानी प्रमुख',
    category: 'core',
    bio: 'Civil & environmental engineer overseeing deep boreholes, solar pumping networks, and resilient school constructions across Madhesh and Karnali.',
    bioNp: 'मधेस र कर्णालीमा डिप बोरिङ, सौर्य खानेपानी र विद्यालय निर्माण परियोजनाहरूको प्राविधिक नेतृत्व।',
    location: 'Dhanusha, Nepal',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    email: 'puja@genzicon.org',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'dr-bikash-thapa',
    name: 'Dr. Bikash Thapa',
    nameNp: 'डा. विकास थापा',
    role: 'Director of Community Health Programs',
    roleNp: 'सामुदायिक स्वास्थ्य निर्देशक',
    category: 'core',
    bio: 'Public health physician with over 10 years of field experience mobilizing volunteer doctors and organizing free health camps in remote Terai & mountain districts.',
    bioNp: 'दुर्गम जिल्लाहरूमा नि:शुल्क स्वास्थ्य शिविर तथा आकस्मिक चिकित्सा सेवा सञ्चालनमा १० वर्षभन्दा बढी अनुभव।',
    location: 'Kathmandu, Nepal',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    email: 'health@genzicon.org',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'sarita-chaudhary',
    name: 'Sarita Chaudhary',
    nameNp: 'सरिता चौधरी',
    role: 'Community Outreach & Volunteer Lead',
    roleNp: 'सामुदायिक समन्वय तथा स्वयंसेवक संयोजक',
    category: 'core',
    bio: 'Grassroots community organizer heading volunteer mobilizations, women empowerment workshops, and emergency flood relief logistics.',
    bioNp: 'महिला सशक्तीकरण, स्वयंसेवक परिचालन तथा बाढी राहत कार्यक्रमको कुशल संयोजक।',
    location: 'Sarlahi / Janakpur',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    email: 'sarita@genzicon.org',
    facebook: 'https://facebook.com'
  },
  {
    id: 'prof-ramesh-sharma',
    name: 'Prof. Dr. Ramesh Sharma',
    nameNp: 'प्रा. डा. रमेश शर्मा',
    role: 'Senior Governance & Policy Advisor',
    roleNp: 'वरिष्ठ सुशासन तथा नीति सल्लाहकार',
    category: 'advisor',
    bio: 'Former university dean and development economics researcher advising on non-profit transparency, statutory compliances, and Social Welfare Council standards.',
    bioNp: 'विकास अर्थशास्त्रका प्राध्यापक तथा सामाजिक संस्था सुशासनका विज्ञ।',
    location: 'Kathmandu',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    email: 'advisory@genzicon.org'
  },
  {
    id: 'anita-adhikari',
    name: 'Anita Adhikari',
    nameNp: 'अनिता अधिकारी',
    role: 'Education Curriculum Advisor',
    roleNp: 'शिक्षा पाठ्यक्रम सल्लाहकार',
    category: 'advisor',
    bio: 'Pioneer in rural STEM education programs and inclusive teaching methodologies for girls in government schools.',
    bioNp: 'सरकारी विद्यालयमा बालिका शिक्षा र सूचना प्रविधि पाठ्यक्रम विकासमा संलग्न।',
    location: 'Pokhara',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    email: 'anita@genzicon.org'
  },
  {
    id: 'aayush-sah',
    name: 'Aayush Sah',
    nameNp: 'आयुष साह',
    role: 'Youth Ambassador - Madhesh',
    roleNp: 'युवा सद्भावना दूत - मधेस',
    category: 'volunteer',
    bio: 'Undergraduate student leading youth blood donation drives and digital literacy workshops in Dhanusha.',
    bioNp: 'धनुषामा रक्तदान र युवा डिजिटल सीप कार्यक्रमको नेतृत्व गर्ने विद्यार्थी स्वयंसेवक।',
    location: 'Janakpurdham',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'prativa-gurung',
    name: 'Prativa Gurung',
    nameNp: 'प्रतिभा गुरुङ',
    role: 'Disaster Relief Volunteer Lead',
    roleNp: 'विपद् व्यवस्थापन स्वयंसेवक संयोजक',
    category: 'volunteer',
    bio: 'Emergency first responder and mountaineer coordinating logistics during landslide and flood rescue operations.',
    bioNp: 'बाढी, पहिरो तथा आपतकालीन उद्धार कार्यमा अग्रणी युवा स्वयंसेवक।',
    location: 'Kaski / Chitwan',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  }
];

export const GALLERY_ITEMS_DATA: GalleryMedia[] = [
  {
    id: 'video-1',
    title: 'Karnali Solar Classroom Documentary',
    titleNp: 'कर्णालीका विद्यालयमा सोलार जडान डकुमेन्ट्री',
    category: 'Education',
    type: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    location: 'Jumla, Karnali',
    date: 'August 2024',
    description: 'Watch how clean solar power transformed this 150-student mountain school in Jumla with bright lights and computers.'
  },
  {
    id: 'photo-1',
    title: 'Clean Drinking Water Flowing in Dhanusha',
    titleNp: 'धनुषामा शुद्ध पानीको फोहोरा',
    category: 'Clean Water',
    type: 'photo',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOQGkojkO4B_hUwE_zrw9f3p7nwwQucT0wCS9Uc3yk9QR2-vh84Qg-BiMiInKVTb7k3ftu-GAD01VdYtO0qVJIlIWO2q8ooQwLD_JwaGK07eKzo5Kr5uACaIynElRa--Ca6C5L3YuWoCUdXcsZ28P-UJ_J8TA-NAa5K2zKvwHpwFxhZdMRJUoZ2EHdYTs-rt5j_3GIAqP62rdLytUiGqaYQglqIM_Bk4VzhuCYJC6xFYkU4ZARWTZ3',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOQGkojkO4B_hUwE_zrw9f3p7nwwQucT0wCS9Uc3yk9QR2-vh84Qg-BiMiInKVTb7k3ftu-GAD01VdYtO0qVJIlIWO2q8ooQwLD_JwaGK07eKzo5Kr5uACaIynElRa--Ca6C5L3YuWoCUdXcsZ28P-UJ_J8TA-NAa5K2zKvwHpwFxhZdMRJUoZ2EHdYTs-rt5j_3GIAqP62rdLytUiGqaYQglqIM_Bk4VzhuCYJC6xFYkU4ZARWTZ3',
    location: 'Hansapur, Dhanusha',
    date: 'June 2024',
    description: 'Villagers celebrate the launch of their solar-powered deep tube-well providing 10,000 liters of potable water daily.'
  },
  {
    id: 'video-2',
    title: 'Janakpur Girls Coding Bootcamp Reel',
    titleNp: 'जनकपुर किशोरी कोडिङ तालिम रिल',
    category: 'Education',
    type: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    location: 'Janakpurdham',
    date: 'July 2024',
    description: 'Highlights from our 12-week intensive digital literacy and web development program for young women.'
  },
  {
    id: 'photo-2',
    title: 'Free Health & Eye Camp in Saptari',
    titleNp: 'सप्तरीमा नि:शुल्क स्वास्थ्य शिविर',
    category: 'Healthcare',
    type: 'photo',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0z46Jn64S7vCSHgkIz60Q_faCHOjo6M-LlOU0prJ2u4hR_AeLGU0Aiwuqz5BS9bCaC4i3Ez4TLOiyEJt4eO_TKDMUROkF4kcINLxC4cjVSa_ZVu2pXKQc6Z-G5LQXzjhBXnm-qpoq2KNvK3jCf_LB1H9sWO7py4nfilNHEvRHWbLeb2D4pqHXmzC0JEiwSAvsapaUVhJfiNb9xZ2faNW9DmOM74T-FX3RVMzj804zclsvNcZecDC7',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0z46Jn64S7vCSHgkIz60Q_faCHOjo6M-LlOU0prJ2u4hR_AeLGU0Aiwuqz5BS9bCaC4i3Ez4TLOiyEJt4eO_TKDMUROkF4kcINLxC4cjVSa_ZVu2pXKQc6Z-G5LQXzjhBXnm-qpoq2KNvK3jCf_LB1H9sWO7py4nfilNHEvRHWbLeb2D4pqHXmzC0JEiwSAvsapaUVhJfiNb9xZ2faNW9DmOM74T-FX3RVMzj804zclsvNcZecDC7',
    location: 'Rajbiraj, Saptari',
    date: 'August 2024',
    description: 'Over 850 rural residents received free physician consultations, blood tests, and eyeglasses.'
  },
  {
    id: 'photo-3',
    title: 'Monsoon Flood Relief Delivery in Rautahat',
    titleNp: 'रौतहटमा बाढी पीडितलाई राहत वितरण',
    category: 'Disaster Relief',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    location: 'Gaur, Rautahat',
    date: 'July 2024',
    description: 'Genzicon volunteers delivering dry food rations, tarpaulins, and clean drinking water kits.'
  },
  {
    id: 'photo-4',
    title: 'Chure Range Tree Plantation with Youth',
    titleNp: 'चुरे क्षेत्रमा युवाहरूको वृक्षारोपण',
    category: 'Agriculture & Environment',
    type: 'photo',
    mediaUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCBV2KuoURS0j_G6llugl2ho0MhnTB33Il_69xHvyO77aJTpPoa4SMWsJo7tSe9m4LGGay6phSrhKcvtxUh_epntVEBM5bPmGlJ1cvS2YyLbhDVqSBhy1mQeAy7MPceBlvZfu2bt1YAFCZMkXy9ZxKB5FBPVfcjr3tObzlPdWLOKCZabGlWVcKXXSWg3-nRrTU3jwTn2NaJyrUaQzhSRhwFQtaI0ZsvK5cb6T0V9F9zzVF6GerAPg',
    thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnCBV2KuoURS0j_G6llugl2ho0MhnTB33Il_69xHvyO77aJTpPoa4SMWsJo7tSe9m4LGGay6phSrhKcvtxUh_epntVEBM5bPmGlJ1cvS2YyLbhDVqSBhy1mQeAy7MPceBlvZfu2bt1YAFCZMkXy9ZxKB5FBPVfcjr3tObzlPdWLOKCZabGlWVcKXXSWg3-nRrTU3jwTn2NaJyrUaQzhSRhwFQtaI0ZsvK5cb6T0V9F9zzVF6GerAPg',
    location: 'Makwanpur Foothills',
    date: 'July 2024',
    description: 'Volunteers planted 25,000 fruit and bamboo saplings to stop soil erosion in the vulnerable Chure range.'
  }
];

export const NEWS_ARTICLES_DATA: NewsArticle[] = [
  {
    id: 'news-karnali-milestone',
    title: 'Genzicon Foundation Completes Solar Electrification of 15 Mountain Schools in Karnali',
    titleNp: 'कर्णालीका १५ विद्यालयहरूमा सौर्य ऊर्जा जडान कार्य सफलतापूर्वक सम्पन्न',
    category: 'Field Report',
    date: 'August 20, 2024',
    readTime: '4 min read',
    author: 'Er. Puja Mahato',
    summary: 'Over 3,800 students in remote mountain communities now have uninterrupted electricity, heated study rooms, and computer laboratory access.',
    summaryNp: '३,८०० भन्दा बढी हिमाली विद्यार्थीहरूका लागि नियमित बिजुली र कम्प्युटर ल्याबको सुविधा सुनिश्चित।',
    content: `Our engineering team and youth volunteers have concluded Phase 3 of the Karnali Solar Education Initiative. By hauling 5kW solar panels and lithium storage banks via mountain paths, we have permanently powered 15 high-altitude government schools in Humla and Jumla.

Before this intervention, sub-zero winter temperatures and pitch-dark classrooms prevented effective teaching after 2 PM. Now, classrooms feature LED illumination, smart televisions for interactive lessons, and 15 desktop computers running the Curriculum Development Centre (CDC) Nepal offline syllabus.

We thank all our local and international donors who made this milestone possible.`,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH8bChtrw6y2Tpibsu23vIf3PU4ttZ_5v8Db3OfiRVt__uN4QTE0C2naFfMxTRcfkpG2sRJi7MvcspfbZ2FOLnzeHdtxVuH5asnmBjb7VlbcptF3iht3wPlUNaYAOt-AT-SAcS-Tij03CjGYjAhugqmSXKUiyYoJcJlNKR4oZHrhqkpeWTMt9EDbWX6FOAU1QxbIZ1ltGfs3ddRvurbUqSVIah9Us8RRje0kTkAHIEFpT1mdtmGyIm',
    isEvent: false
  },
  {
    id: 'event-health-camp-janakpur',
    title: 'Upcoming: Mega Free Health, Eye & Blood Donation Camp in Janakpurdham',
    titleNp: 'आगामी कार्यक्रम: जनकपुरधाममा बृहत नि:शुल्क स्वास्थ्य तथा आँखा शिविर',
    category: 'Event',
    date: 'September 15, 2024',
    readTime: '2 min read',
    author: 'Dr. Bikash Thapa',
    summary: 'Join our team of 25+ specialist doctors offering free general checkups, diabetes tests, eye checkups with free glasses, and pediatric care.',
    summaryNp: '२५ भन्दा बढी विशेषज्ञ चिकित्सकहरूद्वारा निःशुल्क स्वास्थ्य जाँच, आँखा परीक्षण र औषधि वितरण।',
    content: `Genzicon Foundation in collaboration with local community hospitals is organizing a full-day Mega Health Camp at Janakpur Community Ground.

Event Details:
- Date: Saturday, September 15, 2024 (8:00 AM - 5:00 PM)
- Location: Janakpur Community Hall Ground, Ward 4
- Free Services: General Medicine, Cardiology, Eye examination & free prescription glasses, Blood sugar & pressure screening, Child & Maternal Health, Free basic medicines.

Volunteers are invited to register early to assist in patient registration and queue management.`,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0z46Jn64S7vCSHgkIz60Q_faCHOjo6M-LlOU0prJ2u4hR_AeLGU0Aiwuqz5BS9bCaC4i3Ez4TLOiyEJt4eO_TKDMUROkF4kcINLxC4cjVSa_ZVu2pXKQc6Z-G5LQXzjhBXnm-qpoq2KNvK3jCf_LB1H9sWO7py4nfilNHEvRHWbLeb2D4pqHXmzC0JEiwSAvsapaUVhJfiNb9xZ2faNW9DmOM74T-FX3RVMzj804zclsvNcZecDC7',
    isEvent: true,
    eventDate: 'September 15, 2024 (8:00 AM - 5:00 PM)',
    eventLocation: 'Janakpur Community Hall, Janakpurdham'
  },
  {
    id: 'news-financial-audit-2024',
    title: 'Annual Transparency & Statutory Audit Report 2080/81 Published',
    titleNp: 'आर्थिक वर्ष २०८०/८१ को वार्षिक लेखापरीक्षण तथा पारदर्शी प्रतिवेदन सार्वजनिक',
    category: 'Transparency',
    date: 'July 30, 2024',
    readTime: '3 min read',
    author: 'Finance & Compliance Board',
    summary: 'Genzicon Foundation releases its audited financial statement with an 88% direct program spending ratio certified by registered Chartered Accountants.',
    summaryNp: '८८% प्रत्यक्ष सामाजिक परियोजना खर्च र रजिष्टर्ड चार्टर्ड एकाउन्टेन्टद्वारा प्रमाणित वार्षिक अडिट प्रतिवेदन।',
    content: `In compliance with the Social Welfare Council of Nepal (SWC) and tax authorities, Genzicon Foundation has published its full financial disclosure for the fiscal year 2080/81.

Key Highlights:
- Total Funds Mobilized: NPR 8,54,20,000 (रू ८ करोड ५४ लाख)
- Direct Project Interventions: 88.2% (NPR 7,53,40,000)
- Field Logistics & Monitoring: 7.8% (NPR 66,62,000)
- Administrative & Compliance: 4.0% (NPR 34,18,000)

Complete audited ledgers and bank transaction summaries are available for download in our Transparency Portal.`,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    isEvent: false
  },
  {
    id: 'news-girls-coding-demo',
    title: 'Janakpur Tech Bootcamp: 48 Young Women Graduate with Digital Career Skills',
    titleNp: 'जनकपुर टेक बुटक्याम्प: ४८ किशोरीहरूले पाए डिजिटल रोजगार सीप',
    category: 'Field Report',
    date: 'June 18, 2024',
    readTime: '3 min read',
    author: 'Suman Yadav',
    summary: 'Students built live websites, graphic designs, and digital marketing portfolios during the intensive 12-week foundation course.',
    summaryNp: '१२ हप्ताको तालिममा छात्राहरूले प्रत्यक्ष वेबसाइट, ग्राफिक डिजाइन र डिजिटल सीपहरू सिके।',
    content: `Bridging the gender digital divide in Madhesh Pradesh, the Genzicon Tech Academy celebrated the graduation of its 5th cohort of female coders.

Participants learned HTML, CSS, JavaScript, Canva design, and digital freelancing fundamentals. Several graduates have already taken on freelance web management roles for local enterprises and schools in Janakpur and Birgunj.`,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtUyJzbIqX-ZbD4kIapVkAYPrsgGu26zgyR4Ogdq45BtVhowNPVFQwg8qJBKVejKu3IvMGEplSpi63ZrKDytGB8Pjy7j-3NmKQPNPxVxc-ld-pkv2kr67gn1dwkpIyXsM0jdF2M5P1U0JoZDSj44Rw_6dpSQbCFPznPc73Jsd-JdKJFDUGulbwQYeTdZM_ekIy9nGVkWZvDLyzpcA-SbqDJIQaD0M_EwlwpLuKQhjDxgRgktB3TOYo',
    isEvent: false
  }
];

export const INITIAL_VOLUNTEER_RECORDS: VolunteerRecord[] = [
  {
    id: 'vol-001',
    volunteerId: 'GZ-VOL-2024-089',
    fullName: 'Ramesh Kumar Chaudhary',
    email: 'ramesh.chaudhary@gmail.com',
    phone: '+977 9812345678',
    province: 'Madhesh Province',
    district: 'Dhanusha',
    interest: 'Clean Water & Field Engineering',
    availability: 'Weekends (10 hrs/week)',
    reason: 'I want to help build sustainable water filtration in drought-affected villages around Janakpur.',
    experience: 'Civil engineering diploma student with surveying experience.',
    submittedAt: '2024-08-20',
    status: 'Approved'
  },
  {
    id: 'vol-002',
    volunteerId: 'GZ-VOL-2024-090',
    fullName: 'Pooja Shrestha',
    email: 'pooja.shrestha@outlook.com',
    phone: '+977 9841234567',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    interest: 'Digital Literacy & Teaching',
    availability: 'Flexible / Remote',
    reason: 'Passionate about teaching coding and basic internet skills to underprivileged girls.',
    experience: '2 years teaching computer science in secondary school.',
    submittedAt: '2024-08-21',
    status: 'Approved'
  },
  {
    id: 'vol-003',
    volunteerId: 'GZ-VOL-2024-091',
    fullName: 'Dipendra Yadav',
    email: 'dipendra.yadav@gmail.com',
    phone: '+977 9801239876',
    province: 'Madhesh Province',
    district: 'Saptari',
    interest: 'Healthcare & Medical Camps',
    availability: 'Full Time on Deployments',
    reason: 'Eager to support volunteer doctors during upcoming mobile health camps in rural Saptari.',
    experience: 'Nursing assistant and first aid certified.',
    submittedAt: '2024-08-22',
    status: 'Pending'
  }
];

export const INITIAL_DONATION_RECORDS: DonationRecord[] = [
  {
    id: 'don-101',
    receiptNumber: 'REC-GZ-2024-0542',
    donorName: 'Dr. Hari Krishna Acharya',
    donorEmail: 'acharya.hk@gmail.com',
    donorPhone: '+977 9851000000',
    amount: 15000,
    currency: 'NPR',
    frequency: 'one-time',
    paymentMethod: 'esewa',
    projectName: 'Deep Tube-well & Solar Water Filtration in Dhanusha',
    date: '2024-08-22',
    status: 'Verified'
  },
  {
    id: 'don-102',
    receiptNumber: 'REC-GZ-2024-0543',
    donorName: 'Michael R. Vance',
    donorEmail: 'michael.vance@chicago-tech.org',
    amount: 250,
    currency: 'USD',
    frequency: 'monthly',
    paymentMethod: 'card',
    projectName: 'Solar Powered Classrooms in Karnali',
    date: '2024-08-21',
    status: 'Verified'
  },
  {
    id: 'don-103',
    receiptNumber: 'REC-GZ-2024-0544',
    donorName: 'Sita Devi Sah',
    donorEmail: 'sita.sah@janakpur.com',
    donorPhone: '+977 9811223344',
    amount: 5000,
    currency: 'NPR',
    frequency: 'one-time',
    paymentMethod: 'fonepay',
    projectName: 'Girls in Tech & Digital Skills Hub',
    date: '2024-08-20',
    status: 'Verified'
  }
];

export const TESTIMONIALS_DATA = [
  {
    quote: "Before Genzicon installed the solar system, our school in Jumla had no electricity during winter storms. Today, our students study computer programming with 24/7 solar light.",
    quoteNp: "पहिले हाम्रो हिमाली विद्यालयमा बिजुली थिएन। अहिले सोलार बत्ती र कम्प्युटर ल्याबले विद्यार्थीहरूको भविष्य उज्यालो भएको छ।",
    author: "Birendra Rokaya",
    authorNp: "वीरेन्द्र रोकाया",
    title: "Principal, Shree Himalaya Secondary School, Jumla",
    titleNp: "प्रधानाध्यापक, श्री हिमालय मावि, जुम्ला",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    quote: "Our village in Dhanusha suffered every dry season from arsenic-laced water. Genzicon's deep solar well now brings fresh, pure water directly to our doorstep.",
    quoteNp: "दूषित पानीले गर्दा गाउँमा सधैँ रोगको डर हुन्थ्यो। अहिले सौर्य खानेपानी ट्याङ्कीबाट घरआँगनमै शुद्ध पानी पिउन पाएका छौँ।",
    author: "Sunita Devi Paswan",
    authorNp: "सुनिता देवी पासवान",
    title: "Local Women Cooperative Leader, Hansapur, Dhanusha",
    titleNp: "महिला सहकारी अध्यक्ष, हंशपुर, धनुषा",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    quote: "As a young engineer in Nepal, volunteering with Genzicon gave me the chance to apply technical skills directly where people need them most. The transparency here is genuine.",
    quoteNp: "जेन्जिकन फाउन्डेशनमा स्वयंसेवकको रूपमा फिल्डमा काम गर्दा आफूले सिकेको ज्ञान समाजको हितमा लगाउन पाउँदा निकै गर्व लाग्छ।",
    author: "Bibek Mahato",
    authorNp: "विवेक महतो",
    title: "Lead Volunteer Engineer, Madhesh Province",
    titleNp: "इन्जिनियरिङ स्वयंसेवक, मधेस प्रदेश",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

export const FINANCIAL_ALLOCATION_DATA = [
  { 
    label: 'Direct On-Ground Programs', 
    labelNp: 'प्रत्यक्ष फिल्ड तथा सामाजिक परियोजनाहरू',
    percentage: 88, 
    color: '#00743a', 
    description: 'Solar panels, deep borehole pumps, medical camps, school computers & flood relief supplies.',
    descriptionNp: 'सौर्य प्रणाली, खानेपानी बोरिङ, स्वास्थ्य शिविर, कम्प्युटर ल्याब र विपद् राहत सामग्री।'
  },
  { 
    label: 'Field Logistics & Monitoring', 
    labelNp: 'फिल्ड ढुवानी तथा प्राविधिक अनुगमन',
    percentage: 8, 
    color: '#003c90', 
    description: 'Engineer field visits, quality inspection of equipment, and community maintenance training.',
    descriptionNp: 'इन्जिनियर निरीक्षण, उपकरण गुणस्तर जाँच र स्थानीय मर्मतसम्भार तालिम।'
  },
  { 
    label: 'Statutory Compliance & Audit', 
    labelNp: 'प्रशासनिक तथा वैधानिक लेखापरीक्षण',
    percentage: 4, 
    color: '#475569', 
    description: 'Independent CA audits, Social Welfare Council statutory filings, and secure platform hosting.',
    descriptionNp: 'स्वतन्त्र सीए अडिट, समाज कल्याण परिषद् कानुनी प्रक्रिया र वेबसाइट व्यवस्थापन।'
  }
];

export const EXPENSE_LEDGER_DATA: {
  id: string;
  date: string;
  item: string;
  itemNp?: string;
  category: string;
  project: string;
  vendor: string;
  amountNpr: number;
  status: 'Verified' | 'Audited';
}[] = [
  {
    id: 'exp-01',
    date: '2024-08-14',
    item: '5kW Monocrystalline Solar Panels & Lithium Inverter (15 Sets)',
    itemNp: '५ किलोवाट मोनोक्रिस्टलाइन सोलार प्यानल र ब्याट्री',
    category: 'Solar & Clean Energy',
    project: 'Solar Powered Classrooms in Karnali',
    vendor: 'Himalayan Solar Engineering Ltd, Kathmandu',
    amountNpr: 1850000,
    status: 'Verified'
  },
  {
    id: 'exp-02',
    date: '2024-08-10',
    item: '250-Foot Deep Borehole Drilling & Submersible Pump Station',
    itemNp: '२५० फिट गहिरो बोरिङ तथा सबमर्सिबल पम्प',
    category: 'Clean Water',
    project: 'Deep Tube-well & Solar Water Filtration in Dhanusha',
    vendor: 'Mithila Borewell & Irrigation Services, Janakpur',
    amountNpr: 1240000,
    status: 'Verified'
  },
  {
    id: 'exp-03',
    date: '2024-08-05',
    item: '350 Cataract Intraocular Lens Kits & Surgical Consumables',
    itemNp: '३५० थान मोतियाबिन्दु लेन्स र शल्यक्रिया सामग्री',
    category: 'Healthcare & Medical',
    project: 'Rural Terai Mobile Medical & Eye Camps',
    vendor: 'Sagarmatha MedTech Supplies, Lahan',
    amountNpr: 580000,
    status: 'Verified'
  },
  {
    id: 'exp-04',
    date: '2024-07-28',
    item: 'Emergency Flood Food Kits (Rice, Lentils, Oil, Tarps for 1,200 Families)',
    itemNp: '१,२०० बाढी पीडित परिवारका लागि खाद्यान्न र त्रिपाल',
    category: 'Disaster Relief',
    project: 'Emergency Flood Relief in Rautahat & Sarlahi',
    vendor: 'Agrawal Grains Wholesale, Gaur',
    amountNpr: 2150000,
    status: 'Verified'
  },
  {
    id: 'exp-05',
    date: '2024-07-15',
    item: '25,000 Fruit & Bamboo Saplings + Nursery Fencing',
    itemNp: '२५,००० फलफूल तथा बाँसका बिरुवा',
    category: 'Environment & Agriculture',
    project: 'Chure Range Green Reforestation & Agroforestry',
    vendor: 'Community Agro Forestry Cooperative, Makwanpur',
    amountNpr: 450000,
    status: 'Verified'
  }
];

export const ANNUAL_AUDIT_REPORTS: {
  id: string;
  fiscalYear: string;
  title: string;
  titleNp?: string;
  fileSize: string;
  auditor: string;
  totalIncomeNpr: number;
  totalExpenditureNpr: number;
}[] = [
  {
    id: 'audit-2080-81',
    fiscalYear: 'FY 2080/81 (2023-2024)',
    title: 'Statutory Financial Audit & SWC Annual Report 2080/81',
    titleNp: 'आर्थिक वर्ष २०८०/८१ को वार्षिक लेखापरीक्षण प्रतिवेदन',
    fileSize: '3.4 MB (PDF)',
    auditor: 'K.B. Shrestha & Associates, Chartered Accountants',
    totalIncomeNpr: 85420000,
    totalExpenditureNpr: 83210000
  },
  {
    id: 'audit-2079-80',
    fiscalYear: 'FY 2079/80 (2022-2023)',
    title: 'Statutory Financial Audit & Tax Exemption Renewal 2079/80',
    titleNp: 'आर्थिक वर्ष २०७९/८० को वार्षिक लेखापरीक्षण प्रतिवेदन',
    fileSize: '2.8 MB (PDF)',
    auditor: 'Nepal Audit Consortium, Kathmandu',
    totalIncomeNpr: 61200000,
    totalExpenditureNpr: 59400000
  },
  {
    id: 'audit-2078-79',
    fiscalYear: 'FY 2078/79 (2021-2022)',
    title: 'Statutory Financial Audit & Project Evaluation 2078/79',
    titleNp: 'आर्थिक वर्ष २०७८/७९ को वार्षिक लेखापरीक्षण प्रतिवेदन',
    fileSize: '2.1 MB (PDF)',
    auditor: 'Subedi & Co., Chartered Accountants',
    totalIncomeNpr: 43500000,
    totalExpenditureNpr: 42100000
  }
];

