import { Country } from '../types';

export const countries: Country[] = [
  // Top Study Abroad Destinations
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    description: 'World-class universities and diverse opportunities',
    studyDescription: 'Home to Ivy League universities and cutting-edge research facilities',
    travelDescription: 'From NYC to California, experience diverse landscapes and cultures',
    popular: true
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'Historic universities and rich cultural heritage',
    studyDescription: 'Oxford, Cambridge, and world-renowned institutions',
    travelDescription: 'Historic castles, vibrant cities, and countryside charm',
    popular: true
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    description: 'Quality education and welcoming immigration policies',
    studyDescription: 'Affordable education with post-graduation work opportunities',
    travelDescription: 'Natural wonders, friendly locals, and multicultural cities',
    popular: true
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    description: 'High-quality education and unique lifestyle',
    studyDescription: 'Group of Eight universities and research excellence',
    travelDescription: 'Unique wildlife, stunning beaches, and adventure sports',
    popular: true
  },
  {
    code: 'DE',
    name: 'Germany',
    flag: '🇩🇪',
    description: 'Engineering excellence and tuition-free education',
    studyDescription: 'World-class engineering and research programs',
    travelDescription: 'Rich history, beautiful architecture, and Oktoberfest',
    popular: true
  },
  {
    code: 'FR',
    name: 'France',
    flag: '🇫🇷',
    description: 'Art, culture, and prestigious institutions',
    studyDescription: 'Sorbonne and other prestigious universities',
    travelDescription: 'Art, cuisine, fashion, and romantic destinations',
    popular: true
  },
  {
    code: 'NL',
    name: 'Netherlands',
    flag: '🇳🇱',
    description: 'Innovation hub with English-taught programs',
    studyDescription: 'High-quality education with many English programs',
    travelDescription: 'Canals, tulips, museums, and liberal culture',
    popular: true
  },
  {
    code: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    description: 'Gateway to Asia with world-class education',
    studyDescription: 'NUS, NTU and excellent business programs',
    travelDescription: 'Modern city-state with diverse food and culture',
    popular: true
  },
  {
    code: 'CH',
    name: 'Switzerland',
    flag: '🇨🇭',
    description: 'Premium education and stunning landscapes',
    studyDescription: 'ETH Zurich and hospitality management schools',
    travelDescription: 'Alps, luxury, precision, and outdoor adventures',
    popular: true
  },
  {
    code: 'SE',
    name: 'Sweden',
    flag: '🇸🇪',
    description: 'Innovation and sustainability focus',
    studyDescription: 'KTH, Lund University, and tech innovation',
    travelDescription: 'Northern lights, design, and sustainable living',
    popular: true
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    flag: '🇳🇿',
    description: 'Adventure and quality education',
    studyDescription: 'University of Auckland and research opportunities',
    travelDescription: 'Lord of the Rings landscapes and adventure sports',
    popular: false
  },
  {
    code: 'NO',
    name: 'Norway',
    flag: '🇳🇴',
    description: 'Free education and natural beauty',
    studyDescription: 'University of Oslo and free higher education',
    travelDescription: 'Fjords, northern lights, and Viking heritage',
    popular: false
  },
  {
    code: 'DK',
    name: 'Denmark',
    flag: '🇩🇰',
    description: 'Hygge lifestyle and quality education',
    studyDescription: 'University of Copenhagen and design programs',
    travelDescription: 'Copenhagen, LEGO, and Scandinavian design',
    popular: false
  },
  {
    code: 'FI',
    name: 'Finland',
    flag: '🇫🇮',
    description: 'Education excellence and innovation',
    studyDescription: 'University of Helsinki and tech education',
    travelDescription: 'Lapland, saunas, and northern wilderness',
    popular: false
  },
  {
    code: 'AT',
    name: 'Austria',
    flag: '🇦🇹',
    description: 'Music, culture, and Alpine beauty',
    studyDescription: 'University of Vienna and music conservatories',
    travelDescription: 'Mozart, Alps, and classical architecture',
    popular: false
  },
  {
    code: 'BE',
    name: 'Belgium',
    flag: '🇧🇪',
    description: 'EU headquarters and chocolate',
    studyDescription: 'KU Leuven and European studies',
    travelDescription: 'Brussels, Bruges, waffles, and beer',
    popular: false
  },
  {
    code: 'IE',
    name: 'Ireland',
    flag: '🇮🇪',
    description: 'Friendly culture and tech hub',
    studyDescription: 'Trinity College Dublin and tech programs',
    travelDescription: 'Green landscapes, pubs, and Celtic culture',
    popular: false
  },
  {
    code: 'IT',
    name: 'Italy',
    flag: '🇮🇹',
    description: 'Art, history, and culinary excellence',
    studyDescription: 'Bocconi University and art programs',
    travelDescription: 'Rome, Venice, art, and incredible cuisine',
    popular: false
  },
  {
    code: 'ES',
    name: 'Spain',
    flag: '🇪🇸',
    description: 'Vibrant culture and affordable living',
    studyDescription: 'IE Business School and language programs',
    travelDescription: 'Flamenco, beaches, architecture, and festivals',
    popular: false
  },
  {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    description: 'Affordable Europe with great weather',
    studyDescription: 'University of Porto and emerging tech scene',
    travelDescription: 'Lisbon, Porto, beaches, and affordable living',
    popular: false
  },
  {
    code: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    description: 'Technology innovation and rich culture',
    studyDescription: 'University of Tokyo and technology programs',
    travelDescription: 'Tokyo, Kyoto, technology, and traditional culture',
    popular: false
  },
  {
    code: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    description: 'K-culture and technological advancement',
    studyDescription: 'Seoul National University and tech innovation',
    travelDescription: 'Seoul, K-pop, technology, and Korean culture',
    popular: false
  },
  {
    code: 'CN',
    name: 'China',
    flag: '🇨🇳',
    description: 'Ancient culture meets modern innovation',
    studyDescription: 'Tsinghua University and business programs',
    travelDescription: 'Great Wall, modern cities, and rich history',
    popular: false
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    flag: '🇭🇰',
    description: 'East meets West financial hub',
    studyDescription: 'HKU and international business programs',
    travelDescription: 'Skyline, dim sum, and cultural fusion',
    popular: false
  },
  {
    code: 'MY',
    name: 'Malaysia',
    flag: '🇲🇾',
    description: 'Multicultural hub in Southeast Asia',
    studyDescription: 'University of Malaya and affordable education',
    travelDescription: 'Kuala Lumpur, diverse culture, and tropical beauty',
    popular: false
  },
  {
    code: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    description: 'Land of smiles and tropical paradise',
    studyDescription: 'Chulalongkorn University and hospitality programs',
    travelDescription: 'Bangkok, beaches, temples, and street food',
    popular: false
  },
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    description: 'Diverse culture and growing economy',
    studyDescription: 'IITs, IIMs, and technology programs',
    travelDescription: 'Taj Mahal, diverse cultures, and spiritual journeys',
    popular: false
  },
  {
    code: 'AE',
    name: 'UAE',
    flag: '🇦🇪',
    description: 'Modern oasis in the Middle East',
    studyDescription: 'American University of Sharjah and business programs',
    travelDescription: 'Dubai, Abu Dhabi, luxury, and desert adventures',
    popular: false
  },
  {
    code: 'ZA',
    name: 'South Africa',
    flag: '🇿🇦',
    description: 'Rainbow nation with diverse experiences',
    studyDescription: 'University of Cape Town and research programs',
    travelDescription: 'Safari, Cape Town, wine country, and wildlife',
    popular: false
  },
  {
    code: 'BR',
    name: 'Brazil',
    flag: '🇧🇷',
    description: 'Vibrant culture and natural wonders',
    studyDescription: 'USP and Portuguese language programs',
    travelDescription: 'Rio, Amazon, beaches, and carnival culture',
    popular: false
  }
];

export const getCountriesByCategory = (_category: 'study' | 'travel') => {
  // Sort by popularity first, then alphabetically
  return countries.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.name.localeCompare(b.name);
  });
};