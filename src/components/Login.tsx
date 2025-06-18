import { Center, Input } from "@chakra-ui/react"
import { BoxMy, ButtonMy } from "./ui/CustomTag"
import { PasswordInput } from "./ui/password-input"
import { useEntry } from "@/hooks/api"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const { Entry } = useEntry()
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [cookieSession] = useState(document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1].toLowerCase())
    const [cookieStatus] = useState(document.cookie.split('; ').find(row => row.startsWith('status='))?.split('=')[1].toLowerCase())
    const navigate = useNavigate()

    useEffect(() => {
        if (cookieStatus || cookieSession) {
            navigate("/lesson")
        }
    }, [])


    return (
        <Center width={"100%"} height={"100vh"} margin={"auto"}>
            <BoxMy>
                <Input
                    marginBottom={"10px"} marginTop={"10px"} placeholder="Логин"
                    _focus={{ outline: "none", border: "2px solid #173DA6" }}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <PasswordInput
                    marginBottom={"10px"} marginTop={"10px"} placeholder="Пароль"
                    _focus={{ outline: "none", border: "2px solid #173DA6" }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <ButtonMy
                    marginBottom={"10px"} marginTop={"10px"} w={"100%"}
                    onClick={() => Entry(username, password)}
                >
                    Войти
                </ButtonMy>
            </BoxMy>
        </Center>
    )
} 