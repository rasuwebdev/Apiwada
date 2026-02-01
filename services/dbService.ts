import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, getDocs, runTransaction } from "firebase/firestore";
import { User, SiteSettings, Course } from '../types';
import { INITIAL_INDEX_NUMBER } from '../constants';

// --- SETTINGS ---
export const getSettings = async (): Promise<SiteSettings | null> => {
  const docRef = doc(db, "site", "settings");
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as SiteSettings) : null;
};

// --- COURSES ---
export const getCourses = async (): Promise<Course[]> => {
  const querySnapshot = await getDocs(collection(db, "courses"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
};

// --- USER REGISTRATION ---
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

    transaction.set(doc(db, "users", newUser.indexNumber), newUser);
    return newUser;
  });
};
