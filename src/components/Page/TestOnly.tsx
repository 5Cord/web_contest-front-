import { Container, VStack, RadioGroup, Heading, Box, Span } from "@chakra-ui/react"
import { BoxMy, ButtonMy, Loading } from "../ui/CustomTag"
import { useChangeTime, useCheckAnswer, useGetQuestions } from "@/hooks/api"
import { useEffect, useRef, useState } from "react"
import { FaRegPlayCircle, FaRegStopCircle } from "react-icons/fa"
import type { Answer, AnswerRequest } from "@/hooks/api/types"

interface TestOnlyProps {
    timeOnlyTest: string
    timeOnlyFlag: boolean
    cookieStatus: string | undefined
}

export const TestOnly: React.FC<TestOnlyProps> = ({ timeOnlyTest, timeOnlyFlag, cookieStatus }) => {
    const { ChangeTime } = useChangeTime()
    const { CheckAnswer } = useCheckAnswer()
    const { question, GetQuestions } = useGetQuestions()
    const [answers, setAnswers] = useState<Answer[]>([])
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        GetQuestions()
    }, [])

    useEffect(() => {
        let timeTeamTestsplit: string[] = timeOnlyTest.split(":")
        let timeMinute: number = Number(timeTeamTestsplit[0])
        let timeSecond: number = Number(timeTeamTestsplit[1])

        if (!audioRef.current) return;

        if (timeMinute === 0 && timeSecond === 0 && timeOnlyFlag) {
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

        CheckAnswer(answerRequest)
    }

    if (!question) {
        return <Loading />
    }

    return (
        <Container padding={"20px"} paddingTop={"0px"} >
            <Box
                w={"100%"} display={"flex"}
                marginBottom={"10px"} alignItems={"center"}
                justifyContent={"center"} gap={"5"}
            >
                Время на выполнение: <BoxMy border={"none"} padding={"0"}>{timeOnlyTest}</BoxMy>
                {cookieStatus && cookieStatus === "teacher" &&
                    <Span cursor={"pointer"} onClick={() => ChangeTime("only")}>
                        {timeOnlyFlag ? <FaRegStopCircle size={"20px"} /> : <FaRegPlayCircle size={"20px"} />}
                    </Span>
                }
                <audio ref={audioRef} src="signal.mp3" />
            </Box>
            <Box w={"100%"} border={"1px solid #BFDBFE"} marginTop={"20px"}></Box>
            <BoxMy justifyContent={"left"} margin={"auto"} left={"0"} border={"none"}>
                {timeOnlyFlag && question.map((qst, i) => (
                    <Box key={qst.id}>
                        <RadioGroup.Root
                            value={answers.find(a => a.id === qst.id)?.answer || ""}
                            onValueChange={(value) => handleAnswerChange(qst.id, value.value)}
                        >
                            <Box display={"flex"} justifyContent={"space-between"}>
                                <Heading>Задача {i + 1}: {qst.question}</Heading>
                                <Span>BIMCOIN: {qst.socer}</Span>
                            </Box>
                            <VStack display={"flex"} marginTop={"10px"} alignItems={"flex-start"}>
                                {qst.answers.map((ans) => (
                                    <RadioGroup.Item display={"flex"} key={ans} value={ans} alignItems={"flex-start"}>
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>{ans}</RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                ))}
                            </VStack>
                        </RadioGroup.Root>
                        <Box w={"100%"} border={"1px solid #BFDBFE"} marginTop={"20px"}></Box>
                    </Box>
                ))}
            </BoxMy>
            {cookieStatus && cookieStatus === "student" &&
                <Box display={"flex"} marginTop={"20px"} justifyContent={"end"} w={"100%"}>
                    <ButtonMy onClick={() => handleSubmitAnswerChange()}>Отправить</ButtonMy>
                </Box>
            }
        </Container>
    )
}