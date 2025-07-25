import { useEffect, useMemo, useState } from "react"
import { useGetTime, useGetTimeOnly, useGetTimeTeam, useGetUser, useStageLesson } from "@/hooks/ws"
import { Loading } from "./ui/CustomTag"
import { TestOnly, TestTeam, Users, Text, Presentation } from "./Page"
import { Box } from "@chakra-ui/react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Bar } from "./Bar"
import { usePresentation } from "@/hooks/api"

export const Content = () => {
    const [timeLesson, flagTimeLesson, errorTimeLesson] = useGetTime()
    const [users, errorUser] = useGetUser()
    const [stageLesson, error] = useStageLesson()
    const [timeOnlyTest, timeOnlyFlag, errorGetTimeOnly] = useGetTimeOnly()
    const [timeTeamTest, timeTeamFlag, errorGetTimeTeam] = useGetTimeTeam()
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
        if (error || errorUser || errorGetTimeOnly || errorGetTimeTeam) {
            return <Loading />;
        }

        if (openPresentation) {
            return <Presentation idPresentation={idPresentation} />
        }

        let cnt = <Loading />;
        switch (stage) {
            case "1":
                cnt = <Text>Организация</Text>;
                break;
            case "2":
                cnt = (
                    <Box>
                        <Box display={"flex"} gap={"20px"}>
                            {cookieStatus && cookieStatus === "teacher" && <Users users={users} />}
                            <TestOnly timeOnlyTest={timeOnlyTest} timeOnlyFlag={timeOnlyFlag} cookieStatus={cookieStatus} />
                        </Box>
                    </Box>
                );
                break;
            case "3":
                cnt = (
                    <Box>
                        <Box display={"flex"} gap={"20px"}>
                            {cookieStatus && cookieStatus === "teacher" && <Users users={users} />}
                            <TestTeam timeTeamTest={timeTeamTest} timeTeamFlag={timeTeamFlag} cookieStatus={cookieStatus} />
                        </Box>
                    </Box>
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
    }, [stage, users, timeOnlyTest, timeOnlyFlag,
        timeTeamTest, timeTeamFlag, error, errorUser, errorGetTimeOnly,
        errorGetTimeTeam, cookieStatus, openPresentation
    ])

    return (
        <Box minHeight="100vh" maxWidth="100%">
            <Bar
                timeLesson={timeLesson} timeOnly={timeOnlyTest}
                timeTeam={timeTeamTest} flagTimeLesson={flagTimeLesson}
                errorTimeLesson={errorTimeLesson} cookieStatus={cookieStatus}
                users={users} idPresentation={idPresentation} stageLesson={stageLesson}
                openPresentation={openPresentation} setOpenPresentation={setOpenPresentation}
            />
            <Box
                flexDirection="column" padding={"0 20px"}
                height="100vh" width="100%"
            >
                {content}
            </Box>
        </Box >
    )
}