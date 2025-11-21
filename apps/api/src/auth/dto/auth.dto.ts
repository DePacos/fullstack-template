import {
  SignUpRequestSchema,
  SignInRequestSchema,
  SignInResponseSchema,
  MeResponseSchema,
  UpdateTokenResponseSchema,
  SendingMailResponseSchema,
  PasswordRecoveryRequestEmailSchema,
  PasswordRecoveryRequestPasswordSchema,
  EmailConfirmationRequestSchema,
  ResponseSuccessSchema,
  TwoFactorAuthRequestSchema,
} from '@template/contracts';
import { createZodDto } from 'nestjs-zod';

export class RegisterRequestDto extends createZodDto(SignUpRequestSchema) {}

export class LoginRequestDto extends createZodDto(SignInRequestSchema) {}
export class LoginResponseDto extends createZodDto(SignInResponseSchema) {}

export class MeResponseDto extends createZodDto(MeResponseSchema) {}

export class PasswordRecoveryRequestEmailDto extends createZodDto(
  PasswordRecoveryRequestEmailSchema,
) {}
export class PasswordRecoveryRequestPasswordDto extends createZodDto(
  PasswordRecoveryRequestPasswordSchema,
) {}

export class UpdateTokenResponseDto extends createZodDto(UpdateTokenResponseSchema) {}

export class SentMailResponseDto extends createZodDto(SendingMailResponseSchema) {}

export class EmailConfirmationRequestDto extends createZodDto(EmailConfirmationRequestSchema) {}

export class TwoFactorAuthRequestDto extends createZodDto(TwoFactorAuthRequestSchema) {}

export class ResponseSuccessDto extends createZodDto(ResponseSuccessSchema) {}
