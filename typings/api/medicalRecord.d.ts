declare namespace MedicalRecord {
  interface MedicalRecord {
    id: number;
    appointmentId: number;
    appointment?: Appointment.Appointment;
    patientId?: number;
    patient?: Hospital.Patient;
    doctorId?: number;
    doctor?: Hospital.Doctor;
    mainComplaint: string;
    nowSickness: string;
    diagnostic: string;
    notes: string;
    createdTime?: string;
    updatedTime?: string;
  }
}
