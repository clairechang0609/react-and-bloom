import { FC, memo } from 'react';
import type { FieldProps } from '../../types/form';

const Field: FC<FieldProps> = memo(({ id, label, children, isRequired = false, errors }) => {
  return (
    <>
      <label htmlFor={id} className="form-label d-block mb-1">
        {label}
        {isRequired && <span className="text-danger ms-1">*</span>}
      </label>
      {children}
      {errors?.[id] && <small className="text-danger">{String(errors?.[id]?.message)}</small>}
    </>
  )
});

export default Field;
