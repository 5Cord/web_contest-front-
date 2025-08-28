import { Navigate, useNavigate } from "react-router-dom"
import { Box, Button, Field, Input, Text } from "@chakra-ui/react"
import { useChangeTime, useClearData, useExit, usePresentation, useRedactTime } from "@/hooks/api";
import type { UserData } from "@/hooks/ws/types";
import { ButtonMy, DialogData } from "./ui/CustomTag";
import { useRef, useState, useEffect } from "react"; // Добавили useEffect
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

export const Bar: React.FC<BarProps> = ({ timeLesson, timeOnly, timeTeam, errorTimeLesson, cookieStatus, stageLesson, idPresentation, openPresentation, setOpenPresentation }) => {
    const navigate = useNavigate();
    const { Exit } = useExit()
    const { ChangeTime } = useChangeTime()
    const { RedactTime } = useRedactTime()
    const { RedactPresentation } = usePresentation()
    const { ClearData } = useClearData()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [timer, setTimer] = useState(45 * 60); // 45 минут в секундах
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const newOnlyTime = useRef<HTMLInputElement>(null);
    const newTeamTime = useRef<HTMLInputElement>(null);
    const newIDPresentation = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerRunning(false);
        }

        return () => clearInterval(interval);
    }, [isTimerRunning, timer]);

    // Форматирование времени в мм:сс
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
        RedactPresentation(newIDPresentation.current.value)
    }

    const handlePresentationClick = () => {
        setOpenPresentation(prev => !prev);
        setIsMobileMenuOpen(false);
        navigate("/Presentation");
    }

    const handleExitClick = () => {
        Exit();
        setIsMobileMenuOpen(false);
    }

    const handleTimerClick = () => {
        if (timer === 0) {
            setTimer(45 * 60);
        }
        setIsTimerRunning(!isTimerRunning);
        setIsMobileMenuOpen(false);
    }

    return (
        <Box className={styles.container}>
            <Box className={styles.header}>
                <Box className={styles.headerLeft}>
                    <LogoBIM width={"80px"} height={"auto"} />
                    <LogoDEE width={"80px"} height={"auto"} />
                    <Text
                        className={styles.menuItem}
                        onClick={handlePresentationClick}
                    >
                        Презентация
                    </Text>
                    <Text
                        className={styles.menuItem}
                        onClick={handleExitClick}
                    >
                        Настройки
                    </Text>
                    <Text
                        className={styles.menuItem}
                        onClick={handleExitClick}
                    >
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

                {/* Таймер */}



            </Box>

            <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />
        </Box>
    )
}