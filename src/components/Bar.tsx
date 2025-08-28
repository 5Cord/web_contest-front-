import { Box, Button, Field, Input, Text } from "@chakra-ui/react"
import { useChangeTime, useClearData, useExit, usePresentation, useRedactTime } from "@/hooks/api";
import type { UserData } from "@/hooks/ws/types";
import { ButtonMy, DialogData } from "./ui/CustomTag";
import { useRef, useState, useEffect } from "react";
import { Step } from "./Step";
import { LogoBIM, LogoDEE } from "./SVG";
import styles from './ui/Bar.module.css';

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

export const Bar: React.FC<BarProps> = ({
    timeLesson, timeOnly, timeTeam, errorTimeLesson, cookieStatus, stageLesson,
    idPresentation, openPresentation, setOpenPresentation
}) => {
    const { Exit } = useExit()
    const { ChangeTime } = useChangeTime()
    const { RedactTime } = useRedactTime()
    const { RedactPresentation } = usePresentation()
    const { ClearData } = useClearData()

    const newOnlyTime = useRef<HTMLInputElement>(null);
    const newTeamTime = useRef<HTMLInputElement>(null);
    const newIDPresentation = useRef<HTMLInputElement>(null);

    const [timer, setTimer] = useState(45 * 60); // 45 минут в секундах
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }

        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

    const handlePresentationClick = () => {
        setOpenPresentation(!openPresentation);
    }

    const handleExitClick = () => {
        Exit();
    }

    const handleTimerClick = () => {
        if (timer === 0) setTimer(45 * 60);
        setIsTimerRunning(!isTimerRunning);
    }

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Box className={styles.headerLeft}>
                    <LogoBIM width={"80px"} height={"auto"} />
                    <LogoDEE width={"80px"} height={"auto"} />
                    <Text className={styles.menuItem} onClick={handlePresentationClick}>
                        Презентация
                    </Text>
                    <Text className={styles.menuItem} onClick={() => ChangeTime("lesson")}>
                        Настройки
                    </Text>
                    <Text className={styles.menuItem} onClick={handleExitClick}>
                        Выйти
                    </Text>
                </Box>

                <Box className={styles.headerRight}>
                    <Box
                        className={`${styles.timer} ${isTimerRunning ? styles.timerRunning : ''} ${timer === 0 ? styles.timerFinished : ''}`}
                        onClick={handleTimerClick}
                    >
                        <Text className={styles.timerText}>
                            Таймер * {formatTime(timer)}
                        </Text>
                    </Box>
                </Box>
            </Box>

            {cookieStatus === "teacher" && openPresentation &&
                <DialogData
                    title="Настройка"
                    childrenBody={
                        <>
                            <Field.Root>
                                <Field.Label>Презентации</Field.Label>
                                <Box display="flex" w="100%" gap={1}>
                                    <Input
                                        ref={newIDPresentation}
                                        defaultValue={idPresentation}
                                        flex={1} w="66%"
                                        placeholder="ID"
                                        borderRadius="10px"
                                        border="1px solid black"
                                        _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                    />
                                    <Button borderRadius="15px" w="33%" onClick={handlerPresentation}>Сохранить</Button>
                                </Box>
                            </Field.Root>

                            <Field.Root marginTop="10px">
                                <Field.Label>Индив. тест</Field.Label>
                                <Box display="flex" w="100%" gap={1}>
                                    <Input
                                        ref={newOnlyTime}
                                        defaultValue={timeOnly}
                                        flex={1} w="66%"
                                        placeholder="Время"
                                        borderRadius="10px"
                                        border="1px solid black"
                                        _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                    />
                                    <Button borderRadius="15px" w="33%" onClick={() => handlerTime("only")}>Сохранить</Button>
                                </Box>
                            </Field.Root>

                            <Field.Root marginTop="10px">
                                <Field.Label>Групп. тест</Field.Label>
                                <Box display="flex" w="100%" gap={1}>
                                    <Input
                                        ref={newTeamTime}
                                        defaultValue={timeTeam}
                                        flex={1} w="66%"
                                        placeholder="Время"
                                        borderRadius="10px"
                                        border="1px solid black"
                                        _focus={{ outline: "none", border: "1px solid #F5D700" }}
                                    />
                                    <Button borderRadius="15px" w="33%" onClick={() => handlerTime("team")}>Сохранить</Button>
                                </Box>
                            </Field.Root>
                        </>
                    }
                    childrenFooter={
                        <Button borderRadius="15px" w="100%" _hover={{ background: "red" }} onClick={ClearData}>
                            Сбросить все данные (Включая студентов)
                        </Button>
                    }
                />
            }

            <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />
        </Box>
    )
}
