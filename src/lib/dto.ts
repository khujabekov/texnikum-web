export interface StatItem {
  label: string;
  value: string;
}

export interface DirectionItem {
  id: number;
  title: string;
  slug: string;
  shortDesc: string;
  duration: string;
  eduForm: string;
  imageUrl: string;
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  excerpt: string;
  dateLabel: string;
  views: number;
}

export interface StaffItem {
  id: number;
  fullName: string;
  role: string;
  department: string;
  bio: string;
  imageUrl: string;
  initials: string;
}

export interface GalleryPhoto {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

export interface ContactInfo {
  address: string;
  phones: string[];
  email: string;
  workHours: string;
  mapEmbedUrl: string;
}
