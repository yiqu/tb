/* eslint-disable react/no-array-index-key */
'use client';

import type React from 'react';

import { HeroSection } from './_components/hero-section';
import { contentSections } from './_components/welcome.utils';
import { ContentSection } from './_components/content-section';
import { FeaturesSection } from './_components/features-section';
import { FinalCtaSection } from './_components/final-cta-section';
import { TestimonialsSection } from './_components/testimonials-section';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />

      { /* Content Sections */ }
      { contentSections.map((section, index) => (
        <ContentSection
          key={ index }
          title={ section.title }
          icon={ section.icon }
          text={ section.text }
          imageQuery={ section.imageQuery }
          index={ index }
        />
      )) }

      <FinalCtaSection />
    </div>
  );
}
