import { config as loadConfig } from 'dotenv';
import appRootPath from 'app-root-path';

interface Config {
  PORT: number;
  GITHUB_TOKEN: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
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
  ['PORT', 'GITHUB_TOKEN', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'].forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`The environment variable '${variable}' is missing!`);
    }
  });
  return envConfig.parsed as unknown as Config;
};

export const config: Config = getConfig();
