import { useEffect, useMemo, useState } from "react"
import { useGetTime, useGetTimeOnly, useGetTimeTeam, useGetUser, useStageLesson } from "@/hooks/ws"
import { Loading } from "./ui/CustomTag"
import { TestOnly, TestTeam, Users, Text } from "./Page"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Bar } from "./Bar"
import { usePresentation } from "@/hooks/api"
import styles from "./ui/Content.module.css"

export const Content = () => {
    const [timeLesson, flagTimeLesson, errorTimeLesson] = useGetTime()
    const [users] = useGetUser()
    const [stageLesson] = useStageLesson()
    const [timeOnlyTest, timeOnlyFlag] = useGetTimeOnly()
    const [timeTeamTest, timeTeamFlag] = useGetTimeTeam()
    const { idPresentation } = usePresentation()

    const [searchParams] = useSearchParams();

    const [cookieSession] = useState(document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1].toLowerCase())
    const [cookieStatus] = useState(document.cookie.split('; ').find(row => row.startsWith('status='))?.split('=')[1].toLowerCase())
    const [openPresentation, setOpenPresentation] = useState<boolean>(false)
    const stage = searchParams.get('stage');


    const navigate = useNavigate()

    useEffect(() => {
        if ((!cookieStatus && !cookieSession) || (cookieStatus === "" && cookieSession === "")) {
            navigate("/")
        }
    }, [cookieStatus, cookieSession, navigate])

    const content = useMemo(() => {
        // if (error || errorUser || errorGetTimeOnly || errorGetTimeTeam) {
        //     return <Loading />;
        // }

        // if (openPresentation) {
        //     return <Presentation idPresentation={idPresentation} />
        // }

        let cnt = <Loading />;
        switch (stage) {
            case "1":
                cnt = <Text>Организация</Text>;
                break;
            case "2":
                cnt = (
                    <div className={styles.stage2Container}>
                        <div className={styles.stage2Content}>
                            {/* {cookieStatus && cookieStatus === "teacher" && <Users users={users} />} */}
                            <TestOnly timeOnlyTest={timeOnlyTest} timeOnlyFlag={timeOnlyFlag} cookieStatus={cookieStatus} />
                        </div>
                    </div>
                );
                break;
            case "3":
                cnt = (
                    <div className={styles.stage3Container}>
                        <div className={styles.stage3Content}>
                            {/* {cookieStatus && cookieStatus === "teacher" && <Users users={users} />} */}
                            <TestTeam timeTeamTest={timeTeamTest} timeTeamFlag={timeTeamFlag} cookieStatus={cookieStatus} />
                        </div>
                    </div>
                );
                break;
            case "4":
                cnt = <Users users={users} />;
                break;
            case "5":
                cnt = <Text>Результат</Text>;
                break;
        }
        return cnt;
    }, [stage, users, timeOnlyTest, timeOnlyFlag, timeTeamTest, timeTeamFlag, cookieStatus])

    return (
        <div className={styles.container}>
            <Bar
                timeLesson={timeLesson} timeOnly={timeOnlyTest}
                timeTeam={timeTeamTest} flagTimeLesson={flagTimeLesson}
                errorTimeLesson={errorTimeLesson} cookieStatus={cookieStatus}
                users={users} idPresentation={idPresentation} stageLesson={stageLesson}
                openPresentation={openPresentation} setOpenPresentation={setOpenPresentation}
            />
            <div className={styles.content}>
                {content}
            </div>
        </div>
    )
}