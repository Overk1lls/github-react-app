import { Module } from '@nestjs/common';
import { AuthModule } from './components/auth/auth.module';
import { OctokitModule } from './components/octokit/octokit.module';
import { RepoModule } from './components/repo/repo.module';
import { UserModule } from './components/user/user.module';

@Module({
  imports: [OctokitModule, AuthModule, RepoModule, UserModule],
})
export class AppModule {}
