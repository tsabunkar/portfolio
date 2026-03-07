/**
 * pages/Home.jsx
 */
import HeroSection from "@/sections/Hero";
import CaseStudiesSection from "@/sections/CaseStudies";
import ProofSection from "@/sections/Proof";
import AboutSection from "@/sections/About";
import FootprintSection from "@/sections/Footprint";
import ConnectSection from "@/sections/Connect";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CaseStudiesSection />
      <ProofSection />
      <AboutSection />
      <FootprintSection />
      <ConnectSection />
    </>
  );
}
