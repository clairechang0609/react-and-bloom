import { FC, memo } from 'react';
import type { TextAreaProps } from '../../types/form';
import FloatLabelField from './FloatLabelField';

const FormTextarea: FC<TextAreaProps> = memo(({ id, label, rows = 3, placeholder = '請輸入內容', register, rules, errors }) => {
  return (
    <>
      <FloatLabelField id={id} label={label} isRequired={!!rules} errors={errors}>
        <textarea
          rows={rows}
          id={id}
          placeholder={placeholder}
          className={`form-control border-0 rounded-0 bg-transparent outline-0 px-0 ${errors[id] && "is-invalid"}`}
          {...register(id, rules)}
        />
      </FloatLabelField>
    </>
  )
});

export default FormTextarea;
