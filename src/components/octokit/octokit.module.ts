import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OctokitService } from './octokit.service';

@Module({
  imports: [ConfigModule],
  providers: [OctokitService],
  exports: [OctokitService],
})
export class OctokitModule {}
