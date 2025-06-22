import { useEffect, useState } from "react"
import type { TimeData } from "./types"

export const useGetTime = (): [string, boolean, Error | null] => {
    const [timeLesson, setTimeLesson] = useState<string>("")
    const [timeFlag, setTimeFlag] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_URL_WS + "/ws/time_lesson")

        socket.onopen = () => {
            setError(null)
        }

        socket.onmessage = (event) => {
            try {
                const time = JSON.parse(event.data) as TimeData
                setTimeLesson(time.time)
                setTimeFlag(time.flag)
            } catch (e) {
                setError(new Error("Failed to parse user data"))
            }
        }

        socket.onerror = () => {
            setError(new Error("WebSocket error"));
        }

        socket.onclose = () => {
            setError(new Error("Disconnected from server"));
        };

        return () => {
            socket.close();
        };
    }, [])

    return [timeLesson, timeFlag, error]
}