import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly githubToken = process.env.GITHUB_TOKEN;

  async getRepositories() {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${this.githubToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    return response.data;
  }
}
