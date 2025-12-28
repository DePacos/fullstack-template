'use client';

import { OTPInputProps, REGEXP_ONLY_DIGITS } from 'input-otp';

import { useFieldContext } from '../../utils';
import { FieldError } from './field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './input-otp';

export const InputTwoFactorForm = ({ ...props }: Omit<OTPInputProps, 'render' | 'maxLength'>) => {
  const { state, handleChange } = useFieldContext<string>();
  const isInvalid = state.meta.isTouched && !state.meta.isValid;

  return (
    <>
      <InputOTP
        onChange={(e) => handleChange(e)}
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        {...props}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {isInvalid && <FieldError errors={state.meta.errors} />}
    </>
  );
};
