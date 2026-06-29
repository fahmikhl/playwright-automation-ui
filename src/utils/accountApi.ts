import { APIRequestContext } from '@playwright/test';

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthSession extends Credentials {
  userId: string;
  token: string;
  expires: string;
}

export function buildCredentials(): Credentials {
  const unique = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    username: `qa_${unique}`,
    password: `Qa!${unique}A9`,
  };
}

export async function registerUser(
  request: APIRequestContext,
  credentials: Credentials,
): Promise<string> {
  const response = await request.post('/Account/v1/User', {
    data: { userName: credentials.username, password: credentials.password },
  });
  if (!response.ok()) {
    throw new Error(`User registration failed (${response.status()}): ${await response.text()}`);
  }
  const body = await response.json();
  return body.userID;
}

export async function generateToken(
  request: APIRequestContext,
  credentials: Credentials,
): Promise<{ token: string; expires: string }> {
  const response = await request.post('/Account/v1/GenerateToken', {
    data: { userName: credentials.username, password: credentials.password },
  });
  const body = await response.json();
  if (body.status !== 'Success' || !body.token) {
    throw new Error(`Token generation failed: ${JSON.stringify(body)}`);
  }
  return { token: body.token, expires: body.expires };
}

export async function createAuthSession(
  request: APIRequestContext,
  credentials: Credentials,
  existingUserId?: string,
): Promise<AuthSession> {
  const userId = existingUserId ?? (await registerUser(request, credentials));
  const { token, expires } = await generateToken(request, credentials);
  return { ...credentials, userId, token, expires };
}
