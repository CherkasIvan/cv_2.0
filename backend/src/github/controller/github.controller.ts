import { Controller, Get } from '@nestjs/common';
import { GithubService } from '../service/github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repositories')
  async getRepositories() {
    return this.githubService.getRepositories();
  }

  @Get('token')
  getToken() {
    return { token: process.env.GITHUB_TOKEN };
  }
}
