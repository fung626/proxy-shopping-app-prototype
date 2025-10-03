# Mobile Proxy Shopping Platform

A comprehensive mobile-first proxy shopping platform built with React, TypeScript, and Supabase PostgreSQL database. This platform allows users to be both purchasing agents and clients, facilitating cross-border shopping with a modern, iOS-native inspired interface.

## 🚀 Features

### Core Functionality
- **Dual User Roles**: Users can act as both purchasing agents and clients
- **Complete Authentication Flow**: Sign in/up with email or phone, OTP verification
- **Two-Step Registration**: Comprehensive user onboarding process
- **Cloud Database**: Full Supabase PostgreSQL implementation with real-time capabilities
- **Multi-language Support**: English, Simplified Chinese, Traditional Chinese, Japanese, Korean

### User Interface
- **Mobile-Optimized Design**: iOS-native UI patterns with clean, modern aesthetics
- **Red Color Palette**: Primary red theme throughout the application
- **Tab Navigation**: Five main sections (Explore, Messages, Create, Orders, Profile)
- **Dark/Light Theme**: Full theme support with smooth transitions
- **Responsive Design**: Optimized for both iOS and Android devices

### Key Pages & Features
- **Explore Tab**: Browse proxy shopping offers, requests, and agents
- **Messages Tab**: Real-time chat system for agent-client communication
- **Create Tab**: Create proxy shopping requests or offers
- **Orders Tab**: Manage active orders, view offers, handle payments
- **Profile Tab**: User settings, verification, payment methods, security

### Advanced Features
- **Verification System**: Email, phone, identity, and business verification
- **Payment Integration**: Credit card management, bank information, transaction passwords
- **Security Features**: Two-factor authentication, biometric authentication
- **Feedback System**: Rating and review system for transactions
- **Arbitration Centre**: Dispute resolution system
- **Wishlist System**: Save favorite offers and requests

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **State Management**: React Context API
- **Database**: Supabase PostgreSQL (cloud-hosted)
- **UI Components**: Custom components + Shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Font**: AirbnbCereal with fallbacks (Circular Std, Inter)

## 📁 Project Structure

```
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── chat/            # Chat-related components
│   └── figma/           # Figma import utilities
├── pages/               # Main application pages
│   └── auth/            # Authentication pages
├── services/            # Database and API services
├── store/               # Context providers and state management
├── styles/              # Global CSS and Tailwind configuration
├── types/               # TypeScript type definitions
├── utils/               # Helper utilities
├── config/              # Configuration files
├── layouts/             # Layout components
└── modals/              # Modal components
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/proxy-shopping-mobile-app.git
cd proxy-shopping-mobile-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## 🗄 Database System

The application uses a comprehensive IndexedDB implementation for local data storage:

- **User Service**: Authentication, user profiles, preferences
- **Offer Service**: Proxy shopping offers and requests
- **Order Service**: Order management and tracking
- **Seed Data Service**: Initial data population

### Database Features
- Offline-first architecture
- Automatic data seeding
- Type-safe database operations
- Error handling and recovery

## 🌐 Internationalization

Support for 5 languages with comprehensive translation system:
- English (en)
- Simplified Chinese (zh-CN)
- Traditional Chinese (zh-TW)
- Japanese (ja)
- Korean (ko)

## 🎨 Design System

### Color Palette
- **Primary**: Red (#dc2626)
- **Background**: White/Dark slate
- **Text**: Slate variations
- **Accent**: Red variations

### Typography
- **Primary Font**: AirbnbCereal
- **Fallbacks**: Circular Std, Inter, system fonts
- **Responsive sizing**: Mobile-optimized typography scale

## 📱 Mobile Optimization

- iOS-native UI patterns
- Safe area handling
- Touch-friendly interactions
- Optimized for mobile viewport
- Progressive Web App capabilities

## 🔐 Security Features

- Secure authentication flow
- OTP verification
- Two-factor authentication
- Biometric authentication support
- Transaction password system
- Account security management

## 🧪 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint configuration
- Component-based architecture
- Responsive design patterns

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For support and questions, please open an issue in the GitHub repository.

---

Built with ❤️ using React, TypeScript, and modern web technologies.