import { UserResponseSchema, UserUpdateSchema } from '@template/contracts';
import { createZodDto } from 'nestjs-zod';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
export class UserUpdateRequestDto extends createZodDto(UserUpdateSchema) {}
