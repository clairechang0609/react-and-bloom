import { FC, memo } from 'react';
import type { FieldProps } from '../../types/form';

const Field: FC<FieldProps> = memo(({ id, label, children, isRequired = false, errors }) => {
  const error = id.includes('.')
    ? id.split('.').reduce((obj, key) => obj?.[key], errors as Record<string, never>)
    : errors?.[id];
  return (
    <>
      <label htmlFor={id} className="form-label d-block mb-1">
        {label}
        {isRequired && <span className="text-danger ms-1">*</span>}
      </label>
      {children}
      {error && <small className="text-danger">{String(error?.message)}</small>}
    </>
  )
});

export default Field;
