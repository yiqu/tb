/* eslint-disable react/no-array-index-key */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */

'use client';

import { Zap, Users, Shield, BarChart3 } from 'lucide-react';

import { Card, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';

import { AnimatedSection } from './animated-section';

export function FeaturesSection() {
  const features = [
    { icon: Zap, title: 'AI Automation', desc: 'Intelligent workflows that learn and adapt', color: 'blue' },
    {
      icon: Shield,
      title: 'Enterprise Security',
      desc: 'Bank-level encryption and compliance',
      color: 'green',
    },
    { icon: Users, title: 'Team Collaboration', desc: 'Real-time collaboration tools', color: 'purple' },
    { icon: BarChart3, title: 'Advanced Analytics', desc: 'Deep insights and reporting', color: 'orange' },
  ];

  return (
    <section id="features" className={ `py-20 md:py-32` }>
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <AnimatedSection direction="left">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className={ `mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl` }>Everything you need to succeed</h2>
            <p className="text-lg text-gray-600">Powerful features designed to transform how your team works together</p>
          </div>
        </AnimatedSection>

        <div className={ `grid gap-8 lg:grid-cols-4 md:grid-cols-2` }>
          { features.map((feature, index) => (
            <AnimatedSection key={ index } direction={ index % 2 === 0 ? 'left' : 'right' } delay={ index * 100 }>
              <Card className={ `border-0 shadow-lg transition-shadow hover:shadow-xl` }>
                <CardHeader>
                  <div className={ `flex h-12 w-12 items-center justify-center rounded-lg bg-${feature.color}-100` }>
                    <feature.icon className={ `h-6 w-6 text-${feature.color}-600` } />
                  </div>
                  <CardTitle>{ feature.title }</CardTitle>
                  <CardDescription>{ feature.desc }</CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>
          )) }
        </div>
      </div>
    </section>
  );
}
