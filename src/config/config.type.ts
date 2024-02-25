import { AppConfig } from './app-config.type';
import { AuthConfig } from './auth-config.type';
import { FileConfig } from './file-config.type';
import { DatabaseConfig } from './database-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  file: FileConfig;
  database: DatabaseConfig;
};
