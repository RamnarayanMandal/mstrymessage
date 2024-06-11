import {z} from 'zod'

export const usernameValidation = z
.string()
.min(2,"username must be at least 2 characters")
.max(20,"username must be at least 20 characters")
.regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters")