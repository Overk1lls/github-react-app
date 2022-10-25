import { LogLevel } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export function getLogCategories(): LogLevel[] {
  return isNotProduction() ? ['debug', 'error', 'log', 'warn'] : ['error', 'warn', 'log'];
}

export const isNotProduction = (): boolean => {
  return !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
};

export const githubConfig = registerAs('github', () => ({
  octokitToken: process.env.OCTOKIT_TOKEN,
  clientId: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
}));

export const httpConfig = registerAs('http', () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  originUrl: process.env.ORIGIN_URL,
}));
