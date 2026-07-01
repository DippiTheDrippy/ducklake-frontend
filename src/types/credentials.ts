export interface Credential {
  id: string;

  accessLevel: string;

  datasetId: string;
  userId: string;

  dataset?: string;
  bucket?: string;

  postgresUsername: string;
  postgresPassword: string;

  garageAccessKeyId: string;
  garageSecretAccessKey: string;

  expiresAt: string;
}
