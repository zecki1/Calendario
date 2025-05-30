import { firestore } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Appointment } from '@/types/tipos-auth';

export const appointmentService = {
  async getUserAppointments(userId: string): Promise<Appointment[]> {
    const appointmentsRef = collection(firestore, `users/${userId}/appointments`);
    const snapshot = await getDocs(appointmentsRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[];
  },

  async createAppointment(userId: string, date: Date, time: string): Promise<void> {
    const appointmentsRef = collection(firestore, `users/${userId}/appointments`);
    await addDoc(appointmentsRef, {
      date: date.toISOString(),
      time,
      createdAt: new Date().toISOString(),
    });
  },

  async cancelAppointment(appointmentId: string): Promise<void> {
    // Assuming appointments are stored globally or adjust path as needed
    const appointmentRef = doc(firestore, `appointments/${appointmentId}`);
    await deleteDoc(appointmentRef);
  },
};