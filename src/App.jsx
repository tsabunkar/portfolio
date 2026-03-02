/**
 * App.jsx
 * Root application component.
 * Wraps the app in ThemeProvider and renders layout + sections.
 */

import { ThemeProvider } from '@/context/ThemeContext';
import NavBar            from '@/components/layout/NavBar';
import Footer            from '@/components/layout/Footer';
import HeroSection       from '@/sections/Hero';
import CaseStudiesSection from '@/sections/CaseStudies';
import ProofSection      from '@/sections/Proof';
import AboutSection      from '@/sections/About';
import FootprintSection  from '@/sections/Footprint';
import ConnectSection    from '@/sections/Connect';

export default function App() {
  return (
    <ThemeProvider>
      <NavBar />
      <main>
        <HeroSection />
        <CaseStudiesSection />
        <ProofSection />
        <AboutSection />
        <FootprintSection />
        <ConnectSection />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
