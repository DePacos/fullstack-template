import { Injectable } from '@nestjs/common';
import { Uuid, Email, SignUpRequest, UserUpdate, AuthProvider, User } from '@template/contracts';
import * as argon2 from 'argon2';

import { ProviderUserData } from '@/auth/provider/types';
import { PrismaService } from '@/prisma';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}
  public async getUserById(id: Uuid): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  public async getUserByEmail(email: Email['email']) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { account: true },
    });
  }

  public async createUser(data: Omit<SignUpRequest, 'passwordConfirmation'>) {
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

  public async createUserByProvider(data: ProviderUserData) {
    const { name, email, provider } = data;
    return this.prismaService.user.create({
      data: {
        name,
        email,
        isVerified: true,
        account: {
          create: {
            type: 'OAUTH',
            provider,
          },
        },
      },
    });
  }

  public async createAccountByProvider(userId: string, provider: AuthProvider) {
    await this.prismaService.account.create({
      data: {
        userId,
        type: 'OAUTH',
        provider,
      },
    });
  }

  public async updateUser(id: Uuid, data: UserUpdate) {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  public async verifyUser(id: Uuid) {
    await this.prismaService.user.update({ where: { id }, data: { isVerified: true } });
  }

  public async changePassword(id: Uuid, newPassword: string) {
    const passwordHash = await argon2.hash(newPassword);
    await this.prismaService.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }
}
