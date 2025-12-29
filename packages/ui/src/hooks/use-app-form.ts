import { createFormHook } from '@tanstack/react-form';

import { InputForm, SubmitForm, InputTwoFactorForm } from '../components/form';
import { fieldContext, formContext } from '../utils';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputForm, InputTwoFactorForm },
  formComponents: { SubmitForm },
});
