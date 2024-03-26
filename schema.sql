CREATE TABLE IF NOT EXISTS courses (
	id UUID PRIMARY KEY,
	department_code CHAR(4) NOT NULL,
	course_code CHAR(4) NOT NULL,
	course_name VARCHAR(255) NOT NULL,
	UNIQUE (department_code, course_code)
);

CREATE TABLE IF NOT EXISTS users (
	id UUID PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS sections (
	id UUID PRIMARY KEY,
	course_id UUID NOT NULL REFERENCES courses(id),
	section_number SMALLINT NOT NULL,
	max_daily_bookable_hours FLOAT NOT NULL DEFAULT 'INFINITY',
	UNIQUE (course_id, section_number)
);

DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'section_member_type') THEN
		CREATE TYPE section_member_type AS ENUM ('instructor', 'ta', 'student');
	END IF;
END
$$;

CREATE TABLE IF NOT EXISTS section_members (
	id UUID PRIMARY KEY,
	section_id UUID NOT NULL REFERENCES sections(id),
	user_id UUID NOT NULL REFERENCES users(id),
	member_type section_member_type NOT NULL,
	is_restricted BOOLEAN NOT NULL DEFAULT FALSE,
	UNIQUE (section_id, user_id)
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'week_day') THEN
		CREATE TYPE week_day AS ENUM
			('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS appointment_blocks (
	id UUID PRIMARY KEY,
	instructional_member_id UUID NOT NULL REFERENCES section_members(id),
	week_day week_day NOT NULL,
	start_time TIME WITH TIME ZONE NOT NULL,
	duration INTERVAL NOT NULL
);

CREATE TABLE IF NOT EXISTS appointments (
	id UUID PRIMARY KEY,
	appointment_day DATE NOT NULL,
	appointment_block UUID NOT NULL REFERENCES appointment_blocks(id),
	student_id UUID NOT NULL REFERENCES section_members(id),
	cancelled BOOLEAN NOT NULL DEFAULT FALSE,
	link VARCHAR(255) NOT NULL,
	UNIQUE (appointment_day, appointment_block)
);

CREATE TABLE IF NOT EXISTS initialized (
	initialized BOOLEAN PRIMARY KEY CHECK (initialized) DEFAULT TRUE
);
