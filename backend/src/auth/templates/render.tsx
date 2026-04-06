import { render } from '@react-email/render';
import { ResetPasswordTemplate } from './ResetPasswordTemplate.js';
import * as React from 'react';

export const renderResetPasswordEmail = async (name: string, resetLink: string) => {
  const html = await render(<ResetPasswordTemplate name={name} resetLink={resetLink} />);
  const text = await render(<ResetPasswordTemplate name={name} resetLink={resetLink} />, { plainText: true });
  return { html, text };
};
