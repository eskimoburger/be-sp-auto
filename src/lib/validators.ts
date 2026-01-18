import { z } from "@hono/zod-openapi";

export const LoginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
});

export const CreateEmployeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "staff", "technician"]).default("staff"),
    phone: z.string().optional()
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial()
    .omit({ username: true, password: true })
    .extend({
        password: z.string().min(6).optional() // Password update is optional and separate concern usually, but allow for now
    });

export const IdParmaSchema = z.object({
    id: z
        .string()
        .transform((v) => parseInt(v, 10))
        .refine((v) => !isNaN(v), { message: "Invalid ID" })
});
