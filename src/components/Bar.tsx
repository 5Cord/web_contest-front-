import { Box, Button, Field, Input, Text } from "@chakra-ui/react"
import { useChangeTime, useClearData, useExit, usePresentation, useRedactTime } from "@/hooks/api";
import type { UserData } from "@/hooks/ws/types";
import { ButtonMy, DialogData } from "./ui/CustomTag";
import { useRef } from "react";
import { Step } from "./Step";
import { LogoBIM, LogoDEE } from "./SVG";

interface BarProps {
    timeLesson: string
    timeOnly: string
    timeTeam: string
    flagTimeLesson: boolean
    errorTimeLesson: Error | null
    cookieStatus: string | undefined
    users: UserData[] | undefined
    idPresentation: string
    openPresentation: boolean
    setOpenPresentation: React.Dispatch<React.SetStateAction<boolean>>
    stageLesson: number
}

export const Bar: React.FC<BarProps> = ({ timeLesson, timeOnly, timeTeam, errorTimeLesson, cookieStatus, stageLesson, idPresentation, openPresentation, setOpenPresentation }) => {
    const { Exit } = useExit()
    const { ChangeTime } = useChangeTime()
    const { RedactTime } = useRedactTime()
    const { RedactPresentation } = usePresentation()
    const { ClearData } = useClearData()

    const newOnlyTime = useRef<HTMLInputElement>(null);
    const newTeamTime = useRef<HTMLInputElement>(null);
    const newIDPresentation = useRef<HTMLInputElement>(null);

    const handlerTime = (time: "only" | "team") => {
        if (time === "only" && newOnlyTime.current) {
            RedactTime(time, newOnlyTime.current.value);
        } else if (newTeamTime.current) {
            RedactTime(time, newTeamTime.current.value);
        }
    };

    const handlerPresentation = () => {
        if (newIDPresentation.current) {
            RedactPresentation(newIDPresentation.current.value)
        }
    }

    return (
        <Box
            background="var(--second-bg)" w={"100%"} padding="20px 0"
        >
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} padding={"0 20px"}>
                <Box display={"flex"} gap={"20px"} alignItems={"center"}>
                    <Box
                        width="calc(20px * 3)"
                        height="20px"
                        flexShrink={0}
                    />
                    <LogoBIM width={"80px"} height={"auto"} />
                </Box>
                <Box display={"flex"} gap={"20px"} alignItems={"center"}>
                    <LogoDEE width={"80px"} height={"auto"} />
                    <Text
                        fontSize={"20px"}
                        color={"var(--font-color)"}
                        fontWeight={"700"}
                        onClick={() => {
                            if (cookieStatus && cookieStatus === "teacher") {
                                ChangeTime("lesson");
                            }
                        }}
                    >
                        {!timeLesson ?
                            (errorTimeLesson == null ? "45:00" : errorTimeLesson.message)
                            : timeLesson
                        }
                    </Text>
                </Box>
            </Box>

            <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />

            <Box display={"flex"} justifyContent={"space-between"} padding={"0 20px"}>
                <Box display={"flex"} gap={"20px"}>
                    <ButtonMy
                        fontSize={"15px"}
                        onClick={() => setOpenPresentation(!openPresentation)}
                    >
                        Презентация
                    </ButtonMy>
                    {cookieStatus && cookieStatus === "teacher" &&
                        <DialogData
                            title="Настройка"
                            childrenBody={
                                <>
                                    <Field.Root>
                                        <Field.Label>
                                            Презентации
                                        </Field.Label>
                                        <Box display={"flex"} w={"100%"} gap={1}>
                                            <Input
                                                ref={newIDPresentation}
                                                defaultValue={idPresentation}
                                                flex={1} w={"66%"}
                                                placeholder="ID"
                                                borderRadius="10px"
                                                border="1px solid black"
                                                _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                            />
                                            <Button borderRadius={"15px"} w="33%" onClick={handlerPresentation}>Сохранить</Button>
                                        </Box>
                                    </Field.Root>
                                    <Field.Root marginTop={"10px"}>
                                        <Field.Label>
                                            Индив. тест
                                        </Field.Label>
                                        <Box display={"flex"} w={"100%"} gap={1}>
                                            <Input
                                                ref={newOnlyTime}
                                                defaultValue={timeOnly}
                                                flex={1} w={"66%"}
                                                placeholder="ID"
                                                borderRadius="10px"
                                                border="1px solid black"
                                                _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                            />
                                            <Button borderRadius={"15px"} w="33%" onClick={() => handlerTime("only")}>Сохранить</Button>
                                        </Box>
                                    </Field.Root>
                                    <Field.Root marginTop={"10px"}>
                                        <Field.Label>
                                            Групп. тест
                                        </Field.Label>
                                        <Box display={"flex"} w={"100%"} gap={1}>
                                            <Input
                                                ref={newTeamTime}
                                                defaultValue={timeTeam}
                                                flex={1} w={"66%"}
                                                placeholder="ID"
                                                borderRadius="10px"
                                                border="1px solid black"
                                                _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                            />
                                            <Button borderRadius={"15px"} w="33%" onClick={() => handlerTime("team")}>Сохранить</Button>
                                        </Box>
                                    </Field.Root>
                                </>
                            }
                            childrenFooter={
                                <Button
                                    borderRadius={"15px"} w="100%"
                                    _hover={{ background: "red" }}
                                    onClick={ClearData}
                                >
                                    Сбросить все данные (Включая студентов)
                                </Button>
                            }
                        />
                    }
                </Box>
                <ButtonMy onClick={() => Exit()}
                    fontSize={"15px"}
                >Выйти</ButtonMy>
            </Box>
        </Box >
    )
}