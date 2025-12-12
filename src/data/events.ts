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

export interface Presentation {
  id: string;
  title: string;
  description: string;
  speakerId: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
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

export interface Event {
  id: string;
  meetupId: number;
  title: string;
  slug: string;
  date: string;
  time: string;
  endTime: string;
  description: string;
  longDescription: string;
  location: EventLocation;
  speakers: Speaker[];
  presentations: Presentation[];
  agenda: AgendaItem[];
  maxAttendees: number;
  registeredAttendees?: number;
  registrationUrl?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  resources?: EventResources;
  tags: string[];
  prerequisites?: string[];
  targetAudience: string[];
}

import eventsData from './events.json';

export const events: Event[] = eventsData as Event[];

export function getEventBySlug(slug: string): Event | undefined {
  return events.find(event => event.slug === slug);
}

export function getEventByDateAndId(dateStr: string, meetupId: number): Event | undefined {
  return events.find(event => {
    const eventDate = new Date(event.date).toISOString().split('T')[0];
    return eventDate === dateStr && event.meetupId === meetupId;
  });
}

export function generateEventUrl(event: Event, lang: 'pl' | 'en' = 'pl'): string {
  const eventDate = new Date(event.date).toISOString().split('T')[0];
  const prefix = lang === 'en' ? '/en' : '';
  return `${prefix}/events/${eventDate}/meetup-${event.meetupId}`;
}

export function getUpcomingEvents(): Event[] {
  return events.filter(event => event.status === 'upcoming');
}

export function getPastEvents(): Event[] {
  return events.filter(event => event.status === 'completed');
}