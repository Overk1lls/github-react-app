export interface GithubRepoData {
  owner: string;
  repo: string;
}

export interface GithubData {
  repoData?: GithubRepoData;
  org?: string;
}
