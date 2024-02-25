import { IsString } from 'class-validator';
import { registerAs } from '@nestjs/config';
import { AuthConfig } from './auth-config.type';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
  };
});
