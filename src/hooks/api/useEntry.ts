import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"
import type { EntryResponse } from "./types"

export const useEntry = () => {
    const navigate = useNavigate()

    const Entry = async (username: string, password: string, team: string): Promise<void> => {
        // ДЛЯ ФРОНТА
        // Вывод введённых данных
        console.log(username, password, team)
        // ДЛЯ ФРОНТА



        // if (username.length <= 0 || password.length <= 0 || !team) {
        //     return
        // }

        // if (username.toLowerCase() !== "учитель" && password.trim().length != 3) {
        //     toaster.error({
        //         title: "Вход",
        //         description: "Пароль должен содержать ровно 3 символа"
        //     })
        //     return
        // }

        // try {
        //     const response = await fetch(import.meta.env.VITE_URL_API + "/api/entry", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         credentials: "include",
        //         body: JSON.stringify({ username: username, password: password, team: team })
        //     })

        //     const data: EntryResponse = await response.json()

        //     if (!response.ok) {
        //         throw new Error(data.message)
        //     }

        //     toaster.success({
        //         title: "Вход",
        //         description: data.message
        //     })
        //     navigate(data.redirect)
        // } catch (e: any) {
        //     toaster.error({
        //         title: "Вход",
        //         description: e.message
        //     })
        // }
    }

    return { Entry }
}
