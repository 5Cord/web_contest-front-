import { toaster } from "@/components/ui/toaster"
import type { MessageResponse } from "./types"
import { useNavigate } from "react-router-dom"

export const useRedactTime = () => {
    const navigate = useNavigate()

    const RedactTime = async (change: "only" | "team", new_time: string): Promise<void> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/time/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ change_time: change, new_time: new_time })
            })

            const data: MessageResponse = await response.json()

            if (!response.ok) {
                var newError = new Error(data.message) as any
                if (data.redirect) {
                    newError = new Error(data.redirect)
                }
                throw newError
            }

            toaster.success({
                title: "Изменение времени",
                description: data.message
            })
        } catch (e: any) {
            toaster.error({
                title: "Изменение времени",
                description: e.message
            })
            if (e.redirect) {
                navigate(e.redirect)
            }
        }
    }

    return { RedactTime }
}