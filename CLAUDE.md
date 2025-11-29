# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Warsaw Software Architecture Group (WSAG) website built with Astro 5, Tailwind CSS 4, and TypeScript. It's a bilingual (Polish/English) community website for organizing and promoting software architecture meetups in Warsaw.

## Development Commands

- `npm run dev` - Start development server at `localhost:4321`
- `npm run build` - Build production site to `./dist/`
- `npm run preview` - Preview production build locally
- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro check`)

## Architecture & Structure

### Internationalization (i18n)

The site supports Polish (default) and English through a custom i18n implementation:

- **Translation system**: `src/i18n/translations.ts` contains a comprehensive nested translations object with Polish (`pl`) and English (`en`) keys
- **Helper functions**: `getTranslations(lang)` and `t(lang, key)` for accessing translations
- **URL structure**: Polish pages at root (`/`), English pages under `/en/` prefix
- **Page organization**: Each route has both Polish and English versions:
  - Polish: `src/pages/[page].astro`
  - English: `src/pages/en/[page].astro`

When adding new pages or content, always:
1. Add translations to both `pl` and `en` objects in `translations.ts`
2. Create both Polish and English page variants
3. Update sitemap generation in `src/pages/sitemap.xml.ts`

### Event System

Events are the core content type, managed through a type-safe data layer:

- **Data source**: `src/data/events.json` - centralized JSON file with all events
- **Type definitions**: `src/data/events.ts` defines TypeScript interfaces:
  - `Event` - main event object with metadata, speakers, presentations, location
  - `Speaker` - speaker profiles with bio, social links, company info
  - `Presentation` - individual talks with title, description, level, duration, tags
  - `EventLocation` - venue details with address, directions, parking, accessibility
  - `EventResources` - post-event materials (slides, video, code, blog)
  - `AgendaItem` - schedule items with time, type, and speaker references

- **Helper functions in `events.ts`**:
  - `getEventBySlug(slug)` - find event by URL slug
  - `getEventByDateAndId(dateStr, meetupId)` - find event by date and ID
  - `generateEventUrl(event)` - create event URL from event object
  - `getUpcomingEvents()` - filter events with status 'upcoming'
  - `getPastEvents()` - filter events with status 'completed'

- **Dynamic routing**: Events use Astro's dynamic routes at `/events/[date]/meetup-[id].astro`
  - `getStaticPaths()` generates routes from events array at build time
  - Date format: ISO date string (YYYY-MM-DD)
  - URL pattern: `/events/2025-01-15/meetup-1`

When adding events:
1. Add event data to `src/data/events.json` following the Event interface structure
2. Include all required fields: id, meetupId, title, slug, date, time, speakers, presentations, etc.
3. Ensure speaker IDs match between presentations and speakers array (use kebab-case of speaker name)
4. The event detail page will be automatically generated at build time

### Layout System

- **Base layout**: `src/layouts/Layout.astro` provides HTML structure with:
  - SEO meta tags (Open Graph, Twitter Cards, Schema.org JSON-LD)
  - Language alternates for bilingual pages
  - Canonical URLs
  - Google Fonts (Inter font family)
  - Responsive meta viewport
  - Favicon configuration

- **Common components**:
  - `Footer.astro` - site-wide footer with links and social media
  - `Navigation.astro` - main navigation with language switcher
  - `Hero.astro` / `HeroLogo.astro` - homepage hero sections
  - `Events.astro` - events listing component
  - `Speakers.astro` - speakers grid
  - `Location.astro` - venue information with map
  - `About.astro` - about section
  - `Partners.astro` / `Organizers.astro` - community section components

### Styling

- **Framework**: Tailwind CSS 4 configured via Vite plugin in `astro.config.mjs`
- **Global styles**: `src/styles/global.css` imported in Layout.astro
- **Typography**: Inter font family from Google Fonts
- **Design system**: Uses Tailwind utility classes with custom color scheme:
  - Primary: Blue/Indigo gradients
  - Accent colors for status indicators (green, yellow, red for difficulty levels)
  - Gray scale for text hierarchy

### Maps Integration

Event detail pages use Leaflet.js for interactive maps:
- Loaded from CDN (unpkg.com)
- Geocoding via OpenStreetMap Nominatim API
- Fallback to default Warsaw center if geocoding fails
- Shows venue location with popup marker

## Key Patterns

### Adding New Pages

1. Create Polish version: `src/pages/[name].astro`
2. Create English version: `src/pages/en/[name].astro`
3. Add translations to `src/i18n/translations.ts`
4. Update sitemap in `src/pages/sitemap.xml.ts` staticPages array
5. Add navigation links in `Navigation.astro` if needed

### Working with Events

Events follow a structured data model. When modifying event-related code:
- Always maintain type safety with TypeScript interfaces from `events.ts`
- Use helper functions (`getEventBySlug`, etc.) rather than direct array manipulation
- Event URLs are generated from date + meetupId, not slugs
- Speaker references use kebab-case IDs derived from speaker names

### SEO Considerations

- Each page should pass `title`, `description`, `lang`, and optionally `image` to Layout
- Title automatically appends " - WSAG" unless "WSAG" already present
- Canonical URLs are auto-generated from Astro.url
- Language alternates are automatically added for bilingual pages
- Event pages include structured data (Schema.org Event type)

## TypeScript Configuration

Extends Astro's strict TypeScript config. The codebase uses:
- Strict mode enabled
- Type inference for translations
- Exported types for reuse (`Language`, `TranslationKey`, `Event`, etc.)
