/* eslint-disable react/no-array-index-key */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
'use client';

import { Mail, Shield, Server, Monitor, HardDrive, ChartLine } from 'lucide-react';

import { geistFont } from '@/lib/fonts-config';
import { Highlighter } from '@/components/magicui/highlighter';
import { ShineBorder } from '@/components/magicui/shine-border';
import { Card, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';

import { AnimatedWrapper } from './AnimatedWrapper';
import { InViewPortWrapper } from './InViewPortWrapper';

export function SubTeamsSectionParent() {
  const features = [
    { icon: HardDrive, title: 'Infrastructure', desc: 'Intelligent workflows that learn and adapt', color: '#d9b38c' },
    {
      icon: Shield,
      title: 'Ceeil',
      desc: 'Bank-level encryption and compliance',
      color: '#bf80ff',
    },
    { icon: Mail, title: 'Request Manager', desc: 'Real-time collaboration tools', color: '#9999ff' },
    { icon: ChartLine, title: 'Monitoring', desc: 'Deep insights and reporting', color: '#b3ffb3' },
    { icon: Server, title: 'API/CLI', desc: 'Deep insights and reporting', color: '#00e6e6' },
    { icon: Monitor, title: 'User Interface', desc: 'Deep insights and reporting', color: '#ff9999' },
  ];

  return (
    <InViewPortWrapper className={ `py-20 md:py-32 ${geistFont.className}` } threshold={ 0.1 } triggerOnce={ true }>
      <section id="features">
        <div className={ `container mx-auto px-4 md:px-6` }>
          <AnimatedWrapper direction="left">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className={ `mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl` }>KQPRO Foundations</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our platform brings together all the essential modules — from ingest to user interface — to give you a{ ' ' }
                <Highlighter action="underline" color="#FF9800" delay={ 5000 }>
                  complete and reliable
                </Highlighter>{ ' ' }
                solution.
              </p>
            </div>
          </AnimatedWrapper>

          <div className={ `grid gap-8 lg:grid-cols-4 md:grid-cols-2 lg:[&>*:nth-child(5)]:col-start-2 lg:[&>*:nth-child(6)]:col-start-3` }>
            { features.map((feature, index) => (
              <AnimatedWrapper key={ index } direction={ index % 2 === 0 ? 'left' : 'right' } delay={ index * 100 }>
                <Card className={ `relative w-92 overflow-hidden border-0 shadow-lg transition-shadow hover:shadow-xl` }>
                  <ShineBorder shineColor={ ['#A07CFE', '#FE8FB5', '#FFBE7B'] } />
                  <CardHeader>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-lg"
                      style={ {
                        background: `linear-gradient(to bottom right, ${feature.color}, #e6f3ff, #cce6ff)`,
                      } }
                    >
                      <feature.icon className="h-6 w-6 text-gray-800" />
                    </div>
                    <CardTitle>{ feature.title }</CardTitle>
                    <CardDescription>{ feature.desc }</CardDescription>
                  </CardHeader>
                </Card>
              </AnimatedWrapper>
            )) }
          </div>
        </div>
      </section>
    </InViewPortWrapper>
  );
}
