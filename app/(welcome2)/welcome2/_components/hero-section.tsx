/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { AnimatedSection } from './animated-section';

export function HeroSection() {
  return (
    <section className={ `relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-8 pb-20 md:pt-16 md:pb-32` }>
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <AnimatedSection direction="left">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4" variant="secondary">
              🚀 New: AI-Powered Automation
            </Badge>
            <h1 className={ `mb-6 text-4xl font-bold tracking-tight lg:text-7xl sm:text-5xl md:text-6xl` }>
              Streamline Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Workflow</span>
            </h1>
            <p className={ `mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl` }>
              Boost productivity by 300% with our AI-powered automation platform. Connect your tools, automate repetitive tasks, and focus
              on what matters most.
            </p>
            <div className={ `flex flex-col gap-4 sm:flex-row sm:justify-center` }>
              <Button size="lg" className="px-8 py-6 text-lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </AnimatedSection>
      </div>

      { /* Hero Image */ }
      <div className={ `container mx-auto mt-16 max-w-7xl px-4 md:px-6` }>
        <AnimatedSection direction="right" delay={ 300 }>
          <div className="mx-auto max-w-5xl">
            <Image
              src="/placeholder.svg?height=600&width=1000&text=StreamLine+Dashboard"
              alt="StreamLine Dashboard"
              width={ 1000 }
              height={ 600 }
              className="rounded-xl border shadow-2xl"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
