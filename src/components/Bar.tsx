import { Box, Text } from "@chakra-ui/react"
import { useChangeTime, useClearData, useExit, usePresentation, useRedactTime } from "@/hooks/api";
import type { UserData } from "@/hooks/ws/types";
import { useRef, useState } from "react";
import { Step } from "./Step";
import { LogoBIM, LogoDEE } from "./SVG";
import styles from './ui/Bar.module.css';
import { Presentation } from "@/components/Page/Presentation";

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
    timeLesson, timeOnly, timeTeam, cookieStatus,
    stageLesson, idPresentation, openPresentation, setOpenPresentation
}) => {
    const { Exit } = useExit()
    const { ChangeTime } = useChangeTime()
    const { RedactTime } = useRedactTime()
    const { RedactPresentation } = usePresentation()
    const { ClearData } = useClearData()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const newOnlyTime = useRef<HTMLInputElement>(null);
    const newTeamTime = useRef<HTMLInputElement>(null);
    const newIDPresentation = useRef<HTMLInputElement>(null);

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
    }

    const handleExitClick = () => {
        Exit();
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
                    {cookieStatus === "teacher" && <Text className={styles.menuItem} onClick={() => setIsSettingsOpen(true)}>
                        Настройки
                    </Text>
                    }
                    <Text className={styles.menuItem} onClick={handleExitClick}>
                        Выйти
                    </Text>
                </Box>

                <Box className={styles.headerRight}>
                    <Box
                        className={`${styles.timer} ${timeLesson === "00:00" ? styles.timerFinished : ''}`}
                        onClick={() => {
                            if (cookieStatus === "teacher") {
                                ChangeTime('lesson')
                            }
                        }
                        }
                    >
                        <Text className={styles.timerText}>
                            Таймер * {timeLesson ? timeLesson : "45:00"}
                        </Text>
                    </Box>
                </Box>
            </Box>

            <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />

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
