import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt: string;
}

const COLLECTION_NAME = 'messages';

/**
 * Submit contact inquiry from public website
 */
export async function submitContactMessage(
  data: Omit<ContactMessageRecord, 'id' | 'status' | 'createdAt'>
): Promise<string> {
  const customId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const docRef = doc(db, COLLECTION_NAME, customId);
  const now = new Date().toISOString();

  const payload: Omit<ContactMessageRecord, 'id'> = {
    ...data,
    status: 'new',
    createdAt: now,
  };

  try {
    await setDoc(docRef, payload);
    return customId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${customId}`);
  }
}

/**
 * Get all contact messages for admin inbox
 */
export async function getMessagesForAdmin(): Promise<ContactMessageRecord[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const messages: ContactMessageRecord[] = [];
    snapshot.forEach((docSnap) => {
      messages.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<ContactMessageRecord, 'id'>),
      });
    });
    return messages;
  } catch (error) {
    // If index or order error, try fallback without orderBy
    try {
      const fallbackSnap = await getDocs(collection(db, COLLECTION_NAME));
      const messages: ContactMessageRecord[] = [];
      fallbackSnap.forEach((docSnap) => {
        messages.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<ContactMessageRecord, 'id'>),
        });
      });
      return messages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (innerError) {
      handleFirestoreError(innerError, OperationType.LIST, COLLECTION_NAME);
    }
  }
}

/**
 * Update message status (e.g., mark as read or responded)
 */
export async function updateMessageStatus(
  id: string,
  status: ContactMessageRecord['status']
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }
}

/**
 * Delete a contact message
 */
export async function deleteMessage(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }
}
