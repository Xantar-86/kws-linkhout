import type React from "react";

// ============================================================
// Nieuws
// ============================================================

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "clubnieuws" | "ploegnieuws" | "evenementen";
  image: string;
  date: string;
  author: string;
  readTime: number;
  featured?: boolean;
  attachment?: string;
}

// ============================================================
// Wedstrijden
// ============================================================

export interface WedstrijdEvent {
  summary: string;
  start: Date;
  location: string;
  description: string;
}

export interface WedstrijdenResponse {
  wedstrijden: WedstrijdEvent[];
  volgende: WedstrijdEvent | null;
  bron?: "handmatig" | "ics";
  error?: string;
}

export interface HandmatigeWedstrijd {
  datum: string;
  thuis: string;
  uit: string;
  locatie: string;
  isThuis: boolean;
}

export interface HandmatigeData {
  seizoen: string;
  ploeg: string;
  competitie: string;
  wedstrijden: HandmatigeWedstrijd[];
}

// ============================================================
// Events
// ============================================================

export interface ClubEvent {
  title: string;
  date: string;
  description: string;
  color: string;
}

// ============================================================
// Quick Links
// ============================================================

export interface QuickLink {
  title: string;
  icon: (props: { className?: string }) => React.ReactNode;
  href: string;
  description: string;
  color: string;
}
