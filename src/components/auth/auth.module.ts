import { Module } from '@nestjs/common';
import { OctokitModule } from '../octokit/octokit.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [OctokitModule],
  controllers: [AuthController],
})
export class AuthModule {}
