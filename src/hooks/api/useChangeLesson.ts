import { toaster } from "@/components/ui/toaster"
import type { ChangeLessonRequest, MessageResponse } from "./types"

export const useChangeLesson = () => {
    const ChangeLesson = async (step: ChangeLessonRequest): Promise<void> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/change_lesson", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ action: step.step })
            })

            const data: MessageResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            toaster.success({
                title: "Смена этапа",
                description: data.message
            })
        } catch (e: any) {
            toaster.error({
                title: "Смена этапа",
                description: e.message
            })
        }
    }

    return { ChangeLesson }
}