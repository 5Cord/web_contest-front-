import { useEffect, useState } from "react"
import type { UserData } from "./types"

export const useGetUser = (): [UserData[] | undefined, Error | null] => {
    const [data, setData] = useState<UserData[]>();
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const socket = new WebSocket(import.meta.env.VITE_URL_WS + `/ws/users`);

        socket.onopen = () => {
            setError(null);
        };

        socket.onmessage = (event) => {
            try {
                const users = JSON.parse(event.data) as UserData[];
                setData(users);
            } catch (err) {
                setError(new Error("Failed to parse user data"));
            }
        };

        socket.onerror = () => {
            setError(new Error("WebSocket error"));
        };

        socket.onclose = () => {
            setError(new Error("Disconnected from server"));
        };

        return () => {
            socket.close();
        };
    }, []);

    return [data, error];
};