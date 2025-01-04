declare namespace Appointment {
  // Department 类型声明
  type Appointment = {
    [x: string]: any;
    id: number;
    patientId: number;
    patient?: Hospital.Patient;
    doctorId: number;
    doctor?: Hospital.Doctor;
    appointmentDate: string;
    status: string;
    createdTime: string;
    updatedTime: string;
    doctorScheduleId: number;
    DoctorSchedule?: Schedule.DoctorSchedule;
  };
}
