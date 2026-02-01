import { db } from '../firebase';
import { 
  doc, getDoc, setDoc, updateDoc, collection, 
  getDocs, query, where, increment, runTransaction 
} from "firebase/firestore";
import { User, SiteSettings, Course } from '../types';
import { INITIAL_INDEX_NUMBER } from '../constants';

// --- SETTINGS LOGIC ---
export const getSettings = async (): Promise<SiteSettings> => {
  const docRef = doc(db, "site", "settings");
  const docSnap = await getDoc(docRef);
  // Returns cloud data if exists, otherwise returns your local DEFAULT_SETTINGS
  return docSnap.exists() ? docSnap.data() as SiteSettings : DEFAULT_SETTINGS; 
};

export const saveSettings = async (settings: SiteSettings) => {
  await setDoc(doc(db, "site", "settings"), settings);
};

// --- COURSE LOGIC ---
export const getCourses = async (): Promise<Course[]> => {
  const querySnapshot = await getDocs(collection(db, "courses"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

// --- USER & REGISTRATION LOGIC ---
export const registerUser = async (userData: any): Promise<User> => {
  const counterRef = doc(db, "metadata", "user_counter");
  
  return await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef);
    let nextIndex = INITIAL_INDEX_NUMBER;

    if (!counterSnap.exists()) {
      transaction.set(counterRef, { current: INITIAL_INDEX_NUMBER });
    } else {
      nextIndex = counterSnap.data().current + 1;
      transaction.update(counterRef, { current: nextIndex });
    }

    const newUser: User = {
      ...userData,
      indexNumber: nextIndex.toString(),
      role: 'student',
      activeCourses: [],
      marks: [],
      watchTime: {}
    };

    const userRef = doc(db, "users", newUser.indexNumber);
    transaction.set(userRef, newUser);
    return newUser;
  });
};

export const getUserByIndex = async (index: string): Promise<User | undefined> => {
  const docSnap = await getDoc(doc(db, "users", index));
  return docSnap.exists() ? docSnap.data() as User : undefined;
};

export const updateUser = async (updatedUser: User) => {
  await setDoc(doc(db, "users", updatedUser.indexNumber), updatedUser, { merge: true });
  // Keep local mirror for immediate UI response
  localStorage.setItem('apiwada_user', JSON.stringify(updatedUser));
};
