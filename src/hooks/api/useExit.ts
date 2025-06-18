import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"
import type { ExitResponse } from "./types"

export const useExit = () => {
    const navigate = useNavigate()

    const Exit = async (): Promise<void> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/exit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })

            const data: ExitResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            toaster.success({
                title: "Выход",
                description: data.message
            })
            navigate(data.redirect)
        } catch (e: any) {
            toaster.error({
                title: "Выход",
                description: e.message
            })
        }
    }

    return { Exit }
}
