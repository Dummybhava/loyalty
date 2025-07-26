# Customer Loyalty Program System

## Overview

This is a full-stack web application for a customer loyalty program built with React, Express, and PostgreSQL. The system allows customers to earn points through purchases, redeem rewards, and participate in tiered loyalty programs. It includes both customer-facing features and administrative management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with React plugin

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Replit Auth using OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL storage
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OIDC
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation/update on authentication
- **Route Protection**: Authentication middleware for protected endpoints

### Loyalty Program Features
- **Point System**: Customers earn points on purchases (configurable rate)
- **Tier System**: Bronze/Silver/Gold tiers with different benefits
- **Rewards Catalog**: Redeemable rewards with point costs
- **Transaction History**: Complete audit trail of point transactions
- **Redemption Tracking**: Track reward redemptions and usage

### Database Schema
- **Users**: Basic user profile information from Replit Auth
- **Customer Loyalty**: Point balances, tiers, lifetime spending
- **Loyalty Programs**: Configurable program rules and rates
- **Rewards**: Available rewards with costs and descriptions
- **Point Transactions**: All point earning/spending activity
- **Reward Redemptions**: Tracking of redeemed rewards
- **Products**: Sample product catalog for demonstrations
- **Sessions**: Secure session storage for authentication

### UI Components
- **Design System**: shadcn/ui components with consistent styling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Interactive Elements**: Modals, forms, progress bars, notifications
- **Admin Interface**: Separate admin section for program management

## Data Flow

### Customer Journey
1. User authenticates via Replit Auth
2. System creates/updates user profile and loyalty data
3. Customer makes purchases earning points based on program rules
4. Points are credited and tier status updated automatically
5. Customer can view available rewards and redeem with points
6. Redemptions are tracked and point balances updated

### Admin Workflow
1. Admin authenticates and accesses admin panel
2. Can create and manage loyalty programs
3. Can add/edit rewards in the catalog
4. Can view analytics and customer statistics
5. Can adjust program parameters and rules

### API Architecture
- **Authentication Endpoints**: Login, logout, user profile
- **Customer Endpoints**: Loyalty data, purchase processing
- **Rewards Endpoints**: Catalog viewing, redemption processing
- **Admin Endpoints**: Program management, analytics, reward management

## External Dependencies

### Authentication
- **Replit Auth**: Primary authentication provider
- **OpenID Connect**: Standard protocol for authentication
- **Session Management**: Server-side session storage

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL hosting
- **Connection Pooling**: Efficient database connection management
- **Environment Variables**: DATABASE_URL for connection configuration

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form state management and validation

### Development Tools
- **TypeScript**: Type safety throughout the application
- **Vite**: Fast development build tool
- **ESBuild**: Production bundling for server code
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with Vite dev server
- **Production**: Bundled client served by Express server
- **Database**: Requires DATABASE_URL environment variable
- **Authentication**: Requires Replit Auth configuration

### Build Process
1. Client assets built with Vite to `dist/public`
2. Server code bundled with ESBuild to `dist/index.js`
3. Database schema deployed with Drizzle migrations
4. Environment variables configured for target environment

### Security Considerations
- **Session Security**: HTTP-only cookies with secure flags
- **CSRF Protection**: Built into authentication flow
- **SQL Injection**: Protected by Drizzle ORM parameterized queries
- **Authentication**: Industry-standard OIDC implementation

### Scalability Features
- **Connection Pooling**: Efficient database connection usage
- **Serverless Ready**: Compatible with serverless deployment platforms
- **Static Assets**: Client assets can be served by CDN
- **Database**: Serverless PostgreSQL scales automatically