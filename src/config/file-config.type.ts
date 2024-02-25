export type FileConfig = {
  driver: string;
  maxFileSize: number;
  awsS3Region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  awsDefaultS3Bucket?: string;
};
