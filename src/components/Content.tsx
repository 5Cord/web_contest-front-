import { useGetTime, useGetTimeOnly, useGetTimeTeam, useGetUser, useStageLesson } from "@/hooks/ws"
import { useEffect, useMemo, useState } from "react"
import { Loading } from "./ui/CustomTag"
import { TestOnly } from "./Page/TestOnly"
import { Text } from "./Page/Text"
import { Box, Container } from "@chakra-ui/react"
import { Users } from "./Page/Users"
import { TestTeam } from "./Page/TestTeam"
import { Step } from './Step'
import { Bar } from "./Bar"
import { useNavigate } from "react-router-dom"

export const Content = () => {
    const [timeLesson, flagTimeLesson, _, errorTimeLesson] = useGetTime()
    const [users, errorUser] = useGetUser()
    const [stageLesson, error] = useStageLesson()
    const [timeOnlyTest, timeOnlyFlag, errorGetTimeOnly] = useGetTimeOnly()
    const [timeTeamTest, timeTeamFlag, errorGetTimeTeam] = useGetTimeTeam()

    const [cookieSession] = useState(document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1].toLowerCase())
    const [cookieStatus] = useState(document.cookie.split('; ').find(row => row.startsWith('status='))?.split('=')[1].toLowerCase())

    const navigate = useNavigate()

    useEffect(() => {
        if (!cookieStatus && !cookieSession) {
            navigate("/")
        }
    }, [cookieStatus, cookieSession, navigate])

    const content = useMemo(() => {
        if (error || errorUser || errorGetTimeOnly || errorGetTimeTeam) {
            return <Loading />;
        }

        let cnt = <Loading />;
        switch (stageLesson) {
            case 1:
                cnt = <Text>Организация</Text>;
                break;
            case 2:
                cnt = <Text>Мотивация</Text>;
                break;
            case 3:
                cnt = <Text>Новый знания</Text>;
                break;
            case 4:
                cnt = (
                    <Container padding={"20px"} paddingTop={"0px"}>
                        <Box display={"flex"}>
                            {cookieStatus && cookieStatus === "teacher" && <Users users={users} />}
                            <TestOnly timeOnlyTest={timeOnlyTest} timeOnlyFlag={timeOnlyFlag} cookieStatus={cookieStatus} />
                        </Box>
                    </Container>
                );
                break;
            case 5:
                cnt = (
                    <Container padding={"20px"} paddingTop={"0px"}>
                        <Box display={"flex"}>
                            {cookieStatus && cookieStatus === "teacher" && <Users users={users} />}
                            <TestTeam timeTeamTest={timeTeamTest} timeTeamFlag={timeTeamFlag} cookieStatus={cookieStatus} />
                        </Box>
                    </Container>
                );
                break;
            case 6:
                cnt = <Users users={users} />;
                break;
            case 7:
                cnt = <Text>Решение</Text>;
                break;
            case 8:
                cnt = <Text>Конец</Text>;
                break;
        }
        return cnt;
    }, [stageLesson, users, timeOnlyTest, timeOnlyFlag, timeTeamTest, timeTeamFlag, error, errorUser, errorGetTimeOnly, errorGetTimeTeam, cookieStatus])

    return (
        <>
            <Bar timeLesson={timeLesson} flagTimeLesson={flagTimeLesson} errorTimeLesson={errorTimeLesson} cookieStatus={cookieStatus} />
            <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />
            {content}
        </>
    )
}