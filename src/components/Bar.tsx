import { Box, Button, Field, Input } from "@chakra-ui/react"
import { useChangeTime, useClearData, useExit, usePresentation, useRedactTime } from "@/hooks/api";
import { LogoMasterCityBlackLineSVG } from "./SVG";
import { Users } from "./Page";
import type { UserData } from "@/hooks/ws/types";
import { DialogData, TimeBox } from "./ui/CustomTag";
import { useRef } from "react";

interface BarProps {
    timeLesson: string
    timeOnly: string
    timeTeam: string
    flagTimeLesson: boolean
    errorTimeLesson: Error | null
    cookieStatus: string | undefined
    users: UserData[] | undefined
    idPresentation: string
}

export const Bar: React.FC<BarProps> = ({ timeLesson, timeOnly, timeTeam, flagTimeLesson, errorTimeLesson, cookieStatus, users, idPresentation }) => {
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
            display={"flex"} flexDirection="column"
            background={"#F2F2F2"} width={"280px"}
            position="fixed" zIndex={"10"}
            borderTopRightRadius={"28px"}
            borderBottomEndRadius={"28px"}
            justifyContent="space-between"
            alignItems="center" minHeight="100vh" padding="20px"
        >
            <Box>
                <LogoMasterCityBlackLineSVG />
            </Box>

            <Box
                w={"100%"}
            >
                <TimeBox
                    flag={flagTimeLesson}
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
                </TimeBox>
                <DialogData
                    title="Статистика"
                    childrenBody={
                        <Box>
                            <Users users={users} />
                        </Box>
                    }
                />
                <DialogData
                    title="Презентация"
                    childrenBody={
                        <iframe
                            src={`https://docs.google.com/presentation/d/${idPresentation}/embed?rm=minimal&ui=0&slide=id.p1`}
                            width="100%"
                            height="100%"
                            allowFullScreen={false}
                        />
                    }
                    cover
                />
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
            <Button w={"100%"} borderRadius={"15px"} onClick={() => Exit()}>Выйти</Button>
        </Box >
    )
}