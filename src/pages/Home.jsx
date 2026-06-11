/**
 * pages/Home.jsx
 */
import HeroSection from "@/sections/Hero";
import CaseStudiesSection from "@/sections/CaseStudies";
import ProofSection from "@/sections/Proof";
import AboutSection from "@/sections/About";
import FootprintSection from "@/sections/Footprint";
import SupportSection from "@/sections/Support";
import ConnectSection from "@/sections/Connect";
import DogWidget from "@/components/ui/DogWidget";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CaseStudiesSection />
      <ProofSection />
      <AboutSection />
      <FootprintSection />
      <SupportSection />
      <ConnectSection />
      {/* Dog mascot — only on home page, downloads resume.pdf on click */}
      <DogWidget />
    </>
  );
}
