import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ 
    className, 
    label,
    showValue = false,
    valuePrefix = '',
    valueSuffix = '',
    value,
    min = 0,
    max = 100,
    step = 1,
    ...props 
  }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              {label}
            </label>
            {showValue && (
              <span className="text-sm text-gray-500">
                {valuePrefix}{value}{valueSuffix}
              </span>
            )}
          </div>
        )}
        <input
          type="range"
          className={cn(
            'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer',
            'slider:bg-blue-600 slider:rounded-lg slider:appearance-none slider:h-2',
            '[&::-webkit-slider-track]:bg-gray-200 [&::-webkit-slider-track]:rounded-lg [&::-webkit-slider-track]:h-2',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-moz-range-track]:bg-gray-200 [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:h-2 [&::-moz-range-track]:border-0',
            '[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            className
          )}
          value={value}
          min={min}
          max={max}
          step={step}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
