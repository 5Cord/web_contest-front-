import { toaster } from "@/components/ui/toaster"
import type { MessageResponse } from "./types"

export const useChangeTime = () => {
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
                throw new Error(data.message)
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
        }
    }

    return { ChangeTime }
}