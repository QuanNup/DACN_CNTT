'use server'
import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("EmailPassword", {
            email: username,
            password: password,
            //callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        if ((error as any).name === "InvalidPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }
        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        } else if ((error as any).name === "InvalidEmailError") {
            return {
                error: (error as any).type,
                code: 3
            }
        } else {
            return {
                error: "Internal server error",
                code: 0
            }
        }

    }
}