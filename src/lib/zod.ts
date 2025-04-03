"use client"

import { z } from "zod"

export const chatSchema = z.object({
  message: z.string().min(2).max(50),
})