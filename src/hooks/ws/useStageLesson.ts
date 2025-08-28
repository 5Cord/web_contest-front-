import { useEffect, useState } from "react"
import type { StageLesson } from "./types";

export const useStageLesson = (): [number, Error | null] => {
    const [stageLesson, setStageLesson] = useState<number>(0)
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // ДЛЯ ФРОНТА
        setStageLesson(5)
        setError(new Error("ERROR"))
        // ДЛЯ ФРОНТА


        // const socket = new WebSocket(import.meta.env.VITE_URL_WS + "/ws/lesson")

        // socket.onopen = () => {
        //     setError(null)
        // }

        // socket.onmessage = (event) => {
        //     try {
        //         const data = JSON.parse(event.data) as StageLesson
        //         setStageLesson(data.lesson)
        //     } catch (e) {
        //         setError(new Error("Failed to parse user data"));
        //     }
        // }

        // socket.onerror = () => {
        //     setError(new Error("WebSocket error"));
        // };

        // socket.onclose = () => {
        //     setError(new Error("Disconnected from server"));
        // };

        // return () => {
        //     socket.close();
        // };
    }, [])

    return [stageLesson, error]
}