import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, User as FirebaseUser } from 'firebase/auth';
import { User } from '@/types/tipos-auth';

export const authService = {
  async login({ email, password }: { email: string; password: string }): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
    };
  },

  async register({ name, email, password, confirmPassword }: { name: string; email: string; password: string; confirmPassword: string }): Promise<User> {
    if (password !== confirmPassword) {
      throw new Error('As senhas não coincidem');
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
    };
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  getCurrentUser(): User | null {
    const user = auth.currentUser;
    if (!user) return null;
    return {
      id: user.uid,
      email: user.email || '',
      name: user.displayName || '',
    };
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
        });
      } else {
        callback(null);
      }
    });
  },
};