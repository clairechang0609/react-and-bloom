import { FC, memo } from 'react';
import type { InputProps } from '../../types/form';
import Field from './Field';

const FormInput: FC<InputProps> = memo(({ id, label, type = 'text', placeholder = '請輸入內容', register, rules, errors }) => {
  const error = id.includes('.')
    ? id.split('.').reduce((obj, key) => obj?.[key], errors as Record<string, never>)
    : errors?.[id];
  return (
    <>
      <Field id={id} label={label} isRequired={!!rules} errors={errors}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`form-control ${error && "is-invalid"}`}
          {...register(id, rules)}
        />
      </Field>
    </>
  )
});

export default FormInput;
