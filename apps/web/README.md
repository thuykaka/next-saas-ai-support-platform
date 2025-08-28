# Echo Web CMS

The main Content Management System (CMS) for the Echo customer support widget platform. This Next.js application provides a comprehensive dashboard for managing customer support operations, widget customization, integrations, and billing.

## Overview

This is the primary web application that serves as the control center for the Echo widget platform. It provides a complete dashboard interface for organizations to manage their customer support operations, customize their widget appearance, configure integrations, and handle billing.

## Features

### 🔐 Authentication & Organization Management

- **Clerk Integration**: Secure authentication with Clerk
- **Multi-organization Support**: Organization switching and management
- **Role-based Access Control**: Different permissions for different user roles

### 💬 Customer Support Management

- **Conversations**: View and manage all customer conversations
- **Real-time Chat**: Live chat interface for customer support
- **Message History**: Complete conversation history and analytics
- **Contact Management**: Handle customer contact information

### 📚 Knowledge Base

- **File Management**: Upload and manage support documents
- **Document Processing**: AI-powered document analysis and indexing
- **Search & Retrieval**: Intelligent search through knowledge base
- **RAG Integration**: Retrieval-Augmented Generation for better responses

### 🎨 Widget Customization

- **Visual Customization**: Customize widget appearance and branding
- **Theme Management**: Dark/light mode and custom color schemes
- **Positioning**: Configure widget position and behavior
- **Branding**: Add custom logos and company branding

### 🔌 Integrations

- **Multiple Platforms**: Support for HTML, React, Next.js, JavaScript
- **Easy Embedding**: One-click widget integration
- **Code Snippets**: Pre-configured code snippets for different platforms
- **API Integration**: RESTful API for custom integrations

### 🎤 Voice Assistant

- **Vapi AI Integration**: Voice calling capabilities
- **Voice Configuration**: Set up voice assistant settings
- **Call Management**: Handle voice calls and recordings

### 💳 Plans & Billing

- **Subscription Management**: Handle different subscription plans
- **Payment Processing**: Secure payment handling
- **Usage Analytics**: Track usage and billing metrics
- **Plan Upgrades/Downgrades**: Manage subscription changes

## Development

### Requirements

- Node.js 18+
- pnpm

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
turbo dev
```

The CMS will run at `http://localhost:3000`

### Build for Production

```bash
turbo build
```

## Project Structure

```
app/
├── (auth)/              # Authentication routes
│   ├── layout.tsx
│   ├── sign-in/
│   ├── sign-up/
│   └── org-select/
├── (dashboard)/         # Main dashboard routes
│   ├── layout.tsx       # Dashboard layout with sidebar
│   ├── page.tsx         # Dashboard home
│   ├── conversations/   # Chat management
│   ├── files/          # Knowledge base
│   ├── customization/  # Widget customization
│   ├── integrations/   # Platform integrations
│   ├── plugins/        # Voice assistant & plugins
│   └── billing/        # Plans & billing
├── api/                # API routes
├── layout.tsx          # Root layout
└── global-error.tsx    # Error handling

modules/
├── auth/               # Authentication module
│   └── ui/
│       ├── components/
│       └── views/
├── dashboard/          # Dashboard module
│   └── ui/
│       ├── components/
│       │   ├── app-header.tsx
│       │   ├── app-sidebar.tsx
│       │   └── search-with-kbar.tsx
│       └── constants/
│           └── nav.ts
├── conversations/      # Chat management
│   ├── store/
│   └── ui/
├── files/             # Knowledge base
│   └── ui/
├── widget-customization/ # Widget customization
│   └── ui/
├── integrations/      # Platform integrations
│   ├── constants.ts
│   ├── utils.ts
│   └── ui/
├── plugins/           # Voice assistant & plugins
│   ├── hooks/
│   └── ui/
└── billing/           # Plans & billing
    └── ui/

components/
├── providers.tsx      # React providers
├── theme-provider.tsx # Theme management
└── theme-toggle.tsx   # Theme toggle

hooks/
├── use-media-query.ts # Media query hooks
└── use-mobile.ts      # Mobile detection

lib/
├── auth.ts           # Authentication utilities
├── common.ts         # Common utilities
└── convex.ts         # Convex client configuration
```

## Navigation Structure

### Customer Support

- **Conversations**: Manage customer chat conversations
- **Knowledge Base**: Upload and manage support documents

### Configuration

- **Widget Customization**: Customize widget appearance and behavior
- **Integrations**: Configure platform integrations
- **Voice Assistant**: Set up voice calling capabilities

### Account

- **Plan & Billing**: Manage subscription and billing

## Dependencies

### Core Dependencies

- **Next.js 15**: React framework with App Router
- **React 19**: UI library
- **Clerk**: Authentication and user management
- **Convex**: Backend and real-time data
- **Zustand**: State management
- **Lucide React**: Icons
- **Sonner**: Toast notifications

### UI Dependencies

- **@workspace/ui**: Shared UI components
- **next-themes**: Theme management
- **Tailwind CSS**: Styling
- **kbar**: Command palette
- **nextjs-toploader**: Loading indicators

### Integration Dependencies

- **@convex-dev/agent**: AI agent capabilities
- **@vapi-ai/web**: Voice calling integration
- **react-hook-form**: Form handling
- **zod**: Schema validation
- **date-fns**: Date utilities

## Configuration

### Environment Variables

The CMS requires the following environment variables:

- **Clerk Configuration**: Authentication settings
- **Convex Configuration**: Backend connection
- **Sentry Configuration**: Error monitoring
- **Vapi AI Configuration**: Voice calling setup

### Sentry Integration

The CMS includes Sentry for error monitoring and performance tracking:

- Automatic error reporting
- Performance monitoring
- Source map uploads
- Vercel integration

## Authentication Flow

1. **Sign In/Sign Up**: Users authenticate via Clerk
2. **Organization Selection**: Users select or create an organization
3. **Dashboard Access**: Authenticated users access the main dashboard
4. **Role-based Permissions**: Different features based on user role

## Widget Integration

The CMS provides integration options for:

- **HTML**: Simple script tag integration
- **React**: React component integration
- **Next.js**: Next.js specific integration
- **JavaScript**: Vanilla JavaScript integration

Each integration provides:

- Pre-configured code snippets
- Organization-specific configuration
- Easy copy-paste implementation

## State Management

The CMS uses Zustand for state management across modules:

- **Authentication State**: User and organization data
- **Conversation State**: Chat and message management
- **Widget State**: Customization and settings
- **Billing State**: Subscription and payment data

## Styling

The CMS uses:

- **Tailwind CSS** for styling
- **next-themes** for dark/light mode
- **Geist** and **Geist Mono** fonts
- **Responsive design** for all screen sizes
- **Sidebar navigation** with collapsible menu

## Notes

- The CMS is designed as a comprehensive dashboard for widget management
- All routes are protected with authentication guards
- Organization context is maintained throughout the application
- Real-time updates via Convex for live data synchronization
- Mobile-responsive design for all dashboard features
- Comprehensive error handling with Sentry integration
