import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';


if (!getApps().length) {
  const serviceAccount = await Bun.file('../service-account.json').json();
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export const auth = getAuth();