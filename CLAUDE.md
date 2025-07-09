# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is an Entertainment Intelligence Dashboard built with React, TypeScript, and Vite. It provides comprehensive insights into the entertainment industry ecosystem, including events, artists, venues, and promoters. The project uses a modern stack with shadcn/ui components, Tailwind CSS, and Supabase for backend data.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 8080
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

### Installation
```bash
npm install
```

## Architecture

### Project Structure
- `src/pages/` - Main page components (Index, Events, Artists, Venues, Promoters)
- `src/components/` - Reusable UI components organized by feature
  - `components/Events/` - Event-related components
  - `components/shared/` - Shared components across features
  - `components/ui/` - shadcn/ui components
  - `components/Dashboard/` - Dashboard layout components
- `src/hooks/` - Custom React hooks for data fetching and state management
- `src/data/` - Data models, types, and mock data
- `src/types/` - TypeScript type definitions organized by feature
- `src/lib/` - Utility libraries including Supabase client
- `src/utils/` - Utility functions and transformers

### Key Technologies
- **React 18** with TypeScript
- **Vite** for build tooling
- **React Query (@tanstack/react-query)** for data fetching and caching
- **Supabase** for backend database operations
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Router** for navigation

### Data Flow
1. **Custom Hooks Pattern**: Data fetching is handled through custom hooks (e.g., `useEventSearch`, `useArtistAnalytics`)
2. **React Query**: All API calls are wrapped with React Query for caching and optimistic updates
3. **Supabase Integration**: Database operations use the Supabase client (`src/lib/supabase.ts`)
4. **Type Safety**: Comprehensive TypeScript types in `src/types/` directory

### Component Architecture
- **Layout System**: `DashboardLayout` wraps all pages with consistent styling
- **Sidebar Navigation**: `AppSidebar` provides main navigation
- **Feature-Based Organization**: Components are grouped by feature (Events, Artists, Venues, Promoters)
- **Shared Components**: Common UI elements in `components/shared/`

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built accessible components
- **CSS Variables**: Theme configuration through CSS custom properties
- **Responsive Design**: Mobile-first approach with breakpoint utilities

### State Management
- **React Query**: Server state management and caching
- **React Context**: UI state (sidebar, tooltips, toasts)
- **URL State**: Search parameters and filters managed through React Router

## Development Notes

### Working with Data
- All data operations should use React Query hooks
- Database queries are handled through Supabase client
- Mock data is available in `src/data/` for development
- Type definitions are centralized in `src/types/`

### Adding New Features
1. Create types in appropriate `src/types/` file
2. Build custom hooks for data operations in `src/hooks/`
3. Create feature components in relevant `src/components/` directory
4. Add routes in `App.tsx` if needed

### Component Development
- Use shadcn/ui components as building blocks
- Follow existing patterns for layout and styling
- Implement proper TypeScript interfaces
- Add loading states and error handling
- Use React Query for data fetching

### Database Schema
The project uses Supabase with views like `event_list_summary` that provide optimized data for the frontend. Key fields include:
- Events: `name`, `date`, `venue_name`, `venue_city`, `genre`, `status`, `top_artists`, `ticket_availability`
- Complex filtering on JSONB fields for artists and ticket providers
- Pagination and sorting support built into hooks