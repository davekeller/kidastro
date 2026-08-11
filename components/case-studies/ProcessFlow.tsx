import React from 'react';

export interface FlowStep {
  title: string;
  detail: string;
}

export interface FlowPhase {
  label: string;
  steps: FlowStep[];
  /** Renders the phase's steps inside a loop bracket with this caption. */
  loop?: string;
}

const StepNode = ({ n, step }: { n: number; step: FlowStep }) => (
  <li className="rounded-md border border-white/15 bg-white/[0.05] px-3 py-2.5">
    <div className="flex items-baseline gap-2">
      <span className="font-mono text-[0.7rem] font-bold text-white/35">
        {String(n).padStart(2, '0')}
      </span>
      <h4 className="text-sm font-bold leading-tight text-white">{step.title}</h4>
    </div>
    <p className="mt-1 text-xs leading-5 text-white/60 text-pretty">{step.detail}</p>
  </li>
);

/**
 * The original Workflows process as a phased flowchart: phases run left to
 * right on desktop and top to bottom on mobile, with an arrow between each.
 * A phase carrying `loop` wraps its steps in an accent bracket — the
 * define/analyze cycle is the part that never ran straight through.
 */
const ProcessFlow = ({ phases, className = '' }: { phases: FlowPhase[]; className?: string }) => {
  // Global step numbers, derived up front: each phase starts where the last ended.
  const starts = phases.reduce<number[]>((acc, phase) => {
    acc.push((acc[acc.length - 1] ?? 0) + phase.steps.length);
    return acc;
  }, []);

  return (
    <div className={`flex flex-col items-stretch gap-3 lg:flex-row ${className}`}>
      {phases.map((phase, pi) => {
        const phaseStart = pi === 0 ? 0 : starts[pi - 1];
        const node = (
          <div
            key={phase.label}
            className="flex-1 rounded-lg border-2 border-white/15 bg-white/[0.03] p-4"
          >
            <p className="mb-3 font-mono text-[0.7rem] font-bold uppercase tracking-[0.25em] text-(--color-2)/80">
              {phase.label}
            </p>
            <ol
              className={`space-y-2 ${
                phase.loop ? 'border-l-2 border-(--color-2)/50 pl-3' : ''
              }`}
            >
              {phase.steps.map((step, si) => (
                <StepNode key={step.title} n={phaseStart + si + 1} step={step} />
              ))}
            </ol>
            {phase.loop && (
              <p className="mt-2 pl-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-(--color-2)/80">
                ↺ {phase.loop}
              </p>
            )}
          </div>
        );

        if (pi === phases.length - 1) return node;

        return (
          <React.Fragment key={phase.label}>
            {node}
            <div aria-hidden="true" className="flex items-center justify-center text-2xl text-white/25">
              <span className="lg:hidden">↓</span>
              <span className="hidden lg:inline">→</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProcessFlow;
