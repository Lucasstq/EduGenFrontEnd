import React, { forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, options, className = '', id, onChange, ...props }, ref) => {
    const selectId = id || props.name;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className={`${styles.wrapper} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`${styles.select} ${error ? styles.error : ''} ${className}`}
          onChange={handleChange}
          {...props}
        >
          <option value="">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
