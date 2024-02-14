export interface Course {
  id: string;
  department_code: string;
  course_code: string;
  course_name: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Section {
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

export interface SectionMember {
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

export interface AppointmentBlock {
  id: string;
  instructional_member_id: string;
  week_day: WeekDay;
  // May want to make Time class/type which limits Date to remove epoch date
  start_time: Date;
  duration: string;
}

export interface Appointment {
  id: string;
  appointment_day: Date;
  appointment_block: string;
  student_id: string;
  cancelled: boolean;
  link: string;
}