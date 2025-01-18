import { FC, memo } from 'react';
import type { InputProps } from '../../types/form';
import type { Product } from '../../types/product';
import Field from './Field';

const FormInput: FC<InputProps> = memo(({ id, label, type = 'text', placeholder = '請輸入內容', register, rules, errors }) => {
  return (
    <>
      <Field id={id} label={label} isRequired={!!rules} errors={errors}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`form-control ${errors[id] && "is-invalid"}`}
          {...register(id, rules)}
        />
      </Field>
    </>
  )
});

export default FormInput;
