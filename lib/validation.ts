import {z} from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be at most 255 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const companyCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must be at most 255 characters"),
  subdomain: z
    .string()
    .min(2, "Subdomain must be at least 2 characters")
    .max(100, "Subdomain must be at most 100 characters")
    .regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers, and hyphens"),
});

export const messageSchema = z.object({
  conversationId: z.string().uuid("Invalid conversation ID"),
  content: z.string().min(1, "Message content cannot be empty").max(10000),
  type: z.enum(["text", "template", "media"]).default("text"),
  toPhoneNumber: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type CompanyCreateInput = z.infer<typeof companyCreateSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
