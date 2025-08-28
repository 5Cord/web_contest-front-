import { toaster } from "@/components/ui/toaster"
import { useState } from "react"
import type { GetQuestionsResponse, Questions } from "./types"
import { useNavigate } from "react-router-dom"

export const useGetQuestions = () => {
    const [question, setQuestions] = useState<Questions[]>([])
    const [questionsTeamMsg, setQuestionsTeamMsg] = useState<string>("")

    const navigate = useNavigate()

    // const GetQuestions = async (path: string): Promise<GetQuestionsResponse | null> => {
    //     try {
    //         const response = await fetch(import.meta.env.VITE_URL_API + path, {
    //             method: "GET",
    //             credentials: "include",
    //         })

    //         const data: GetQuestionsResponse = await response.json()

    //         if (!response.ok) {
    //             var newError = new Error(data.message) as any
    //             if (data.redirect) {
    //                 newError = new Error(data.redirect)
    //             }
    //             throw newError
    //         }

    //         return data
    //     } catch (e: any) {
    //         toaster.error({
    //             title: "Получение вопросов",
    //             description: e.message
    //         })
    //         if (e.redirect) {
    //             navigate(e.redirect)
    //         }
    //         return null
    //     }
    // }

    const GetQuestionsOnly = async () => {
        // ДЛЯ ФРОНТА
        // const data: GetQuestionsResponse | null = await GetQuestions("/api/questions");
        const data: GetQuestionsResponse | null = {
            message: "",
            questions: {
                Questions_1: {
                    id: "Questions_1",
                    question: "Пара объектов «Стены – Стены» общее количество геометрических коллизий в соответствии с матрицей пересечений:",
                    answers: [
                        "0",
                        "2",
                        "3",
                        "5",
                        "6"
                    ],
                    socer: 5
                },
                Questions_2: {
                    id: "Questions_2",
                    question: "Пара объектов «Стены – Воздуховоды» общее количество геометрических коллизий в соответствии с матрицей пересечений:",
                    answers: [
                        "0",
                        "2",
                        "3",
                        "5",
                        "6"
                    ],
                    socer: 10
                }
            }
        };
        if (data && data.questions) {
            const questionsArray = Object.values(data.questions);
            setQuestions(questionsArray);
        }
        // ДЛЯ ФРОНТА
    }

const GetQuestionsTeam = async () => {
    // ДЛЯ ФРОНТА
    const data: GetQuestionsResponse | null = {
        message: "Вопросы командного теста",
        questions: {
            Questions_1: {
                id: "Questions_1",
                question: "Командная задача: Пара объектов «Стены – Стены» общее количество геометрических коллизий:",
                answers: ["0", "2", "3", "5", "6"],
                socer: 5
            },
            Questions_2: {
                id: "Questions_2",
                question: "Командная задача: Пара объектов «Стены – Воздуховоды» общее количество геометрических коллизий:",
                answers: ["0", "2", "3", "5", "6"],
                socer: 10
            }
        }
    }

    if (data && data.questions) {
        const questionsArray = Object.values(data.questions);
        setQuestions(questionsArray);
        setQuestionsTeamMsg(data.message);
    }
    // ДЛЯ ФРОНТА
}


    return { question, questionsTeamMsg, GetQuestionsOnly, GetQuestionsTeam }
}
