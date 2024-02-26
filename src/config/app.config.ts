import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '../utils/validate-config';
import {
  Max,
  Min,
  IsUrl,
  IsInt,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsBoolean()
  @IsOptional()
  DEBUG: boolean;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    debug: process.env.DEBUG === 'true' ? true : false,
    name: process.env.APP_NAME || 'app',
    nodeEnv: process.env.NODE_ENV || 'development',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
    port: process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
  };
});
