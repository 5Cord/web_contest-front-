import { Container, VStack, RadioGroup, Heading, Box, Span } from "@chakra-ui/react"
import { BoxMy, ButtonMy, Loading } from "../ui/CustomTag"
import { useChangeTime, useCheckAnswerTeam, useGetQuestionsTeam } from "@/hooks/api"
import { useEffect, useState } from "react"
import { FaRegPlayCircle, FaRegStopCircle } from "react-icons/fa"
import type { Answer, AnswerRequest } from "@/hooks/api/types"

interface TestTeamProps {
    timeTeamTest: string
    timeTeamFlag: boolean
    cookieStatus: string | undefined
}

export const TestTeam: React.FC<TestTeamProps> = ({ timeTeamTest, timeTeamFlag, cookieStatus }) => {
    const { CheckAnswerTeam } = useCheckAnswerTeam()
    const { ChangeTime } = useChangeTime()
    const { questionTeam, questionsTeamMsg, GetQuestionsTeam } = useGetQuestionsTeam()
    const [answers, setAnswers] = useState<Answer[]>([])

    useEffect(() => {
        GetQuestionsTeam()
    }, [])

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


    if (!questionTeam && !questionsTeamMsg) {
        return <Loading />
    }

    return (
        <Container padding={"20px"} paddingTop={"0px"} >
            <Box
                w={"100%"} display={"flex"}
                marginBottom={"10px"} alignItems={"center"}
                justifyContent={"center"} gap={"5"}
            >
                Время на выполнение: <BoxMy border={"none"} padding={"0"}>{timeTeamTest}</BoxMy>
                {cookieStatus && cookieStatus === "teacher" &&
                    <Span cursor={"pointer"} onClick={() => ChangeTime("team")}>
                        {timeTeamFlag ? <FaRegStopCircle size={"20px"} /> : <FaRegPlayCircle size={"20px"} />}
                    </Span>
                }
            </Box>
            <Box w={"100%"} border={"1px solid #BFDBFE"} marginTop={"20px"}></Box>
            <BoxMy justifyContent={"left"} margin={"auto"} left={"0"} border={"none"}>
                {timeTeamFlag && !questionsTeamMsg && questionTeam?.map((qst, i) => (
                    <>
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
                    </>
                ))}
                {!questionTeam && questionsTeamMsg && <>{questionsTeamMsg}</>}
            </BoxMy>
            {cookieStatus && cookieStatus === "student" &&
                <Box display={"flex"} marginTop={"20px"} justifyContent={"end"} w={"100%"}>
                    <ButtonMy onClick={() => handleSubmitAnswerChange()}>Отправить</ButtonMy>
                </Box>
            }
        </Container>
    )
}