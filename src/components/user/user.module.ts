import { Module } from '@nestjs/common';
import { OctokitModule } from '../octokit/octokit.module';
import { UserController } from './user.controller';

@Module({
  imports: [OctokitModule],
  controllers: [UserController],
})
export class UserModule {}
