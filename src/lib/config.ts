import { config as loadConfig } from "dotenv";
import appRootPath from 'app-root-path';

interface Config {
  port: number;
  githubToken: string;
  githubClientId: string;
  githubClientSecret: string;
}

export const isNotProduction = (): boolean => {
  return !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
};

const envConfig = loadConfig({
  path: appRootPath.resolve('./config/.env'),
  debug: isNotProduction(),
});

const loadError = envConfig.error as NodeJS.ErrnoException;
if (loadError) {
  if (loadError.code === 'ENOENT' || loadError.code === 'EACCES') {
    console.info(`Failed to load config from file "${loadError.path}": ${loadError.code}`);
  } else {
    console.warn('Unknown config file loading errors', loadError);
  }
}

const getConfig = (): Config => {
  [
    'PORT',
    'GITHUB_TOKEN',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET'
  ].forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`The environment variable '${variable}' is missing!`);
    }
  });

  return {
    port: parseInt(process.env.PORT!),
    githubToken: process.env.GITHUB_TOKEN!,
    githubClientId: process.env.GITHUB_CLIENT_ID!,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET!,
  };
};

export const config: Config = getConfig();
