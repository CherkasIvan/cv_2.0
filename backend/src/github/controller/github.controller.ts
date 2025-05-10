import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from '../service/github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repositories')
  async getRepositories(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '100',
  ) {
    const pageNumber = parseInt(page, 10);
    const perPageNumber = parseInt(perPage, 10);
    return this.githubService.getGithubPrivateRepos(pageNumber, perPageNumber);
  }

  @Get('token')
  getToken() {
    return { token: process.env.GITHUB_PRIVATE_ACCESS_TOKEN };
  }
}
