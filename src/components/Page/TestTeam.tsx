import { Container, Box, Span, Button } from "@chakra-ui/react"
import { Loading, TestAnswer, TimeBox } from "../ui/CustomTag"
import { useChangeTime, useCheckAnswer, useGetQuestions } from "@/hooks/api"
import { useEffect, useRef, useState } from "react"
import type { Answer, AnswerRequest } from "@/hooks/api/types"

interface TestTeamProps {
    timeTeamTest: string
    timeTeamFlag: boolean
    cookieStatus: string | undefined
}

export const TestTeam: React.FC<TestTeamProps> = ({ timeTeamTest, timeTeamFlag, cookieStatus }) => {
    const { CheckAnswerTeam } = useCheckAnswer()
    const { ChangeTime } = useChangeTime()
    const { question, questionsTeamMsg, GetQuestionsTeam } = useGetQuestions()
    const [answers, setAnswers] = useState<Answer[]>([])
    const audioRef = useRef<HTMLAudioElement>(null);


    useEffect(() => {
        GetQuestionsTeam()
    }, [])

    useEffect(() => {
        let timeTeamTestsplit: string[] = timeTeamTest.split(":")
        let timeMinute: number = Number(timeTeamTestsplit[0])
        let timeSecond: number = Number(timeTeamTestsplit[1])

        if (!audioRef.current) return;

        if (timeMinute === 0 && timeSecond === 0 && timeTeamFlag) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [timeTeamTest, timeTeamFlag])

    const handleAnswerChange = (questionId: string, answer: string | null) => {
        setAnswers(prev => {
            const filtered = prev.filter(a => a.id !== questionId)
            return [...filtered, { id: questionId, answer: answer }]
        })
    }

    const handleSubmitAnswerChange = () => {
        const AnswerRequest: AnswerRequest = {
            answer: answers
        }

        CheckAnswerTeam(AnswerRequest)
    }


    if (!question && !questionsTeamMsg) {
        return <Loading />
    }

    return (
        <Container padding={"20px"} paddingTop={"0px"} >
            <Box
                w={"100%"} display={"flex"}
                marginBottom={"10px"} alignItems={"center"}
                justifyContent={"center"} gap={"5"}
                pos="sticky" top="0" p={4} zIndex={"11"}
            >
                <Span fontSize={"30px"}>
                    Тест
                </Span>
                <TimeBox
                    flag={timeTeamFlag} fontSize={"15px"}
                    width={"70px"} height={"30px"}
                    onClick={() => {
                        if (cookieStatus && cookieStatus === "teacher") {
                            ChangeTime("team");
                        }
                    }}
                >
                    {timeTeamTest}
                </TimeBox>
                <audio ref={audioRef} src="audio/signal.mp3" />
            </Box>
            <Box justifyContent={"left"} margin={"auto"} left={"0"} border={"none"}>
                {!questionsTeamMsg &&
                    <TestAnswer flag={timeTeamFlag} question={question} answers={answers} handleAnswerChange={handleAnswerChange} />
                }
                {!question && questionsTeamMsg &&
                    <Box display={"flex"} justifyContent={"center"}>
                        {questionsTeamMsg}
                    </Box>
                }
            </Box>
            {timeTeamFlag && cookieStatus && cookieStatus === "student" &&
                <Box display={"flex"} marginTop={"20px"} w={"100%"}>
                    <Button onClick={() => handleSubmitAnswerChange()} borderRadius={"15px"} w={"100%"}>Отправить</Button>
                </Box>
            }
        </Container>
    )
}