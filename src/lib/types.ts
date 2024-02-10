type Char<N extends number> = string & { length: N };

interface Course {
  id: string;
  departmentCode: Char<4>;
  courseCode: Char<4>;
  courseName: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Section {
  id: string;
  courseId: string;
  sectionNumber: number;
  maxDailyBookableHours: number;
}

enum SectionMemberType {
  Instructor = 'instructor',
  TA = 'ta',
  Student = 'student',
}

interface SectionMember {
  id: string;
  sectionId: string;
  userId: string;
  memberType: SectionMemberType;
  isRestricted: boolean;
}

enum WeekDay {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

interface AppointmentBlock {
  id: string;
  instructionalMemberId: string;
  weekDay: WeekDay;
  // May want to make Time class/type which limits Date to remove epoch date
  startTime: Date;
  duration: string;
}

interface Appointment {
  id: string;
  appointmentDay: Date;
  appointmentBlock: string;
  studentId: string;
  cancelled: boolean;
  link: string;
}

export type {
  Char,
  Course,
  User,
  Section,
  SectionMemberType,
  SectionMember,
  WeekDay,
  AppointmentBlock,
  Appointment,
};