import { Navigate, useNavigate } from "react-router-dom"
import { Box, Button, Input, Text } from "@chakra-ui/react"
import { useChangeTime, useClearData, useExit, usePresentation, useRedactTime } from "@/hooks/api";
import type { UserData } from "@/hooks/ws/types";
import { useRef, useState, useEffect } from "react";
import { Step } from "./Step";
import { LogoBIM, LogoDEE } from "./SVG";
import styles from './ui/Bar.module.css';
import { Presentation } from "./page/Presentation";

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
    timeLesson, timeOnly, timeTeam, errorTimeLesson, cookieStatus,
    stageLesson, idPresentation, openPresentation, setOpenPresentation
}) => {
    const navigate = useNavigate();
    const { Exit } = useExit()
    const { RedactTime } = useRedactTime()
    const { RedactPresentation } = usePresentation()
    const { ClearData } = useClearData()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [timer, setTimer] = useState(45 * 60); // 45 минут
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // отдельные обработчики
    const handleSavePresentation = () => {
        if (newIDPresentation.current?.value) {
            RedactPresentation(newIDPresentation.current.value);
        }
    };

    const handleSaveOnlyTime = () => {
        if (newOnlyTime.current?.value) {
            RedactTime("only", newOnlyTime.current.value);
        }
    };

    const handleSaveTeamTime = () => {
        if (newTeamTime.current?.value) {
            RedactTime("team", newTeamTime.current.value);
        }
    };

    const handlePresentationClick = () => {
        setOpenPresentation(true);
        setIsMobileMenuOpen(false);
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
                    <Text className={styles.menuItem} onClick={handlePresentationClick}>
                        Презентация
                    </Text>
                    <Text className={styles.menuItem} onClick={() => setIsSettingsOpen(true)}>
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

            <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />

            {/* модалка настроек */}
            {isSettingsOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsSettingsOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setIsSettingsOpen(false)}>×</button>
                        <h2>Настройки</h2>

                        <div className={styles.modalRow}>
                            <label>Презентация (id):</label>
                            <input ref={newIDPresentation} placeholder="ID презентации" defaultValue={idPresentation} />
                            <button onClick={handleSavePresentation}>Сохранить</button>
                        </div>

                        <div className={styles.modalRow}>
                            <label>Индив. тест:</label>
                            <input ref={newOnlyTime} placeholder="мм:сс" defaultValue={timeOnly} />
                            <button onClick={handleSaveOnlyTime}>Сохранить</button>
                        </div>

                        <div className={styles.modalRow}>
                            <label>Групп. тест:</label>
                            <input ref={newTeamTime} placeholder="мм:сс" defaultValue={timeTeam} />
                            <button onClick={handleSaveTeamTime}>Сохранить</button>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.resetBtn} onClick={ClearData}>Сбросить все данные</button>
                        </div>
                    </div>
                </div>
            )}

            {/* модалка презентации */}
            {openPresentation && (
                <div className={styles.modalOverlay} onClick={() => setOpenPresentation(false)}>
                    <div className={styles.modalPresentation} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setOpenPresentation(false)}>×</button>
                        <div className={styles.presentationContent}>
                            <Presentation idPresentation={idPresentation} />
                        </div>
                    </div>
                </div>
            )}


        </Box>
    )
}
