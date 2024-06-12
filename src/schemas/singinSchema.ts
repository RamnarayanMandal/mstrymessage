import {z} from "zod"

export const singinSchema = z.object({
    indentifier:z.string(),
    password:z.string()
})