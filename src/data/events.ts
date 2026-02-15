export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  photo?: string;
}

export interface BilingualText {
  pl: string;
  en: string;
}

export interface PresentationResource {
  type: 'recording' | 'slides' | 'template' | 'book' | 'code' | 'blog' | 'other';
  title: string | BilingualText;
  url: string;
}

export interface Presentation {
  id: string;
  title: string | BilingualText;
  description: string | BilingualText;
  speakerId: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'pl' | 'en'; // Language the presentation is given in
  tags: string[];
  resources?: PresentationResource[];
}

// Helper function to get localized text from a string or BilingualText object
export function getLocalizedText(text: string | BilingualText, lang: 'pl' | 'en'): string {
  if (typeof text === 'string') {
    return text;
  }
  return text[lang] || text.pl || text.en || '';
}

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  speakerIds?: string[]; // For multiple speakers
  presentationId?: string; // Link to presentation
  description: string;
  type: 'talk' | 'break' | 'networking' | 'workshop' | 'presentation';
  duration?: number; // in minutes
}

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  mapUrl: string;
  directions?: string;
  parking?: string;
  accessibility?: string;
}

export interface EventResources {
  slides?: string;
  video?: string;
  code?: string;
  blog?: string;
  photos?: string;
}

export interface VenuePartner {
  name: string;
  url: string;
  logo: string;
}

export interface Event {
  id: string;
  meetupId: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  endTime: string;
  description: string | BilingualText;
  longDescription: string | BilingualText;
  location: EventLocation;
  speakers: Speaker[];
  presentations: Presentation[];
  agenda: AgendaItem[];
  maxAttendees: number;
  registeredAttendees?: number;
  registrationUrl?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  resources?: EventResources;
  venuePartner?: VenuePartner;
  tags: string[];
  prerequisites?: string[];
  targetAudience: string[];
}

import eventsData from './events.json';

export const events: Event[] = eventsData as Event[];

export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find(event => event.slug === slug);
}

export function getEventByDateAndId(dateStr: string, meetupId: number): Event | undefined {
  return events.find(event => {
    const eventDate = toLocalDateString(new Date(event.date));
    return eventDate === dateStr && event.meetupId === meetupId;
  });
}

export function generateEventUrl(event: Event, lang: 'pl' | 'en' = 'pl'): string {
  const eventDate = toLocalDateString(new Date(event.date));
  const prefix = lang === 'en' ? '/en' : '';
  return `${prefix}/events/${eventDate}/meetup-${event.meetupId}`;
}

export function getUpcomingEvents(): Event[] {
  return events.filter(event => event.status === 'upcoming');
}

export function getPastEvents(): Event[] {
  return events.filter(event => event.status === 'completed');
}