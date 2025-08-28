# Echo Widget

A Next.js application that provides a customer support chat widget interface designed to be embedded as an iframe.

## Overview

This module serves as the chat interface that gets loaded inside the embed widget. It provides a complete customer support experience with multiple screens including authentication, chat, voice calls, and contact forms.

## Features

- **Multi-screen Interface**: Loading, selection, voice, auth, inbox, chat, contact, and error screens
- **Voice Integration**: Built-in voice calling capabilities using Vapi AI
- **Real-time Chat**: Live chat functionality with message history
- **Authentication**: User authentication and session management
- **Responsive Design**: Optimized for iframe embedding
- **Theme Support**: Dark/light mode with next-themes
- **State Management**: Zustand stores for screen management and data persistence

## Screens

The widget includes the following screens:

- **Loading**: Initial loading state while fetching organization data
- **Selection**: Choose between different support options
- **Voice**: Voice calling interface with Vapi AI integration
- **Auth**: User authentication screen
- **Inbox**: Message inbox and conversation list
- **Chat**: Main chat interface for text-based support
- **Contact**: Contact form for submitting support requests
- **Error**: Error handling and display

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

The widget will run at `http://localhost:3001`

### Build for Production

```bash
turbo build
```

## Usage

### URL Parameters

The widget accepts the following URL parameters:

- `orgId` (required): Organization ID for the support widget

Example URL:

```
http://localhost:3001?orgId=your-organization-id
```

### Iframe Integration

This widget is designed to be embedded in an iframe. The embed script (from the `embed` module) will create an iframe pointing to this application.

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Main page component
└── favicon.ico        # App favicon

modules/widget/
├── store/             # Zustand stores
│   ├── use-screen-store.ts
│   ├── use-conversation-store.ts
│   ├── use-contact-session-store.ts
│   ├── use-widget-settings-store.ts
│   └── use-vapi-secrets-store.ts
├── hooks/             # Custom hooks
├── types.ts           # TypeScript types and constants
└── ui/
    ├── components/    # Reusable UI components
    ├── screens/       # Screen components
    │   ├── widget-loading-screen.tsx
    │   ├── widget-selection-screen.tsx
    │   ├── widget-voice-screen.tsx
    │   ├── widget-auth-screen.tsx
    │   ├── widget-inbox-screen.tsx
    │   ├── widget-chat-screen.tsx
    │   ├── widget-contact-screen.tsx
    │   └── widget-error-screen.tsx
    └── views/         # View components
        └── widget-view.tsx

components/
└── providers.tsx      # React providers (Convex, etc.)

lib/
└── convex.ts          # Convex client configuration
```

## Dependencies

### Core Dependencies

- **Next.js 15**: React framework
- **React 19**: UI library
- **Convex**: Backend and real-time data
- **Vapi AI**: Voice calling integration
- **Zustand**: State management
- **Lucide React**: Icons
- **Sonner**: Toast notifications

### UI Dependencies

- **@workspace/ui**: Shared UI components
- **next-themes**: Theme management
- **Tailwind CSS**: Styling

## Configuration

### Environment Variables

The widget uses environment variables for configuration. Make sure to set up the following:

- Convex configuration (handled by `@workspace/backend`)
- Vapi AI API keys
- Organization-specific settings

### Convex Integration

The widget integrates with Convex for:

- Real-time messaging
- User authentication
- Conversation management
- Organization settings

## Styling

The widget uses:

- **Tailwind CSS** for styling
- **next-themes** for dark/light mode
- **Geist** and **Geist Mono** fonts
- Responsive design optimized for iframe embedding

## State Management

The widget uses Zustand stores for state management:

- **Screen Store**: Manages current screen and navigation
- **Conversation Store**: Handles chat messages and conversations
- **Contact Session Store**: Manages contact form sessions
- **Widget Settings Store**: Organization-specific settings
- **Vapi Secrets Store**: Voice calling configuration

## Notes

- The widget is designed to run in a full-screen iframe
- All screens are responsive and optimized for mobile devices
- The application uses `overflow-hidden` to prevent scrolling issues in iframe
- Z-index and positioning are handled by the parent embed script
- Voice calling requires proper Vapi AI configuration
