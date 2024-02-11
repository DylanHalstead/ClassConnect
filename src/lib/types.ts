type Char<N extends number> = string & { length: N };

interface Course {
  id: string;
  department_code: Char<4>;
  course_code: Char<4>;
  course_name: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Section {
  id: string;
  course_id: string;
  section_number: number;
  max_daily_bookable_hours: number;
}

enum SectionMemberType {
  Instructor = 'instructor',
  TA = 'ta',
  Student = 'student',
}

interface SectionMember {
  id: string;
  section_id: string;
  user_id: string;
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
  id: string;
  instructional_member_id: string;
  week_day: WeekDay;
  // May want to make Time class/type which limits Date to remove epoch date
  start_time: Date;
  duration: string;
}

interface Appointment {
  id: string;
  appointment_day: Date;
  appointment_block: string;
  student_id: string;
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