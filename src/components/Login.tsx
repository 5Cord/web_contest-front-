import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEntry } from "@/hooks/api"
import { Box, Button, Center, Container, Field, Input } from "@chakra-ui/react"
import { PasswordInput } from "./ui/password-input"
import { LogoBIM, LogoDEE } from "./SVG"

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
        <Container paddingLeft={"100px"} maxW={"85%"} paddingRight={"100px"}
            maxWidth={"fit-content"}
        >
            <Box width={"100%"} paddingTop={"20px"}>
                <LogoBIM width={"90px"} height={"auto"} />
            </Box>
            <Center width={"100%"} paddingTop={"20px"}>
                <Box
                    width={"100%"} display={"flex"}
                    background={"var(--second-bg)"}
                    height={"auto"} padding={"50px"}
                    borderRadius={"40px"} justifyContent={"space-between"}
                >
                    <Box>
                        <Box
                            display={"inline-block"}
                            background={"var(--third-bg)"} padding={"5px"}
                            paddingLeft={"40px"} paddingRight={"40px"}
                            border={"1px solid var(--border-color)"}
                            fontWeight={"700"}
                            borderRadius={"50px"} color={"var(--font-color)"}
                        >
                            ВХОД
                        </Box>
                        <Box marginTop={"40px"} marginRight={"60px"} display="flex" flexDirection="column" minHeight="400px">
                            <Box >
                                <Field.Root required>
                                    <Field.Label fontWeight={"700"} >ФИ<Field.RequiredIndicator color={"black"} /></Field.Label>
                                    <Input
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="ФИ" borderRadius={"15px"}
                                        padding={"20px"} paddingTop={"30px"}
                                        paddingBottom={"30px"} border={"1px solid black"}
                                        w={"500px"}
                                        _focus={{ outline: "none", border: "1px solid var(--border-color)" }}
                                    />
                                </Field.Root>
                                <Field.Root required marginTop={"20px"}>
                                    <Field.Label fontWeight={"700"} >Пароль<Field.RequiredIndicator color={"black"} /></Field.Label>
                                    <PasswordInput
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Пароль" borderRadius={"15px"}
                                        padding={"20px"} paddingTop={"30px"}
                                        paddingBottom={"30px"} border={"1px solid black"}
                                        w={"500px"}
                                        _focus={{ outline: "none", border: "1px solid var(--border-color)" }}
                                    />
                                </Field.Root>
                            </Box>
                            <Box marginTop="auto" w={"100%"}>
                                <Button
                                    onClick={() => Entry(username, password)}
                                    w={"100%"} borderRadius={"15px"}
                                    padding={"20px"} paddingTop={"30px"}
                                    paddingBottom={"30px"}
                                >
                                    Отправить
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <LogoDEE />
                    </Box>
                </Box>
            </Center>
        </Container >
    )
} 