import { FC, memo } from 'react';
import type { FieldProps } from '../../types/form';

const FloatLabelField: FC<FieldProps> = memo(({ id, label, children, errors }) => {
  const error = id.includes('.')
    ? id.split('.').reduce((obj, key) => obj?.[key], errors as Record<string, never>)
    : errors?.[id];
  return (
    <>
      <div className="form-floating border-0 border-bottom border-black rounded-0">
        {children}
        <label htmlFor={id}>
          {label}
        </label>
      </div>
      {error && <small className="text-danger">{String(error?.message)}</small>}
    </>
  )
});

export default FloatLabelField;
