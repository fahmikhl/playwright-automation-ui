import fs from 'fs';
import path from 'path';
import type { Cookie } from '@playwright/test';
import { AuthSession } from './accountApi';

const authDir = path.join(process.cwd(), '.auth');
const baseUrl = process.env.BASE_URL ?? 'https://demoqa.com';
const cookieDomain = new URL(baseUrl).hostname;

export const storageStatePath = path.join(authDir, 'user.json');
export const sessionPath = path.join(authDir, 'session.json');

interface StorageState {
  cookies: Cookie[];
  origins: never[];
}

export function buildStorageState(session: AuthSession): StorageState {
  const cookie = (name: string, value: string): Cookie => ({
    name,
    value,
    domain: cookieDomain,
    path: '/',
    expires: -1,
    httpOnly: false,
    secure: false,
    sameSite: 'Lax',
  });

  return {
    cookies: [
      cookie('userName', session.username),
      cookie('userID', session.userId),
      cookie('token', session.token),
      cookie('expires', session.expires),
    ],
    origins: [],
  };
}

export function writeStorageState(session: AuthSession): void {
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(storageStatePath, JSON.stringify(buildStorageState(session), null, 2));
}

export function saveSession(session: AuthSession): void {
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
}

export function readSession(): AuthSession {
  return JSON.parse(fs.readFileSync(sessionPath, 'utf-8'));
}
