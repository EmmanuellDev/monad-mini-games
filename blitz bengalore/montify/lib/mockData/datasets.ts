export interface Dataset {
  id: string;
  name: string;
  description: string;
  category: 'images' | 'text' | 'audio' | 'video' | 'tabular' | 'timeseries';
  price: number;
  qualityScore: number;
  seller: {
    name: string;
    avatar: string;
    reputation: number;
    memberId: string;
  };
  thumbnail: string;
  format: string;
  size: string;
  samples: string;
  features: string;
  license: string;
  tags: string[];
  verified: boolean;
  blockchainCertified: boolean;
  trainingVerified: boolean;
  views: number;
  downloads: number;
  favorites: number;
  lastUpdated: string;
  metrics: {
    diversity: number;
    accuracy: number;
    bias: 'low' | 'medium' | 'high';
    format: number;
  };
}

export const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Medical X-Ray Images Dataset',
    description: 'High-resolution chest X-ray images with expert annotations for pneumonia detection. Includes 100,000+ images with diverse patient demographics.',
    category: 'images',
    price: 299,
    qualityScore: 94,
    seller: {
      name: 'Dr. Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      reputation: 4.8,
      memberId: '0x1234...5678'
    },
    thumbnail: '/datasets/xray.jpg',
    format: 'PNG',
    size: '2.4 GB',
    samples: '100,000',
    features: '48',
    license: 'CC BY 4.0',
    tags: ['medical', 'computer-vision', 'healthcare', 'radiology'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: true,
    views: 15234,
    downloads: 892,
    favorites: 1456,
    lastUpdated: '2024-11-05',
    metrics: {
      diversity: 94,
      accuracy: 98,
      bias: 'low',
      format: 96
    }
  },
  {
    id: '2',
    name: 'Financial News Sentiment Analysis',
    description: 'Comprehensive collection of financial news articles with sentiment labels. Perfect for NLP and trading signal generation.',
    category: 'text',
    price: 199,
    qualityScore: 89,
    seller: {
      name: 'FinTech Analytics',
      avatar: '/avatars/fintech.jpg',
      reputation: 4.6,
      memberId: '0x2345...6789'
    },
    thumbnail: '/datasets/finance.jpg',
    format: 'JSON',
    size: '1.8 GB',
    samples: '500,000',
    features: '12',
    license: 'CC BY-NC 4.0',
    tags: ['nlp', 'finance', 'sentiment', 'trading'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: false,
    views: 8932,
    downloads: 445,
    favorites: 723,
    lastUpdated: '2024-11-08',
    metrics: {
      diversity: 87,
      accuracy: 92,
      bias: 'low',
      format: 95
    }
  },
  {
    id: '3',
    name: 'Urban Traffic Flow Sensor Data',
    description: 'Real-time traffic sensor data from major urban intersections. 2 years of continuous monitoring with weather correlations.',
    category: 'timeseries',
    price: 449,
    qualityScore: 96,
    seller: {
      name: 'SmartCity Research',
      avatar: '/avatars/smartcity.jpg',
      reputation: 4.9,
      memberId: '0x3456...7890'
    },
    thumbnail: '/datasets/traffic.jpg',
    format: 'Parquet',
    size: '5.2 GB',
    samples: '2,000,000',
    features: '24',
    license: 'CC0 1.0',
    tags: ['timeseries', 'transportation', 'iot', 'forecasting'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: true,
    views: 12456,
    downloads: 678,
    favorites: 1089,
    lastUpdated: '2024-11-07',
    metrics: {
      diversity: 98,
      accuracy: 96,
      bias: 'low',
      format: 97
    }
  },
  {
    id: '4',
    name: 'E-commerce Product Images',
    description: 'High-quality product images across 50+ categories with background removal and multiple angles. Perfect for training recommendation systems.',
    category: 'images',
    price: 349,
    qualityScore: 92,
    seller: {
      name: 'DataMart Solutions',
      avatar: '/avatars/datamart.jpg',
      reputation: 4.7,
      memberId: '0x4567...8901'
    },
    thumbnail: '/datasets/products.jpg',
    format: 'JPG',
    size: '3.6 GB',
    samples: '250,000',
    features: '32',
    license: 'CC BY 4.0',
    tags: ['ecommerce', 'computer-vision', 'retail', 'classification'],
    verified: true,
    blockchainCertified: false,
    trainingVerified: true,
    views: 9876,
    downloads: 523,
    favorites: 891,
    lastUpdated: '2024-11-06',
    metrics: {
      diversity: 91,
      accuracy: 94,
      bias: 'low',
      format: 93
    }
  },
  {
    id: '5',
    name: 'Customer Support Conversation Logs',
    description: 'Anonymized customer support conversations with resolution outcomes. Includes multi-turn dialogues and satisfaction ratings.',
    category: 'text',
    price: 279,
    qualityScore: 88,
    seller: {
      name: 'ServiceAI Labs',
      avatar: '/avatars/serviceai.jpg',
      reputation: 4.5,
      memberId: '0x5678...9012'
    },
    thumbnail: '/datasets/support.jpg',
    format: 'CSV',
    size: '1.2 GB',
    samples: '150,000',
    features: '18',
    license: 'CC BY-SA 4.0',
    tags: ['nlp', 'chatbot', 'customer-service', 'dialogue'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: false,
    views: 7234,
    downloads: 389,
    favorites: 654,
    lastUpdated: '2024-11-04',
    metrics: {
      diversity: 86,
      accuracy: 90,
      bias: 'medium',
      format: 92
    }
  },
  {
    id: '6',
    name: 'Environmental Audio Recordings',
    description: 'Diverse environmental sounds including wildlife, urban, and natural soundscapes. Professionally labeled with temporal annotations.',
    category: 'audio',
    price: 189,
    qualityScore: 91,
    seller: {
      name: 'EcoSound Research',
      avatar: '/avatars/ecosound.jpg',
      reputation: 4.8,
      memberId: '0x6789...0123'
    },
    thumbnail: '/datasets/audio.jpg',
    format: 'WAV',
    size: '4.8 GB',
    samples: '50,000',
    features: '64',
    license: 'CC BY 4.0',
    tags: ['audio', 'environmental', 'classification', 'wildlife'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: true,
    views: 6543,
    downloads: 312,
    favorites: 567,
    lastUpdated: '2024-11-03',
    metrics: {
      diversity: 93,
      accuracy: 89,
      bias: 'low',
      format: 94
    }
  },
  {
    id: '7',
    name: 'Stock Market Historical Data',
    description: 'Comprehensive stock market data including OHLCV, volume, and technical indicators for 5000+ tickers over 10 years.',
    category: 'tabular',
    price: 399,
    qualityScore: 95,
    seller: {
      name: 'QuantData Pro',
      avatar: '/avatars/quantdata.jpg',
      reputation: 4.9,
      memberId: '0x7890...1234'
    },
    thumbnail: '/datasets/stocks.jpg',
    format: 'Parquet',
    size: '6.4 GB',
    samples: '5,000,000',
    features: '42',
    license: 'CC BY-NC 4.0',
    tags: ['finance', 'trading', 'timeseries', 'quantitative'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: true,
    views: 18765,
    downloads: 1023,
    favorites: 1876,
    lastUpdated: '2024-11-08',
    metrics: {
      diversity: 97,
      accuracy: 99,
      bias: 'low',
      format: 98
    }
  },
  {
    id: '8',
    name: 'Video Surveillance Anomaly Detection',
    description: 'Curated video clips for anomaly detection in surveillance scenarios. Includes normal and anomalous events with frame-level annotations.',
    category: 'video',
    price: 529,
    qualityScore: 93,
    seller: {
      name: 'SecureVision AI',
      avatar: '/avatars/securevision.jpg',
      reputation: 4.7,
      memberId: '0x8901...2345'
    },
    thumbnail: '/datasets/surveillance.jpg',
    format: 'MP4',
    size: '8.9 GB',
    samples: '10,000',
    features: '128',
    license: 'Custom',
    tags: ['video', 'security', 'anomaly-detection', 'computer-vision'],
    verified: true,
    blockchainCertified: true,
    trainingVerified: false,
    views: 5432,
    downloads: 234,
    favorites: 456,
    lastUpdated: '2024-11-02',
    metrics: {
      diversity: 90,
      accuracy: 95,
      bias: 'low',
      format: 94
    }
  }
];

export const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    images: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
    audio: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    video: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    tabular: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>',
    timeseries: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  };
  return icons[category] || icons.tabular;
};
