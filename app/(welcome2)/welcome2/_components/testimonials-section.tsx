/* eslint-disable react/no-array-index-key */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */

'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import { AnimatedSection } from './animated-section';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, TechCorp',
      quote:
        "StreamLine has completely transformed our workflow. We've reduced manual tasks by 80% and our team is more productive than ever.",
    },
    {
      name: 'Michael Chen',
      role: 'CTO, InnovateLab',
      quote:
        "The AI automation features are incredible. What used to take hours now happens automatically. It's like having a digital assistant for our entire team.",
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Director, HealthFirst',
      quote:
        'Security was our biggest concern, but StreamLine exceeded our expectations. The compliance features make it perfect for our healthcare organization.',
    },
  ];

  return (
    <section id="testimonials" className={ `bg-gray-50 py-20 md:py-32` }>
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <AnimatedSection direction="left">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className={ `mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl` }>Loved by teams worldwide</h2>
            <p className="text-lg text-gray-600">See what our customers have to say about StreamLine</p>
          </div>
        </AnimatedSection>

        <div className={ `grid gap-8 md:grid-cols-3` }>
          { testimonials.map((testimonial, index) => (
            <AnimatedSection key={ index } direction={ index % 2 === 0 ? 'left' : 'right' } delay={ index * 150 }>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex items-center space-x-1">
                    { [...Array(5)].map((_, i) => (
                      <Star key={ i } className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )) }
                  </div>
                  <CardDescription className="text-base">&quot;{ testimonial.quote }&quot;</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={ `/placeholder.svg?height=40&width=40&text=${testimonial.name.split(' ')[0]}` }
                      alt={ testimonial.name }
                      width={ 40 }
                      height={ 40 }
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{ testimonial.name }</p>
                      <p className="text-sm text-gray-600">{ testimonial.role }</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          )) }
        </div>
      </div>
    </section>
  );
}
