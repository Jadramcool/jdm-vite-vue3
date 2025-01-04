declare namespace Schedule {
  type TimePeriod = 'MORNING' | 'AFTERNOON' | 'DAY';

  type DoctorSchedule = {
    id: number;
    doctorId: number;
    doctor: Hospital.Doctor;
    date: string;
    timePeriod: TimePeriod;
    status: number;
    appointCount: number; // 挂号人数
    maxCount: number; // 最大挂号人数
    createdTime: string;
    updatedTime: string;
  };
}
