import { FC, memo } from 'react';
import type { InputProps } from '../../types/form';
import FloatLabelField from './FloatLabelField';

const FormInput: FC<InputProps> = memo(({ id, label, type = 'text', placeholder = '請輸入內容', register, rules, errors }) => {
  const error = id.includes('.')
    ? id.split('.').reduce((obj, key) => obj?.[key], errors as Record<string, never>)
    : errors?.[id];
  return (
    <>
      <FloatLabelField id={id} label={label} isRequired={!!rules} errors={errors}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`form-control border-0 rounded-0 bg-transparent outline-0 px-0 ${error && "is-invalid"}`}
          {...register(id, rules)}
        />
      </FloatLabelField>
    </>
  )
});

export default FormInput;
