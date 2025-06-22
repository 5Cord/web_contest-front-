import { useEffect, useState } from "react"
import type { GetPresentationResponse, MessageResponse } from "./types"
import { toaster } from "@/components/ui/toaster"

export const usePresentation = () => {
    const [idPresentation, setIdPresentation] = useState<string>("")

    useEffect(() => {
        GetPresentation()
    }, [])

    const GetPresentation = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/get_presentation", {
                method: "GET",
                credentials: "include",
            })

            const data: GetPresentationResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            setIdPresentation(data.id)
        } catch (e: any) {
            console.log(e.message)
            window.location.reload()
        }
    }

    const RedactPresentation = async (id: string) => {
        console.log(id)
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/redact_presentation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ id: id })
            })

            const data: MessageResponse = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            toaster.success({
                title: "Отпрака ID презентации",
                description: data.message
            })
        } catch (e: any) {
            toaster.error({
                title: "Отпрака ID презентации",
                description: e.message
            })
        }
    }

    return { idPresentation, RedactPresentation }
}