import { APIRequestContext } from '@playwright/test';
import { AuthSession } from './accountApi';

function authHeaders(session: AuthSession): Record<string, string> {
  return { Authorization: `Bearer ${session.token}` };
}

export async function addBookToCollection(
  request: APIRequestContext,
  session: AuthSession,
  isbn: string,
): Promise<void> {
  const response = await request.post('/BookStore/v1/Books', {
    headers: authHeaders(session),
    data: { userId: session.userId, collectionOfIsbns: [{ isbn }] },
  });
  if (!response.ok()) {
    throw new Error(`Add book failed (${response.status()}): ${await response.text()}`);
  }
}

export async function deleteBookFromCollection(
  request: APIRequestContext,
  session: AuthSession,
  isbn: string,
): Promise<void> {
  await request.delete('/BookStore/v1/Book', {
    headers: authHeaders(session),
    data: { isbn, userId: session.userId },
  });
}

export async function deleteAllBooks(
  request: APIRequestContext,
  session: AuthSession,
): Promise<void> {
  const response = await request.delete(`/BookStore/v1/Books?UserId=${session.userId}`, {
    headers: authHeaders(session),
  });
  if (!response.ok()) {
    throw new Error(`Delete all books failed (${response.status()}): ${await response.text()}`);
  }
}
