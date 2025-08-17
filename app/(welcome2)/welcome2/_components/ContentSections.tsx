/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { ReactNode } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AnimatedWrapper } from './AnimatedWrapper';

interface ContentSectionProps {
  title: string;
  icon: LucideIcon;
  text: string;
  index: number;
  imageComponent: ReactNode;
}

export function ContentSections({ title, icon: Icon, text, imageComponent, index }: ContentSectionProps) {
  return (
    <section className={ `py-20 md:py-32 ${index % 2 === 1 ? 'bg-gray-50 dark:bg-[#000]' : 'bg-white dark:bg-gray-900'}` }>
      <div className={ `container mx-auto max-w-7xl px-4 md:px-6` }>
        <div className={ `grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}` }>
          <AnimatedWrapper direction={ index % 2 === 0 ? 'left' : 'right' }>
            <div className={ `space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}` }>
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className={ `text-3xl font-bold tracking-tight sm:text-4xl` }>{ title }</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">{ text }</p>
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
          </AnimatedWrapper>

          <AnimatedWrapper direction={ index % 2 === 0 ? 'right' : 'left' } delay={ 200 }>
            <div className={ `${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}` }>{ imageComponent }</div>
          </AnimatedWrapper>
        </div>
      </div>
    </section>
  );
}
