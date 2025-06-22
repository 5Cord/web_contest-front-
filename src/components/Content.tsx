import { useEffect, useMemo, useState } from "react"
import { useGetTime, useGetTimeOnly, useGetTimeTeam, useGetUser, useStageLesson } from "@/hooks/ws"
import { ButtonYellow, Loading } from "./ui/CustomTag"
import { TestOnly, TestTeam, Users, Text, Presentation } from "./Page"
import { Box, Container } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { Step } from './Step'
import { Bar } from "./Bar"
import { usePresentation } from "@/hooks/api"

export const Content = () => {
    const [timeLesson, flagTimeLesson, errorTimeLesson] = useGetTime()
    const [users, errorUser] = useGetUser()
    const [stageLesson, error] = useStageLesson()
    const [timeOnlyTest, timeOnlyFlag, errorGetTimeOnly] = useGetTimeOnly()
    const [timeTeamTest, timeTeamFlag, errorGetTimeTeam] = useGetTimeTeam()
    const { idPresentation } = usePresentation()

    const [cookieSession] = useState(document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1].toLowerCase())
    const [cookieStatus] = useState(document.cookie.split('; ').find(row => row.startsWith('status='))?.split('=')[1].toLowerCase())
    const [openPresentation, setOpenPresentation] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        if ((!cookieStatus && !cookieSession) || (cookieStatus === "" && cookieSession === "")) {
            navigate("/")
        }
    }, [cookieStatus, cookieSession, navigate])

    const content = useMemo(() => {
        if (error || errorUser || errorGetTimeOnly || errorGetTimeTeam) {
            return <Loading />;
        }

        if (openPresentation) {
            return <Presentation idPresentation={idPresentation} />
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
                    <Box padding={"20px"} margin={0} w={"100%"} paddingTop={"0px"}>
                        <Box display={"flex"}>
                            {cookieStatus && cookieStatus === "teacher" && <Users users={users} />}
                            <TestOnly timeOnlyTest={timeOnlyTest} timeOnlyFlag={timeOnlyFlag} cookieStatus={cookieStatus} />
                        </Box>
                    </Box>
                );
                break;
            case 5:
                cnt = (
                    <Box padding={"20px"} paddingTop={"0px"}>
                        <Box display={"flex"}>
                            {cookieStatus && cookieStatus === "teacher" && <Users users={users} />}
                            <TestTeam timeTeamTest={timeTeamTest} timeTeamFlag={timeTeamFlag} cookieStatus={cookieStatus} />
                        </Box>
                    </Box>
                );
                break;
            case 6:
                cnt = <Text>Решение</Text>;
                break;
            case 7:
                cnt = <Users users={users} />;
                break;
        }
        return cnt;
    }, [stageLesson, users, timeOnlyTest, timeOnlyFlag,
        timeTeamTest, timeTeamFlag, error, errorUser, errorGetTimeOnly,
        errorGetTimeTeam, cookieStatus, openPresentation
    ])

    return (
        <Container
            display="flex" minHeight="100vh"
            maxWidth="100%" padding="0"
            margin="0" width="100%"
        >
            <Box>
                <Bar
                    timeLesson={timeLesson} timeOnly={timeOnlyTest}
                    timeTeam={timeTeamTest} flagTimeLesson={flagTimeLesson}
                    errorTimeLesson={errorTimeLesson} cookieStatus={cookieStatus}
                    users={users} idPresentation={idPresentation}
                />
            </Box>
            <Box
                flex="1" display="flex"
                flexDirection="column"
                padding="20px" paddingLeft={"300px"}
                height="100vh"
                width="100%" margin="0 auto"
            >
                <Step stageLesson={stageLesson} cookieStatus={cookieStatus} />
                {cookieStatus && cookieStatus === "teacher" &&
                    <ButtonYellow
                        width={"150px"} marginLeft={"25px"}
                        onClick={() => setOpenPresentation(!openPresentation)}
                    >
                        Презентация
                    </ButtonYellow>
                }
                {content}
            </Box>
        </Container >
    )
}