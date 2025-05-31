import {
  getAuth, signInWithPopup, UserCredential, User,
  GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider,
  OAuthProvider,
} from '@firebase/auth';
import { parseFullName } from 'parse-full-name';

const auth = getAuth();

const processResponse = (token: string | undefined, user: User, secret?: string) => {
  const name = parseFullName(user.displayName || '');
  return {
    token,
    secret,
    user: {
      email: user.email || user.providerData[0]?.email,
      mobile_number: user.phoneNumber,
      first_name: name.first ? `${name.first || ''}${name.middle ? ` ${name.middle}` : ''}`.replaceAll('+', ' ') : name.last,
      last_name: name.last?.replaceAll?.('+', ' '),
      external_id: user.providerData[0]?.uid,
      image: user.providerData[0]?.photoURL,
    },
  };
};

const withGoogle = () => new Promise((resolve, reject) => {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  signInWithPopup(getAuth(), provider)
    .then((result: UserCredential) => {
      const { user } = result;

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;

      resolve(processResponse(token, user));
    }).catch((err: any) => {
      if (err.code === 'auth/user-cancelled') return;
      reject(err);
    });
});

const withFacebook = () => new Promise((resolve, reject) => {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  signInWithPopup(auth, provider)
    .then((result: UserCredential) => {
      const { user } = result;

      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      resolve(processResponse(token, user));
    }).catch((err: any) => {
      if (err.code === 'auth/user-cancelled') return;
      reject(err);
    });
});

const withTwitter = () => new Promise((resolve, reject) => {
  const provider = new TwitterAuthProvider();
  signInWithPopup(auth, provider)
    .then((result: UserCredential) => {
      const { user } = result;
      const credential = TwitterAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const secret = credential?.secret;

      resolve(processResponse(token, user, secret));
    }).catch((err: any) => {
      if (err.code === 'auth/user-cancelled') return;
      reject(err);
    });
});

const withApple = () => new Promise((resolve, reject) => {
  const provider = new OAuthProvider('apple.com');
  provider.addScope('email');
  provider.addScope('name');
  signInWithPopup(auth, provider)
    .then((result: UserCredential) => {
      const { user } = result;
      const credential = OAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;
      const secret = credential?.secret;

      resolve(processResponse(token, user, secret));
    }).catch((err: any) => reject(err));
});

const authService = {
  withGoogle,
  withFacebook,
  withTwitter,
  withApple,
};

export default authService;
