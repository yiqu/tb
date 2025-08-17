/* eslint-disable react/no-array-index-key */
import type React from 'react';

import { HeroSection } from './_components/HeroSection';
import WelcomeTopNav from './_components/WelcomeTopNav';
import { FooterSectionSection } from './_components/FooterSection';
import ContentSectionParent from './_components/ContentSectionParent';
import { SubTeamsSectionParent } from './_components/SubTeamsSectionParent';
import { MilestoneTimeLineSection } from './_components/MilestoneTimelineSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <WelcomeTopNav />
      <HeroSection />
      <SubTeamsSectionParent />
      <ContentSectionParent />
      <MilestoneTimeLineSection />
      <FooterSectionSection />
    </div>
  );
}
