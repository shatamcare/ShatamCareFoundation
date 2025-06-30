# Shatam Care Foundation Website

## About the Project

**Website**: Shatam Care Foundation - Because Every Memory Deserves Care
**Mission**: Empowering caregivers and supporting elders with dementia care training across India

## Project Overview

This is the official website for Shatam Care Foundation, a non-profit organization dedicated to providing comprehensive dementia care training and support services across India. The website showcases our programs, impact, and provides resources for caregivers and families dealing with dementia.

## How to Run the Project

Follow these steps to set up and run the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd ShatamCareFoundation

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev

# Step 5: Build for production
npm run build

# Step 6: Preview production build
npm run preview
```

## Technologies Used

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Animations**: GSAP (GreenSock)
- **Routing**: React Router DOM
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── ErrorBoundary.tsx
│   └── LoadingSpinner.tsx
├── pages/               # Main page components
│   ├── Index.tsx        # Homepage
│   ├── OurPrograms.tsx  # Programs page
│   ├── OurImpact.tsx    # Impact page
│   └── NotFound.tsx     # 404 page
├── utils/               # Utility functions
│   └── animations.ts    # GSAP animations
├── styles/              # CSS files
│   └── animations.css
├── hooks/               # Custom React hooks
├── lib/                 # Library configurations
└── main.tsx            # App entry point
```

## Features

### Core Features
- ✅ Responsive design optimized for mobile, tablet, and desktop
- ✅ Accessibility compliant (WCAG guidelines)
- ✅ SEO optimized with comprehensive meta tags
- ✅ Progressive Web App capabilities
- ✅ Performance optimized with lazy loading and code splitting

### Sections
- 🏠 **Homepage**: Hero section, mission, programs overview, impact stats, testimonials
- 📚 **Programs**: Detailed view of all caregiver training and support programs
- 📊 **Impact**: Statistics, testimonials, and success stories
- 📞 **Contact**: Multiple ways to reach the foundation
- 🎯 **Donation**: Secure donation system with multiple options

### Design System
- **Primary Colors**: Warm Teal (#04808A) and Sunrise Orange (#FF9A56)
- **Typography**: Poppins (headings) and Open Sans (body text)
- **Components**: Consistent button styles, cards, and interactive elements
- **Animations**: Smooth GSAP animations with performance considerations

## Deployment

The website can be deployed to various platforms:

### Vercel (Recommended)
```sh
npm run build
# Deploy the 'dist' folder to Vercel
```

### Netlify
```sh
npm run build
# Deploy the 'dist' folder to Netlify
```

### GitHub Pages
```sh
npm run build
# Deploy the 'dist' folder to GitHub Pages
```

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact Information

**Shatam Care Foundation**
- **Email**: shatamcare@gmail.com
- **Phone**: +91 9158566665
- **Website**: [shatamcare.org](https://shatamcare.org)

## License

This project is proprietary to Shatam Care Foundation. All rights reserved.

---

**Developed with ❤️ for the cause of dignified elderly care in India**
