import clsx from 'clsx';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function LoadingSpinner({
  size = 'medium',
  color = '#C444FF',
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container" data-testid="loading-spinner-container">
      <div
        className={clsx('loading-spinner', size)}
        style={{ '--spinner-color': color } as React.CSSProperties}
        data-testid="loading-spinner"
      ></div>
    </div>
  );
}
