import { toaster } from "@/components/ui/toaster"
import { useState } from "react"
import type { GetQuestionsResponse, Questions } from "./types"
import { useNavigate } from "react-router-dom"

export const useGetQuestions = () => {
    const [question, setQuestions] = useState<Questions[]>([])
    const [questionsTeamMsg, setQuestionsTeamMsg] = useState<string>("")

    const navigate = useNavigate()

    const GetQuestions = async (path: string): Promise<GetQuestionsResponse | null> => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + path, {
                method: "GET",
                credentials: "include",
            })

            const data: GetQuestionsResponse = await response.json()

            if (!response.ok) {
                var newError = new Error(data.message) as any
                if (data.redirect) {
                    newError = new Error(data.redirect)
                }
                throw newError
            }

            return data
        } catch (e: any) {
            toaster.error({
                title: "Получение вопросов",
                description: e.message
            })
            if (e.redirect) {
                navigate(e.redirect)
            }
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
