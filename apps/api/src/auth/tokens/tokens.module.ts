import { Module } from '@nestjs/common';

import { TokensService } from '@/auth/tokens/tokens.service';
import { PrismaModule } from '@/prisma';

@Module({
  imports: [PrismaModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
