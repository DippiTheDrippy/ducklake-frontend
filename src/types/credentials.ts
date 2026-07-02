export interface Credential {
  id: string;

  accessLevel: "READ" | "WRITE";

  name: string;

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
