import { z } from 'zod';

export const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().nonempty('Password is required'),
});


export type FormData = {
  fullName?: string;
  email: string;
  password: string;
};
