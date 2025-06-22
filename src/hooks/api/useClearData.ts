import { toaster } from "@/components/ui/toaster"
import type { MessageResponse } from "./types"
import { useNavigate } from "react-router-dom"

export const useClearData = () => {
    const navigate = useNavigate()

    const ClearData = async (): Promise<void> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/clear", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
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
                title: "Очистка данных",
                description: data.message
            })
        } catch (e: any) {
            toaster.error({
                title: "Очистка данных",
                description: e.message
            })
            if (e.redirect) {
                navigate(e.redirect)
            }
        }
    }

    return { ClearData }
}