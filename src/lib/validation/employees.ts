import { z } from "zod";

export const inviteEmployeeSchema = z.object({
	email: z.string().email(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	position: z.string().optional(),
	role: z.enum(["admin", "user"]),
});

export type InviteEmployeeInput = z.infer<typeof inviteEmployeeSchema>;


