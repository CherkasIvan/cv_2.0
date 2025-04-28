import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from '../service/github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repositories')
  async getRepositories(
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 100,
  ) {
    return this.githubService.getRepositories(page, perPage);
  }

  @Get('token')
  getToken() {
    return { token: process.env.GITHUB_PRIVATE_ACCESS_TOKEN };
  }
}
