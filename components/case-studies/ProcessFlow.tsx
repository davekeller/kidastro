import React from 'react';

export interface FlowStep {
  title: string;
  detail: string;
}

export interface FlowPhase {
  label: string;
  steps: FlowStep[];
  /** Annotates the phase as a cycle rather than a straight run. */
  loop?: string;
}

/**
 * The original Workflows process as a phase rail: a single rule runs across the
 * top with a node per phase, and each phase's steps hang beneath it as plain
 * type. Deliberately unboxed — ten bordered cards read as a grid of containers
 * rather than as one process moving left to right.
 */
const ProcessFlow = ({ phases, className = '' }: { phases: FlowPhase[]; className?: string }) => {
  const starts = phases.reduce<number[]>((acc, phase) => {
    acc.push((acc[acc.length - 1] ?? 0) + phase.steps.length);
    return acc;
  }, []);

  return (
    <div className={`grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {phases.map((phase, pi) => {
        const phaseStart = pi === 0 ? 0 : starts[pi - 1];

        return (
          <div key={phase.label} className="relative pt-6">
            {/* Rail: a rule across the top with a node marking this phase. */}
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15" />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-(--color-2)"
            />

            <div className="mb-5 flex items-baseline gap-2">
              <h4 className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-(--color-2)">
                {phase.label}
              </h4>
              {phase.loop && (
                <span className="font-mono text-[0.65rem] lowercase tracking-wide text-white/35">
                  ↺ {phase.loop}
                </span>
              )}
            </div>

            <ol className="space-y-5">
              {phase.steps.map((step, si) => (
                <li key={step.title} className="grid grid-cols-[1.75rem_1fr] gap-x-1">
                  <span className="font-mono text-xs leading-6 text-white/30">
                    {String(phaseStart + si + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h5 className="text-[0.95rem] font-bold leading-6 text-white">{step.title}</h5>
                    <p className="mt-0.5 text-sm leading-6 text-white/55 text-pretty">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
};

export default ProcessFlow;
