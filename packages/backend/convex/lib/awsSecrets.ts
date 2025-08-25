import {
  CreateSecretCommand,
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  PutSecretValueCommand,
  ResourceExistsException,
  SecretsManagerClient
} from '@aws-sdk/client-secrets-manager';

let client: SecretsManagerClient | null = null;

export const createSecretsManagerClient = (): SecretsManagerClient => {
  client ??= new SecretsManagerClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  });
  return client;
};

export const getSecretValue = async (
  secretName: string
): Promise<GetSecretValueCommandOutput> => {
  const client = createSecretsManagerClient();
  return await client.send(new GetSecretValueCommand({ SecretId: secretName }));
};

export const upsertSecretValue = async (
  secretName: string,
  secretValue: Record<string, unknown>
): Promise<void> => {
  const client = createSecretsManagerClient();

  try {
    // try to create the secret
    await client.send(
      new CreateSecretCommand({
        Name: secretName,
        SecretString: JSON.stringify(secretValue)
      })
    );
  } catch (error) {
    // if the secret already exists, update it
    if (error instanceof ResourceExistsException) {
      await client.send(
        new PutSecretValueCommand({
          SecretId: secretName,
          SecretString: JSON.stringify(secretValue)
        })
      );
    } else {
      throw error;
    }
  }
};

export const parseSecretFromString = <T = Record<string, unknown>>(
  secret: GetSecretValueCommandOutput
): T | null => {
  if (!secret.SecretString) {
    return null;
  }

  try {
    return JSON.parse(secret.SecretString) as T;
  } catch (error) {
    console.error('Error parsing secret', error);
    return null;
  }
};
