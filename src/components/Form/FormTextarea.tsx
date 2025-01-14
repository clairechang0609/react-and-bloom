import { FC } from 'react';
import type { TextAreaProps } from '../../types/form';
import type { Product } from '../../types/product';
import Field from './Field';

const FormTextarea: FC<TextAreaProps> = ({ id, label, rows = 3, placeholder = '請輸入內容', register, rules, errors }) => {
  return (
    <>
      <Field id={id} label={label} isRequired={!!rules} errors={errors}>
        <textarea
          rows={rows}
          id={id}
          placeholder={placeholder}
          className={`form-control ${errors[id] && "is-invalid"}`}
          {...register(id, rules)}
        />
      </Field>
    </>
  )
}

export default FormTextarea;
