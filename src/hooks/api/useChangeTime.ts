import { toaster } from "@/components/ui/toaster"
import type { MessageResponse } from "./types"
import { useNavigate } from "react-router-dom"

export const useChangeTime = () => {
    const navigate = useNavigate()

    const ChangeTime = async (change: "lesson" | "only" | "team"): Promise<void> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/change_time", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ change_time: change })
            })

            const data: MessageResponse = await response.json()

            if (!response.ok) {
                const newError = new Error(data.message) as any
                if (data.redirect) {
                    newError.redirect = data.redirect
                }
                throw newError
            }

            toaster.success({
                title: "Смена времени",
                description: data.message
            })
        } catch (e: any) {
            toaster.error({
                title: "Смена времени",
                description: e.message
            })
            if (e.redirect) {
                navigate(e.redirect)
            }
        }
    }

    return { ChangeTime }
}