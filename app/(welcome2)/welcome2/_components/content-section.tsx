/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */

'use client';

import Image from 'next/image';
import { ArrowRight, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AnimatedSection } from './animated-section';

interface ContentSectionProps {
  title: string;
  icon: LucideIcon;
  text: string;
  imageQuery: string;
  index: number;
}

export function ContentSection({ title, icon: Icon, text, imageQuery, index }: ContentSectionProps) {
  return (
    <section className={ `py-20 md:py-32 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}` }>
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <div className={ `grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}` }>
          { /* Text Content */ }
          <AnimatedSection direction={ index % 2 === 0 ? 'left' : 'right' }>
            <div className={ `space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}` }>
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className={ `text-3xl font-bold tracking-tight sm:text-4xl` }>{ title }</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">{ text }</p>
              <div className={ `flex flex-col gap-4 sm:flex-row` }>
                <Button size="lg">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent">
                  View Demo
                </Button>
              </div>
            </div>
          </AnimatedSection>

          { /* Image */ }
          <AnimatedSection direction={ index % 2 === 0 ? 'right' : 'left' } delay={ 200 }>
            <div className={ `${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}` }>
              <Image
                src={ `/placeholder.svg?height=500&width=600&text=${imageQuery}` }
                alt={ title }
                width={ 600 }
                height={ 500 }
                className="w-full rounded-xl border shadow-2xl"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
