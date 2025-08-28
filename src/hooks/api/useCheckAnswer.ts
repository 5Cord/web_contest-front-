import { toaster } from "@/components/ui/toaster"
import type { MessageResponse, AnswerRequest } from "./types"
import { useNavigate } from "react-router-dom"

export const useCheckAnswer = () => {
    const navigate = useNavigate()

    const CheckAnswer = async (answer: AnswerRequest, path: string, title: string): Promise<void> => {
        // ДЛЯ ФРОНТА
        // Формат который должен выводиться
        // [{
        //      "id": "Questions_1",
        //      "answer": "2"
        // },
        // {
        //      "id": "Questions_2",
        //      "answer": "5"
        // }]
        console.log(answer)
        // ДЛЯ ФРОНТА



        // try {
        //     const response = await fetch(import.meta.env.VITE_URL_API + path, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         credentials: "include",
        //         body: JSON.stringify(answer)
        //     })

        //     const data: MessageResponse = await response.json()

        //     if (!response.ok) {
        //         var newError = new Error(data.message) as any
        //         if (data.redirect) {
        //             newError = new Error(data.redirect)
        //         }
        //         throw newError
        //     }

        //     toaster.success({
        //         title: title,
        //         description: data.message
        //     })
        // } catch (e: any) {
        //     toaster.error({
        //         title: title,
        //         description: e.message
        //     })
        //     if (e.redirect) {
        //         navigate(e.redirect)
        //     }
        // }
    }

    const CheckAnswerOnly = async (answer: AnswerRequest) => {
        CheckAnswer(answer, "/api/answer", "Отправка ответа")
    }

    const CheckAnswerTeam = async (answer: AnswerRequest) => {
        CheckAnswer(answer, "/api/answer/team", "Отправка ответа команды")
    }

    return { CheckAnswerOnly, CheckAnswerTeam }
}