'use client';
import React from 'react';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  LoaderIcon,
  OctagonIcon,
} from '../assets/icons/svg';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group "
      icons={{
        success: <CircleCheckIcon />,
        info: <InfoIcon />,
        warning: <TriangleAlertIcon />,
        error: <OctagonIcon />,
        loading: <LoaderIcon />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
