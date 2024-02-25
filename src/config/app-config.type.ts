export type AppConfig = {
  name: string;
  port: number;
  debug: boolean;
  nodeEnv: string;
  frontendDomain?: string;
  workingDirectory: string;
};
