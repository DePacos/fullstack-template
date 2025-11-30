import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@template/contracts';
import * as argon2 from 'argon2';

import { RegisterRequestDto } from '@/auth/dto';
import { PrismaService } from '@/prisma';
import { UserUpdateRequestDto } from '@/user/dto';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getUserById(id: User['id']) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  public async createUser(data: Omit<RegisterRequestDto, 'passwordConfirmation'>) {
    const { name, email, password } = data;

    return this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        isVerified: false,
        account: {
          create: { type: 'CREDENTIALS', provider: 'LOCAL' },
        },
      },
    });
  }

  public async updateUser(id: string, data: UserUpdateRequestDto) {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  public async verifyUser(id: string) {
    await this.prismaService.user.update({ where: { id }, data: { isVerified: true } });
  }

  public async changePassword(id: string, newPassword: string) {
    const passwordHash = await argon2.hash(newPassword);
    await this.prismaService.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }
}
