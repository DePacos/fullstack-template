'use client';

import { ComponentProps } from 'react';

import { useFormContext } from '../../utils';
import { Button } from '../button';

type Props = ComponentProps<'button'> & { loading?: boolean };

export const SubmitForm = ({ children, ...props }: Props) => {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        isValid: state.isValid,
      })}
    >
      {({ isValid }) => (
        <Button className="mt-4" variant="secondary" type="submit" disabled={!isValid} {...props}>
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};
