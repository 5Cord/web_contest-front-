import { toaster } from "@/components/ui/toaster"
import { useState } from "react"
import type { GetQuestionsResponse, Questions } from "./types"

export const useGetQuestions = () => {
    const [question, setQuestions] = useState<Questions[]>([])

    const GetQuestions = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/questions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })

            const data: GetQuestionsResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            setQuestions(data.questions)
        } catch (e: any) {
            toaster.error({
                title: "Получение вопросов",
                description: e.message
            })
        }
    }

    return { question, GetQuestions }
}
