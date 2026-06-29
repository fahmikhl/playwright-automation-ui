import { test as setup } from '@playwright/test';
import { buildCredentials, createAuthSession, Credentials } from '@utils/accountApi';
import { saveSession, writeStorageState } from '@utils/authFiles';

setup('authenticate book store user', async ({ request }) => {
  const envUser = process.env.DEMOQA_USERNAME;
  const envPass = process.env.DEMOQA_PASSWORD;
  const envUserId = process.env.DEMOQA_USERID;

  const credentials: Credentials =
    envUser && envPass ? { username: envUser, password: envPass } : buildCredentials();

  const session = await createAuthSession(request, credentials, envUser ? envUserId : undefined);

  writeStorageState(session);
  saveSession(session);
});
