import { config as loadConfig } from 'dotenv';
import appRootPath from 'app-root-path';

interface Config {
  PORT: number;
  OCTOKIT_TOKEN: string;
  AUTH_CLIENT_ID: string;
  AUTH_CLIENT_SECRET: string;
}

export const isNotProduction = (): boolean => {
  return !!process.env.DEBUG || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
};

const envConfig = loadConfig({
  path: appRootPath.resolve('./config/.env') || appRootPath.resolve('./.env'),
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

function getConfig(): Config {
  ['OCTOKIT_TOKEN', 'AUTH_CLIENT_ID', 'AUTH_CLIENT_SECRET'].forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`The environment variable '${variable}' is missing!`);
    }
  });
  return {
    ...envConfig.parsed,
    PORT: getPort(),
  } as Config;
}

function getPort(): number {
  if (envConfig.parsed?.PORT) {
    return parseInt(envConfig.parsed.PORT);
  } else if (process.env.PORT) {
    return parseInt(process.env.PORT);
  }
  return 8080;
}

export const config: Config = getConfig();
