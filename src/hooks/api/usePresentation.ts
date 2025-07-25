import { useEffect, useState } from "react"
import type { GetPresentationResponse, MessageResponse } from "./types"
import { toaster } from "@/components/ui/toaster"
import { useNavigate } from "react-router-dom"

export const usePresentation = () => {
    const [idPresentation, setIdPresentation] = useState<string>("")

    const navigate = useNavigate()

    useEffect(() => {
        GetPresentation()
    }, [])

    const GetPresentation = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/presentation", {
                method: "GET",
                credentials: "include",
            })

            const data: GetPresentationResponse = await response.json()

            if (!response.ok) {
                var newError = new Error(data.message) as any
                if (data.redirect) {
                    newError = new Error(data.redirect)
                }
                throw newError
            }

            setIdPresentation(data.id)
        } catch (e: any) {
            window.location.reload()
            if (e.redirect) {
                navigate(e.redirect)
            }
        }
    }

    const RedactPresentation = async (id: string) => {
        try {
            const response = await fetch(import.meta.env.VITE_URL_API + "/api/presentation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ id: id })
            })

            const data: MessageResponse = await response.json()

            if (!response.ok) {
                var newError = new Error(data.message) as any
                if (data.redirect) {
                    newError = new Error(data.redirect)
                }
                throw newError
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
            if (e.redirect) {
                navigate(e.redirect)
            }
        }
    }

    return { idPresentation, RedactPresentation }
}