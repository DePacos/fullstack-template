import { ComponentProps } from 'react';

import { useFieldContext } from '../../utils';
import { FieldError, FieldLabel } from './field';
import { Input } from './input';

type Props = {
  label?: string;
} & ComponentProps<'input'>;

export const InputForm = ({ label, id, type, ...props }: Props) => {
  const { state, handleChange, name } = useFieldContext<string | boolean>();

  const inputId = `${name}-id`;
  const isInvalid = state.meta.isTouched && !state.meta.isValid;
  const isCheckbox = type === 'checkbox';

  return (
    <>
      <FieldLabel htmlFor={id || inputId}>{label}</FieldLabel>
      <Input
        id={id || inputId}
        aria-invalid={isInvalid}
        type={type}
        checked={isCheckbox ? (state.value as boolean) : false}
        value={!isCheckbox ? (state.value as string) : undefined}
        name={name}
        onChange={(e) => handleChange(isCheckbox ? e.target.checked : e.target.value)}
        {...props}
      />
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </>
  );
};
