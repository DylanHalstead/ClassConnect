import { v4 } from 'uuid'

type UUID = typeof v4;

type Char<N extends number> = string & { length: N };

interface Course {
  id: UUID;
  department_code: Char<4>;
  course_code: Char<4>;
  course_name: string;
}

interface User {
  id: UUID;
  email: string;
  first_name: string;
  last_name: string;
}

interface Section {
  id: UUID;
  course_id: UUID;
  section_number: number;
  max_daily_bookable_hours: number;
}

enum SectionMemberType {
  Instructor = 'instructor',
  TA = 'ta',
  Student = 'student',
}

interface SectionMember {
  id: UUID;
  section_id: UUID;
  user_id: UUID;
  member_type: SectionMemberType;
  is_restricted: boolean;
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
  id: UUID;
  instructional_member_id: UUID;
  week_day: WeekDay;
  // May want to make Time class/type which limits Date to remove epoch date
  start_time: Date;
  duration: string;
}

interface Appointment {
  id: UUID;
  appointment_day: Date;
  appointment_block: UUID;
  student_id: UUID;
  cancelled: boolean;
  link: string;
}

export type {
  UUID,
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
