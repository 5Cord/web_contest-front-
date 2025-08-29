import { toaster } from "@/components/ui/toaster"
import type { ChangeLessonRequest, MessageResponse } from "./types"
import { useNavigate } from "react-router-dom"

export const useChangeLesson = () => {
    const navigate = useNavigate()

    const ChangeLesson = async (step: ChangeLessonRequest): Promise<void> => {
        // ДЛЯ ФРОНТА
        // Принимает число
        // Просто вывод числа
        console.log(step) 
        // ДЛЯ ФРОНТА


        
        // try {
        //     const response = await fetch(import.meta.env.VITE_URL_API + "/api/lesson", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         credentials: "include",
        //         body: JSON.stringify({ action: step.step })
        //     })

        //     const data: MessageResponse = await response.json()

        //     if (!response.ok) {
        //         const newError = new Error(data.message) as any
        //         if (data.redirect) {
        //             newError.redirect = data.redirect
        //         }
        //         throw newError
        //     }

        //     toaster.success({
        //         title: "Смена этапа",
        //         description: data.message
        //     })
        // } catch (e: any) {
        //     toaster.error({
        //         title: "Смена этапа",
        //         description: e.message
        //     })
        //     if (e.redirect) {
        //         navigate(e.redirect)
        //     } else {
        //         window.location.reload()
        //     }
        // }
    }

    return { ChangeLesson }
}