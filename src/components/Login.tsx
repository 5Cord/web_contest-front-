import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEntry } from "@/hooks/api"
import { Box, Button, Center, Container, Field, Input } from "@chakra-ui/react"
import { PasswordInput } from "./ui/password-input"
import { LogoMasterCityBlackLineSVG, LogoMasterCityYellowSVG } from "./SVG"

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
        <Container paddingLeft={"100px"} maxW={"85%"} paddingRight={"100px"}>
            <Box width={"100%"} paddingTop={"20px"}>
                <LogoMasterCityBlackLineSVG />
            </Box>
            <Center width={"100%"} paddingTop={"20px"}>
                <Box
                    width={"100%"} display={"flex"}
                    background={"#F2F2F2"}
                    height={"auto"} padding={"50px"}
                    borderRadius={"40px"} justifyContent={"space-between"}
                >
                    <Box>
                        <Box
                            display={"inline-block"}
                            background={"#F5D700"} padding={"5px"}
                            paddingLeft={"40px"} paddingRight={"40px"}
                            borderRadius={"50px"}
                        >
                            ВХОД
                        </Box>
                        <Box marginTop={"40px"} display="flex" flexDirection="column" minHeight="400px">
                            <Box>
                                <Field.Root required>
                                    <Field.Label>ФИО<Field.RequiredIndicator color={"black"} /></Field.Label>
                                    <Input
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="ФИО" borderRadius={"15px"}
                                        padding={"20px"} paddingTop={"30px"}
                                        paddingBottom={"30px"} border={"1px solid black"}
                                        w={"500px"}
                                        _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                    />
                                </Field.Root>
                                <Field.Root required marginTop={"20px"}>
                                    <Field.Label>Пароль<Field.RequiredIndicator color={"black"} /></Field.Label>
                                    <PasswordInput
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Пароль" borderRadius={"15px"}
                                        padding={"20px"} paddingTop={"30px"}
                                        paddingBottom={"30px"} border={"1px solid black"}
                                        w={"500px"}
                                        _focus={{ outline: "none", border: "1px solid #F5D700" }}
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
                        <LogoMasterCityYellowSVG />
                    </Box>
                </Box>
            </Center>
        </Container >
    )
} 