import { chatSchema } from "@/src/lib/zod";

export type ChatFormType = z.infer<typeof chatSchema>;