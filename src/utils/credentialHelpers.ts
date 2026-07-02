import type { Credential } from "../types/credentials";

export function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isExpired(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() < Date.now();
}

export function buildDuckLakeConnectionString(credential: Credential) {
  const database = credential.dataset ?? credential.datasetId;
  const bucket = credential.bucket ?? credential.datasetId;

  return `-- Run this script from a deployment that can reach the catalog Postgres
-- and the Garage S3 endpoint. The hostname '${import.meta.env.VITE_CATALOG_HOST}' is the public endpoint
-- of the Postgres catalog for this dataset.

INSTALL ducklake;
INSTALL postgres;

LOAD ducklake;
LOAD postgres;

CREATE OR REPLACE SECRET (
    TYPE postgres,
    HOST '${import.meta.env.VITE_CATALOG_HOST}',
    PORT 5432,
    DATABASE ${database},
    USER '${credential.postgresUsername}',
    PASSWORD '${credential.postgresPassword}'
);

CREATE OR REPLACE SECRET garage_secret (
    TYPE s3,
    PROVIDER config,
    KEY_ID '${credential.garageAccessKeyId}',
    SECRET '${credential.garageSecretAccessKey}',
    REGION 'garage',
    ENDPOINT '${import.meta.env.VITE_GARAGE_ENDPOINT}',
    URL_STYLE 'path',
    USE_SSL false
);

ATTACH 'ducklake:postgres:dbname=${database}' AS ${import.meta.env.VITE_CATALOG_ALIAS} (
    DATA_PATH 's3://${bucket}/'
);

USE ${import.meta.env.VITE_CATALOG_ALIAS};`;
}
