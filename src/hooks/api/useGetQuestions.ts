import { toaster } from "@/components/ui/toaster"
import { useState } from "react"
import type { GetQuestionsResponse, Questions } from "./types"

export const useGetQuestions = () => {
    const [question, setQuestions] = useState<Questions[]>([])
    const [questionsTeamMsg, setQuestionsTeamMsg] = useState<string>("")

    const GetQuestions = async (path: string): Promise<GetQuestionsResponse | null> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + path, {
                method: "GET",
                credentials: "include",
            })

            const data: GetQuestionsResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            return data
        } catch (e: any) {
            toaster.error({
                title: "Получение вопросов",
                description: e.message
            })
            return null
        }
    }

    const GetQuestionsOnly = async () => {
        const data: GetQuestionsResponse | null = await GetQuestions("/api/questions");
        if (data) {
            setQuestions(data.questions)
        }
    }

    const GetQuestionsTeam = async () => {
        const data: GetQuestionsResponse | null = await GetQuestions("/api/questions/team");
        if (data) {
            setQuestions(data?.questions)
            setQuestionsTeamMsg(data?.message)
        }
    }

    return { question, questionsTeamMsg, GetQuestionsOnly, GetQuestionsTeam }
}
