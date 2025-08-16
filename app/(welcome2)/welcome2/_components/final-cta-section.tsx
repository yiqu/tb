/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AnimatedSection } from './animated-section';

export function FinalCtaSection() {
  return (
    <section className={ `bg-gradient-to-r from-blue-600 to-purple-600 py-20 md:py-32` }>
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <AnimatedSection direction="left">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className={ `mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl` }>Ready to streamline your workflow?</h2>
            <p className="mb-8 text-xl opacity-90">
              Join thousands of teams who have already transformed their productivity with StreamLine.
            </p>
            <div className={ `flex flex-col gap-4 sm:flex-row sm:justify-center` }>
              <Button size="lg" className={ `bg-white px-8 py-6 text-lg text-blue-600 hover:bg-gray-100` }>
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={ `border-white bg-transparent px-8 py-6 text-lg text-white hover:bg-white hover:text-blue-600` }
              >
                Schedule a Demo
              </Button>
            </div>
            <p className="mt-6 text-sm opacity-75">14-day free trial • No credit card required • Cancel anytime</p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
