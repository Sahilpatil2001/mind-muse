export type Gender = "Male" | "Female" | "";

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  gender: Gender;
}
