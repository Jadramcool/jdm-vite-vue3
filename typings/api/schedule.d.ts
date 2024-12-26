declare namespace Schedule {
  type TimePeriod = 'MORNING' | 'AFTERNOON' | 'DAY';

  type DoctorSchedule = {
    id: number;
    doctorId: number;
    doctor: Hospital.Doctor;
    weekday?: string;
    date: string;
    timePeriod: TimePeriod;
    status: number;
    createdTime: string;
    updatedTime: string;
  };
}
