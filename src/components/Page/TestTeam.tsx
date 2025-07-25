import { Container, Box, Button, Text } from "@chakra-ui/react"
import { Loading, TestAnswer } from "../ui/CustomTag"
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

        if (!audioRef.current) return;

        if (timeMinute < 1 && timeTeamFlag) {
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
        <Container
            bg="linear-gradient(180deg, #52227E 0%, #23173D 100%)"
            padding={"20px"} paddingTop={"0px"} borderRadius={"26px"}>
            <Box
                w={"100%"} display={"flex"}
                marginBottom={"10px"} alignItems={"center"}
                justifyContent={"center"} gap={"5"}
                pos="sticky" top="0" p={4} zIndex={"11"}
            >
                <Text
                    fontSize={"20px"} color={"white"}
                    onClick={() => {
                        if (cookieStatus && cookieStatus === "teacher") {
                            ChangeTime("team");
                        }
                    }}
                >
                    {timeTeamTest}
                </Text>
                <audio ref={audioRef} src="audio/signal.mp3" />
            </Box>
            <Box justifyContent={"left"} margin={"auto"} left={"0"} border={"none"}>
                {!questionsTeamMsg &&
                    <TestAnswer question={question} answers={answers} handleAnswerChange={handleAnswerChange} />
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