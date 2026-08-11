import React from 'react';

export interface ProcessStep {
  title: string;
  detail: string;
  /** Marks a step that looped back to an earlier one rather than moving forward. */
  loops?: boolean;
}

/**
 * The original Workflows process, rendered as numbered step cards. Steps
 * flagged `loops` get an accent border and a "loops back" tag — the
 * define/analyze cycle was the part of the process that never ran straight
 * through, which is the whole point of showing it.
 */
const ProcessSteps = ({ steps, className = '' }: { steps: ProcessStep[]; className?: string }) => (
  <ol className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
    {steps.map((step, i) => (
      <li
        key={step.title}
        className={`relative rounded-lg border-2 px-5 py-5 ${
          step.loops ? 'border-(--color-2)/40 bg-white/[0.07]' : 'border-white/20 bg-white/[0.03]'
        }`}
      >
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-mono text-sm font-bold tracking-widest text-white/40">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h4 className="text-base font-bold text-white">{step.title}</h4>
        </div>
        <p className="text-sm leading-6 text-white/70 text-pretty">{step.detail}</p>
        {step.loops && (
          <span className="mt-3 inline-block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-(--color-2)/80">
            ↺ loops back
          </span>
        )}
      </li>
    ))}
  </ol>
);

export default ProcessSteps;
