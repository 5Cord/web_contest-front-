import { Container, Box, Button, Text } from "@chakra-ui/react"
import { Loading, TestAnswer } from "../ui/CustomTag"
import { useChangeTime, useCheckAnswer, useGetQuestions } from "@/hooks/api"
import { useEffect, useRef, useState } from "react"
import type { Answer, AnswerRequest } from "@/hooks/api/types"

interface TestOnlyProps {
    timeOnlyTest: string
    timeOnlyFlag: boolean
    cookieStatus: string | undefined
}

export const TestOnly: React.FC<TestOnlyProps> = ({ timeOnlyTest, timeOnlyFlag, cookieStatus }) => {
    const { ChangeTime } = useChangeTime()
    const { CheckAnswerOnly } = useCheckAnswer()
    const { question, GetQuestionsOnly } = useGetQuestions()
    const [answers, setAnswers] = useState<Answer[]>([])
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        GetQuestionsOnly()
    }, [])

    useEffect(() => {
        let timeTeamTestsplit: string[] = timeOnlyTest?.split(":")
        let timeMinute: number = Number(timeTeamTestsplit[0])

        if (!audioRef.current) return;

        if (timeMinute < 1 && timeOnlyFlag) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [timeOnlyTest, timeOnlyFlag])

    const handleAnswerChange = (questionId: string, answer: string | null) => {
        setAnswers(prev => {
            const filtered = prev.filter(a => a.id !== questionId)
            return [...filtered, { id: questionId, answer: answer }]
        })
    }

    const handleSubmitAnswerChange = () => {
        const answerRequest: AnswerRequest = {
            answer: answers
        }

        CheckAnswerOnly(answerRequest)
    }

    if (!question) {
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
                            ChangeTime("only");
                        }
                    }}
                >
                    {timeOnlyTest}
                </Text>
                <audio ref={audioRef} src="audio/signal.mp3" />
            </Box>
            <Box justifyContent={"left"} margin={"auto"} left={"0"} border={"none"}>
                <TestAnswer question={question} answers={answers} handleAnswerChange={handleAnswerChange} />
            </Box>
            {timeOnlyFlag && cookieStatus && cookieStatus === "student" &&
                <Box display={"flex"} marginTop={"20px"} w={"100%"}>
                    <Button onClick={() => handleSubmitAnswerChange()} borderRadius={"15px"} w={"100%"}>Отправить</Button>
                </Box>
            }
        </Container>
    )
}