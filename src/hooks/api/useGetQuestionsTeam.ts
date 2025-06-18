import { toaster } from "@/components/ui/toaster"
import { useState } from "react"
import type { GetQuestionsTeamResponse, Questions } from "./types"

export const useGetQuestionsTeam = () => {
    const [questionTeam, setQuestionsTeam] = useState<Questions[]>([])
    const [questionsTeamMsg, setQuestionsTeamMsg] = useState<string>("")

    const GetQuestionsTeam = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/questions/team", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })

            const data: GetQuestionsTeamResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            setQuestionsTeam(data?.questions)
            setQuestionsTeamMsg(data?.message)
        } catch (e: any) {
            toaster.error({
                title: "Получение вопросов",
                description: e.message
            })
        }
    }

    return { questionTeam, questionsTeamMsg, GetQuestionsTeam }
}