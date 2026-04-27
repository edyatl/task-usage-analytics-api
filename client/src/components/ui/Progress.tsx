import * as RadixProgress from '@radix-ui/react-progress';

interface ProgressProps {
  value: number;          // 0–100
  className?: string;
  indicatorClassName?: string;
}

const Progress = ({ value, className = '', indicatorClassName = '' }: ProgressProps) => {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <RadixProgress.Root
      value={clamped}
      className={`relative h-2.5 w-full overflow-hidden rounded-full bg-muted ${className}`}
      style={{ transform: 'translateZ(0)' }} // fixes Safari overflow-hidden + border-radius bug
    >
      <RadixProgress.Indicator
        className={`h-full rounded-full bg-primary transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${indicatorClassName}`}
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </RadixProgress.Root>
  );
};

export { Progress };
