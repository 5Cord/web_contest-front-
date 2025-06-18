import { toaster } from "@/components/ui/toaster"
import type { MessageResponse, AnswerRequest } from "./types"

export const useCheckAnswerTeam = () => {
    const CheckAnswerTeam = async (answer: AnswerRequest): Promise<void> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/check_answer/team", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(answer)
            })

            const data: MessageResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            toaster.success({
                title: "Отправка ответа команды",
                description: data.message
            })
        } catch (e: any) {
            toaster.error({
                title: "Отправка ответа команды",
                description: e.message
            })
        }
    }

    return { CheckAnswerTeam }
}
