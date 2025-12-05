# ShopMore - Proxy Shopping Platform

> A comprehensive mobile-first proxy shopping platform that connects buyers with purchasing agents for cross-border shopping experiences.

[![Live Demo](https://img.shields.io/badge/demo-online-success)](https://fung626.github.io/proxy-shopping-app-prototype/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)](https://vitejs.dev/)

## 📖 Overview

ShopMore is a modern, mobile-optimized proxy shopping platform built with React and TypeScript. It enables users to act as both purchasing agents and clients, facilitating seamless cross-border shopping with an elegant iOS-inspired interface. The platform features comprehensive authentication, real-time messaging, order management, and a sophisticated payment system.

**Live Demo**: [https://fung626.github.io/proxy-shopping-app-prototype/](https://fung626.github.io/proxy-shopping-app-prototype/)

## ✨ Key Features

### 🔐 Authentication & User Management
- **Dual-Role System**: Users can be both purchasing agents and clients
- **Flexible Sign In/Up**: Email or phone authentication with OTP verification
- **Two-Step Registration**: Comprehensive onboarding with user preferences
- **Password Recovery**: Forgot password and reset password flows
- **Profile Management**: Complete user profile customization

### 🎯 Core Functionality
- **Explore Tab**: Browse proxy shopping offers, requests, and verified agents
- **Messages Tab**: Real-time chat system for seamless agent-client communication
- **Create Tab**: Post shopping requests or create service offers
- **Orders Tab**: Track active orders, manage offers, and handle transactions
- **Profile Tab**: Settings, verification, payment methods, and security

### 💳 Payment & Transaction System
- **Credit Card Management**: Add, edit, and manage multiple payment methods
- **Bank Information**: Store bank account details for transfers
- **Transaction Password**: Additional security layer for financial transactions
- **Payment Processing**: Secure checkout and payment handling

### 🛡️ Verification & Security
- **Multi-Level Verification**: Email, phone, identity, and business verification
- **Two-Factor Authentication**: Enhanced account security
- **Biometric Authentication**: Fingerprint/Face ID support
- **Transaction Security**: Encrypted payment processing

### 🌟 Advanced Features
- **Rating & Review System**: Build trust through transparent feedback
- **Arbitration Centre**: Dispute resolution for transactions
- **Wishlist System**: Save favorite offers and requests
- **Category Browsing**: Organized product and service categories
- **Search Functionality**: Find specific offers, requests, or agents
- **Dark/Light Theme**: Automatic and manual theme switching

### 🌐 Internationalization
Full support for 5 languages:
- 🇺🇸 English (en)
- 🇨🇳 Simplified Chinese (zh-CN)
- 🇹🇼 Traditional Chinese (zh-TW)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)

## 🛠️ Tech Stack

### Frontend Framework
- **React** 18.3.1 - Modern UI library with hooks
- **TypeScript** 5.x - Type-safe JavaScript
- **React Router DOM** - Client-side routing with HashRouter
- **Vite** 6.3.5 - Lightning-fast build tool with SWC

### Styling & UI
- **Tailwind CSS** 3.4.18 - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Beautifully designed components
- **Lucide React** 0.487.0 - Icon library
- **next-themes** - Theme management

### State Management
- **Zustand** 5.0.8 - Lightweight state management
- **React Context API** - Built-in state sharing
- **React Hook Form** 7.55.0 - Form state management
- **Zod** 4.1.12 - Schema validation

### Backend & Database
- **Supabase** 2.49.8 - PostgreSQL database with real-time capabilities
- **Supabase Authentication** - Secure user authentication

### Additional Libraries
- **Moment.js** 2.30.1 - Date/time manipulation
- **Embla Carousel** 8.6.0 - Carousel component
- **Sonner** 2.0.3 - Toast notifications
- **input-otp** 1.4.2 - OTP input component
- **cmdk** 1.1.1 - Command menu
- **Recharts** 2.15.2 - Data visualization

### Development Tools
- **@vitejs/plugin-react-swc** - Fast refresh with SWC
- **vite-plugin-svgr** - SVG as React components
- **PostCSS** & **Autoprefixer** - CSS processing
- **ESLint** - Code linting
- **gh-pages** - GitHub Pages deployment

## 📁 Project Structure

```
proxy-shopping-app-prototype/
├── src/
│   ├── assets/          # Static assets (images, fonts, icons)
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Shadcn/ui base components
│   │   ├── chat/       # Chat-related components
│   │   └── ...
│   ├── config/          # App configuration files
│   ├── data/            # Static data and mock data
│   ├── database/        # Database schemas and migrations
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Layout components (TabNavigation, etc.)
│   ├── locales/         # i18n translation files
│   │   ├── en/         # English translations
│   │   ├── zh-cn/      # Simplified Chinese
│   │   ├── zh-tw/      # Traditional Chinese
│   │   ├── ja/         # Japanese
│   │   └── ko/         # Korean
│   ├── modals/          # Modal components
│   ├── pages/           # Page components
│   │   ├── auth/       # Authentication pages
│   │   ├── explore/    # Explore tab pages
│   │   ├── legal/      # Legal pages (TOS, Privacy)
│   │   ├── messages/   # Messages tab pages
│   │   ├── offers/     # Offer-related pages
│   │   ├── orders/     # Order management pages
│   │   ├── payment/    # Payment pages
│   │   └── profile/    # Profile pages
│   ├── services/        # API services and data fetching
│   ├── store/           # State management (Context + Zustand)
│   ├── styles/          # Global styles and CSS
│   ├── supabase/        # Supabase configuration
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper utilities
│   ├── App.tsx          # Root application component
│   ├── main.tsx         # Application entry point
│   └── routes.ts        # Route configurations
├── public/              # Public static files
├── build/               # Build output (ignored)
├── dist/                # Production build output
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies

```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 or **yarn** >= 1.22.0

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/fung626/proxy-shopping-app-prototype.git
cd proxy-shopping-app-prototype
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables** (optional)
Create a `.env` file in the root directory if you're using Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Deployment to GitHub Pages

```bash
npm run deploy
# or
yarn deploy
```

For Windows users:
```bash
npm run win:deploy
```

## 📱 Mobile Experience

The application is optimized for mobile devices with:

- **iOS-Native UI Patterns**: Smooth animations and familiar interactions
- **Safe Area Handling**: Proper spacing for notched devices
- **Touch-Optimized**: Large touch targets and swipe gestures
- **PWA-Ready**: Install on home screen capability
- **Responsive Design**: Adapts to all screen sizes
- **Mobile Viewport**: `viewport-fit=cover` for full-screen experience

### Recommended Testing
- iOS Safari (iPhone)
- Chrome Mobile (Android)
- PWA mode on both platforms

## 🎨 Design System

### Color Palette
- **Primary**: Red (`rgb(220, 38, 38)`) - Main brand color
- **Background**: Dynamic light/dark background
- **Foreground**: Dynamic text colors
- **Muted**: Subtle backgrounds for secondary elements
- **Accent**: Interactive element highlights

### Typography
- **Primary Font**: AirbnbCereal
- **Fallback Fonts**: Circular Std, Inter, system fonts
- **Mobile-Optimized**: Responsive font sizes and line heights

### Components
The design system uses a combination of:
- Custom-built components following iOS design patterns
- Shadcn/ui components for complex interactions
- Radix UI primitives for accessibility

## 🗄️ Database & State Management

### Supabase PostgreSQL
The application uses Supabase for:
- User authentication and authorization
- Real-time data synchronization
- Secure API endpoints
- File storage (future feature)

### State Management Architecture
- **Zustand**: Global application state (auth, theme, language)
- **React Context**: Feature-specific state (messages, orders)
- **React Hook Form**: Form state management
- **Local State**: Component-level state with hooks

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run win:deploy` | Deploy to GitHub Pages (Windows) |
| `npm run type-check` | Run TypeScript type checking |
| `npm run supabase:setup` | Initialize Supabase setup |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:reset` | Reset database |
| `npm run clean` | Clean build artifacts |
| `npm run fresh-install` | Clean install dependencies |

## 🧪 Development Workflow

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with recommended rules
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Shared logic abstraction

### Routing
The app uses React Router with HashRouter for:
- GitHub Pages compatibility
- Client-side routing
- Dynamic route configuration
- Path-based navigation

### Progressive Enhancement
- Graceful fallbacks for unsupported features
- Error boundaries for stability
- Loading states for better UX
- Offline-first architecture (planned)

## 🌍 Internationalization (i18n)

The app supports 5 languages with comprehensive translations:

### Adding New Languages
1. Create a new folder in `src/locales/[language-code]/`
2. Add translation files for each feature
3. Update the language configuration
4. Add language selector option

### Translation Structure
```
locales/
├── en/
│   ├── auth.json
│   ├── common.json
│   ├── explore.json
│   └── ...
├── zh-cn/
├── zh-tw/
├── ja/
└── ko/
```

## 🔐 Security Features

- **Secure Authentication**: Email/phone with OTP verification
- **Password Hashing**: Bcrypt encryption for passwords
- **Transaction Passwords**: Additional security for payments
- **Two-Factor Authentication**: Optional 2FA
- **Biometric Support**: Fingerprint/Face ID
- **Session Management**: Secure token handling
- **HTTPS Only**: Production enforces HTTPS

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain consistent code style
- Add proper type definitions
- Test on mobile devices
- Update documentation as needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📧 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/fung626/proxy-shopping-app-prototype/issues)
- **GitHub Discussions**: [Ask questions or share ideas](https://github.com/fung626/proxy-shopping-app-prototype/discussions)

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vercel** - For Vite and SWC
- **Shadcn** - For beautiful UI components
- **Radix UI** - For accessible primitives
- **Supabase** - For the backend infrastructure

## 🗺️ Roadmap

- [ ] Real-time messaging with WebSocket
- [ ] Push notifications
- [ ] File upload for product images
- [ ] Advanced search filters
- [ ] Agent verification badges
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Social media sharing

---

**Built with ❤️ by [fung626](https://github.com/fung626)**

**Powered by**: React · TypeScript · Vite · Tailwind CSS · Supabase