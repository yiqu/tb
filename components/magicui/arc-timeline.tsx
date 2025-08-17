/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
'use client';
import { useState, ReactNode, ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/utils';

export interface ArcTimelineItem {
  time: ReactNode;
  fireworks?: boolean;
  steps: ArcTimelineStep[];
}

export interface ArcTimelineStep {
  icon: ReactNode;
  content: ReactNode;
  fireworks?: boolean;
}

export interface ArcTimelineStepClickData {
  timelineIndex: number;
  stepIndex: number;
  time: ReactNode;
  step: ArcTimelineStep;
}

interface ArcTimelineProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * The data of the arc timeline
   */
  data: ArcTimelineItem[];
  /**
   * The configuration of the arc timeline
   */
  arcConfig?: {
    /**
     * The width of the circle, default is 5000
     */
    circleWidth?: number;
    /**
     * The angle between minor steps, default is 0.35
     */
    angleBetweenMinorSteps?: number;
    /**
     * The number of lines to fill between steps, default is 10
     */
    lineCountFillBetweenSteps?: number;
    /**
     * The number of lines to fill in before the first step and after the last step
     */
    boundaryPlaceholderLinesCount?: number;
    contentClassName?: string;
  };
  /**
   * The default active step
   */
  defaultActiveStep?: {
    /**
     * The time of the default active step
     */
    time?: string;
    /**
     * The index of the default active step
     */
    stepIndex?: number;
  };
  /**
   * Callback function called when a timeline step is clicked
   */
  onTimelineStepClick?: (stepData: ArcTimelineStepClickData) => void;
}

export function ArcTimeline(props: ArcTimelineProps) {
  const { className, children, data, arcConfig = {}, defaultActiveStep = {}, onTimelineStepClick, ...restProps } = props;

  const {
    circleWidth = 5000,
    angleBetweenMinorSteps = 0.35,
    lineCountFillBetweenSteps = 10,
    boundaryPlaceholderLinesCount = 50,
    contentClassName = '',
  } = arcConfig;

  const { time: defaultActiveTime = data[0].time, stepIndex: defaultActiveStepIndex = 0 } = defaultActiveStep || {};

  const [circleContainerRotateDeg, setCircleContainerRotateDeg] = useState(() => {
    let count = 0;
    for (const timelineItem of data) {
      if (timelineItem.time === defaultActiveTime) {
        count += defaultActiveStepIndex;
        break;
      } else {
        count += timelineItem.steps.length;
      }
    }
    return -1 * count * angleBetweenMinorSteps * (lineCountFillBetweenSteps + 1) - angleBetweenMinorSteps * boundaryPlaceholderLinesCount;
  });

  return (
    <div { ...restProps } className={ cn('relative h-[380px] w-full overflow-hidden', className) }>
      <div
        style={ {
          transform: `translateX(-50%) rotate(${circleContainerRotateDeg}deg)`,
          width: `${circleWidth}px`,
        } }
        className="absolute top-28 left-1/2 aspect-square origin-center rounded-full transition-all duration-500 ease-in-out"
      >
        { data.map((line, lineIndex) => {
          return (
            <div key={ `${lineIndex}` }>
              { line.steps.map((step, stepIndex) => {
                // calc the angle of the step
                const angle =
                  angleBetweenMinorSteps *
                    (lineCountFillBetweenSteps + 1) *
                    (data
                      .slice(0, lineIndex)
                      .map((item) => item.steps.length)
                      .reduce((prev, current) => prev + current, 0) +
                      stepIndex) +
                  angleBetweenMinorSteps * boundaryPlaceholderLinesCount;
                const isLastStep = lineIndex === data.length - 1 && stepIndex === line.steps.length - 1;
                const isFirstStep = lineIndex === 0 && stepIndex === 0;
                // check if the step is active
                const isActive = Math.abs(angle + circleContainerRotateDeg) < 0.01;
                return (
                  <div key={ `${lineIndex}-${stepIndex}` }>
                    { /* placeholder lines before the first step */ }
                    { isFirstStep ?
                      <PlaceholderLines
                        isFirstStep={ true }
                        isLastStep={ false }
                        angle={ angle }
                        angleBetweenMinorSteps={ angleBetweenMinorSteps }
                        lineCountFillBetweenSteps={ lineCountFillBetweenSteps }
                        boundaryPlaceholderLinesCount={ boundaryPlaceholderLinesCount }
                        lineIndex={ lineIndex }
                        stepIndex={ stepIndex }
                        circleWidth={ circleWidth }
                        circleContainerRotateDeg={ circleContainerRotateDeg }
                      />
                    : null }
                    <div
                      className={ cn(
                        'absolute top-0 left-1/2 -translate-x-1/2 cursor-pointer transition-all duration-200',
                        isActive ? 'h-[120px] w-[2px]' : 'h-16 w-[1.5px]',
                      ) }
                      style={ {
                        transformOrigin: `50% ${circleWidth / 2}px`,
                        transform: `rotate(${angle}deg)`,
                      } }
                      onClick={ () => {
                        setCircleContainerRotateDeg(-1 * angle);
                        onTimelineStepClick?.({
                          timelineIndex: lineIndex,
                          stepIndex,
                          time: line.time,
                          step: step,
                        });
                      } }
                    >
                      <div
                        className={ cn(
                          'h-full w-full transition-colors duration-200',
                          isActive ?
                            `
                              bg-(--step-line-active-color,#888888)
                              dark:bg-(--step-line-active-color,#9780ff)
                            `
                          : `
                            bg-(--step-line-inactive-color,#b1b1b1)
                            dark:bg-(--step-line-inactive-color,#737373)
                          `,
                        ) }
                        style={ {
                          transformOrigin: 'center top',
                          transform: `rotate(${-1 * angle - circleContainerRotateDeg}deg)`,
                        } }
                      >
                        <div
                          className={ cn(
                            'absolute bottom-0 left-1/2 aspect-square -translate-x-1/2',
                            isActive ?
                              `
                                translate-y-[calc(100%_+_14px)] scale-[1.2] text-(--icon-active-color,#555555)
                                dark:text-(--icon-active-color,#d4d4d4)
                              `
                            : `
                              translate-y-[calc(100%_+_4px)] scale-100 text-(--icon-inactive-color,#a3a3a3)
                              dark:text-(--icon-inactive-color,#a3a3a3)
                            `,
                          ) }
                        >
                          { step.icon }
                        </div>
                        <p
                          className={ cn(
                            `
                              absolute bottom-0 left-1/2 line-clamp-3 flex w-[240px] -translate-x-1/2 translate-y-[calc(100%_+_42px)]
                              items-center justify-center text-center text-sm transition-opacity duration-300 ease-in
                            `,
                            `
                              text-(--description-color,#555555)
                              dark:text-(--description-color,#d4d4d4)
                            `,
                            isActive ? 'opacity-100' : 'opacity-0',
                            contentClassName,
                          ) }
                        >
                          { step.content }
                        </p>
                      </div>
                      { stepIndex === 0 && (
                        <div
                          className={ cn(
                            'absolute top-0 left-1/2 z-10 -translate-x-1/2 translate-y-[calc(-100%-24px)] whitespace-nowrap',
                            isActive ?
                              `
                                text-(--time-active-color,#555555)
                                dark:text-(--time-active-color,#d4d4d4)
                              `
                            : `
                              text-(--time-inactive-color,#a3a3a3)
                              dark:text-(--time-inactive-color,#a3a3a3)
                            `,
                          ) }
                        >
                          { line.time }
                        </div>
                      ) }
                    </div>

                    { /* fill lines between steps, in the last step, fill the placeholder lines */ }
                    <PlaceholderLines
                      isFirstStep={ false }
                      isLastStep={ isLastStep }
                      angle={ angle }
                      angleBetweenMinorSteps={ angleBetweenMinorSteps }
                      lineCountFillBetweenSteps={ lineCountFillBetweenSteps }
                      boundaryPlaceholderLinesCount={ boundaryPlaceholderLinesCount }
                      lineIndex={ lineIndex }
                      stepIndex={ stepIndex }
                      circleWidth={ circleWidth }
                      circleContainerRotateDeg={ circleContainerRotateDeg }
                    />
                  </div>
                );
              }) }
            </div>
          );
        }) }
      </div>
    </div>
  );
}

interface PlaceholderLinesProps {
  isFirstStep: boolean;
  angleBetweenMinorSteps: number;
  angle: number;
  lineCountFillBetweenSteps: number;
  boundaryPlaceholderLinesCount: number;
  isLastStep: boolean;
  lineIndex: number;
  stepIndex: number;
  circleWidth: number;
  circleContainerRotateDeg: number;
}
function PlaceholderLines(props: PlaceholderLinesProps) {
  const {
    isFirstStep,
    isLastStep,
    angle,
    angleBetweenMinorSteps,
    lineCountFillBetweenSteps,
    boundaryPlaceholderLinesCount,
    lineIndex,
    stepIndex,
    circleWidth,
    circleContainerRotateDeg,
  } = props;

  const getAngle = (index: number) => {
    if (isFirstStep) {
      return index * angleBetweenMinorSteps;
    } else {
      return angle + (index + 1) * angleBetweenMinorSteps;
    }
  };

  return (
    <>
      { Array(isLastStep || isFirstStep ? boundaryPlaceholderLinesCount : lineCountFillBetweenSteps)
        .fill('')
        .map((_, fillIndex) => {
          const fillAngle = getAngle(fillIndex);
          return (
            <div
              key={ `${lineIndex}-${stepIndex}-${fillIndex}` }
              className="absolute top-0 left-1/2 h-[34px] w-[1px] -translate-x-1/2"
              style={ {
                transformOrigin: `50% ${circleWidth / 2}px`,
                transform: `rotate(${fillAngle}deg)`,
              } }
            >
              <div
                className={ `
                  h-full w-full bg-(--placeholder-line-color,#a1a1a1)
                  dark:bg-(--placeholder-line-color,#737373)
                ` }
                style={ {
                  transformOrigin: 'center top',
                  transform: `rotate(${-1 * fillAngle - circleContainerRotateDeg}deg)`,
                } }
              ></div>
            </div>
          );
        }) }
    </>
  );
}
