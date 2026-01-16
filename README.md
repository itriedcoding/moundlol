# mound.lol

Your link, your vibe. A modern bio link platform with real-time analytics and unlimited customization.

## 🚀 Live Demo

**Convex Backend:** https://limitless-pony-481.convex.cloud

## ✨ Features

- 🔗 Unlimited social links (TikTok, Instagram, OnlyFans, YouTube, Twitch, and more)
- 📊 Real-time analytics and tracking
- 🎨 Custom themes and branding
- ⚡ Lightning-fast performance
- 📱 Mobile responsive design
- 🔒 Optional password protection
- 🌐 Custom domain support
- 🎯 Link scheduling and expiration
- 📈 UTM tracking and analytics

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Backend:** Convex (serverless database & API)
- **Animations:** Framer Motion
- **Icons:** React Icons, Lucide Icons
- **Routing:** React Router v7

## 📦 Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start Convex backend
npx convex dev

# Start frontend (in another terminal)
pnpm run dev
```

The app will be running at `http://localhost:5173`

### Environment Setup

Create a `.env.local` file:

```env
VITE_CONVEX_URL=https://limitless-pony-481.convex.cloud
CONVEX_SITE_URL=http://localhost:5173
```

## 🌐 Deploy to Production

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mound.lol&env=VITE_CONVEX_URL&envDescription=Convex%20deployment%20URL&project-name=mound-lol&repository-name=mound-lol)

### Deployment Steps

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Set environment variable:
   - `VITE_CONVEX_URL`: `https://limitless-pony-481.convex.cloud`
4. Deploy and configure custom domain `mound.lol` in Vercel settings

### Post-Deployment

After deploying:
1. Add custom domain `mound.lol` in Vercel project settings
2. Configure DNS to point to Vercel
3. Deploy Convex to production:
   ```bash
   npx convex deploy --prod
   ```

## 🎨 Features Overview

### For Users
- Claim your unique username at `mound.lol/yourname`
- Add unlimited social links and custom URLs
- Track views and clicks in real-time
- Customize colors, themes, and branding
- Schedule links for future activation
- Set link expiration dates
- Password protect your profile

### For Developers
- Session-based authentication (no complex OAuth)
- Real-time database with Convex
- TypeScript throughout
- Modern React patterns
- Responsive design system
- Production-ready deployment

## 📁 Project Structure

```
src/
├── pages/           # Page components (Landing, Dashboard, Profile)
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── convex/          # Backend functions and schema
│   ├── schema.ts    # Database schema
│   ├── users.ts     # User management
│   ├── links.ts     # Link management
│   └── analytics.ts # Analytics tracking
└── main.tsx         # App entry point
```

## 🔧 Key Technologies

### Convex Backend
- Real-time database queries
- Serverless functions
- TypeScript-first
- Automatic API generation
- Built-in indexing and search

### Session-Based Auth
Simple localStorage-based sessions:
```typescript
import { useAuth } from "@/hooks/use-auth";

const { user, sessionToken, isAuthenticated } = useAuth();
```

### Database Schema
Users, links, and analytics with full TypeScript types:
```typescript
users: {
  username: string
  sessionToken: string
  title?: string
  bio?: string
  profilePicture?: string
  customDomain?: string
  // + 20+ more customization fields
}
```

## 📊 Analytics

Track everything in real-time:
- Profile views
- Link clicks
- Geographic data
- Referrer sources
- UTM campaigns
- Device types

## 🎯 Roadmap

- [ ] Email capture forms
- [ ] Email integrations
- [ ] Advanced themes
- [ ] Link thumbnails
- [ ] Social proof badges
- [ ] A/B testing
- [ ] Team collaboration

## 📄 License

MIT License - feel free to use this for your own projects!

## 🔗 Links

- **Website:** [mound.lol](https://mound.lol)
- **Convex:** [convex.dev](https://convex.dev)
- **Vercel:** [vercel.com](https://vercel.com)

---

Built with 💖 by the mound.lol team
