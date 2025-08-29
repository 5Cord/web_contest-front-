import { Container, Box, Button, Text, VStack, Stack } from "@chakra-ui/react"
import { Loading } from "../ui/CustomTag"
import { useCheckAnswer, useGetQuestions } from "@/hooks/api" // import { useChangeTime, useCheckAnswer, useGetQuestions } from "@/hooks/api"
import { useEffect, useRef, useState } from "react"
import type { Answer, AnswerRequest, Questions } from "@/hooks/api/types"

interface TestTeamProps {
    timeTeamTest: string
    timeTeamFlag: boolean
    cookieStatus: string | undefined
}

interface Question {
    id: string
    text: string
    options: { value: string; text: string }[]
}

export const TestTeam: React.FC<TestTeamProps> = ({ timeTeamTest, timeTeamFlag, cookieStatus }) => {
    const { CheckAnswerTeam } = useCheckAnswer()
    const { GetQuestionsTeam, question } = useGetQuestions()
    const [answers, setAnswers] = useState<Answer[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const audioRef = useRef<HTMLAudioElement>(null)

    // Получаем командные вопросы
    useEffect(() => {
        console.log(cookieStatus)
        GetQuestionsTeam()
    }, [])

    // Маппим в формат для компонента
    useEffect(() => {
        if (question && question.length > 0) {
            const mapped: Question[] = question.map((q: Questions) => ({
                id: q.id,
                text: q.question,
                options: q.answers.map((ans, idx) => ({
                    value: String(idx + 1),
                    text: ans
                }))
            }))
            setQuestions(mapped)
        }
    }, [question])

    // Таймер и сигнал
    useEffect(() => {
        const [hours] = timeTeamTest.split(":").map(Number)
        if (!audioRef.current) return
        if (hours < 1 && timeTeamFlag) audioRef.current.play()
        else audioRef.current.pause()
    }, [timeTeamTest, timeTeamFlag])

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => {
            const filtered = prev.filter(a => a.id !== questionId)
            return [...filtered, { id: questionId, answer }]
        })
    }

    const handleSubmitAnswerChange = () => {
        if (answers.length < questions.length) {
            const confirmPartial = window.confirm(
                `Вы ответили только на ${answers.length} из ${questions.length} вопросов.\nВсе равно завершить тест?`
            )
            if (!confirmPartial) return
        } else {
            const confirmFull = window.confirm("Вы уверены, что хотите завершить тест и отправить ответы?")
            if (!confirmFull) return
        }

        const answerRequest: AnswerRequest = { answer: answers }
        CheckAnswerTeam(answerRequest)
        alert("Тест завершен! Ответы отправлены на проверку.")
    }

    const getAnswerForQuestion = (questionId: string) =>
        answers.find(a => a.id === questionId)?.answer || ""

    if (!questions.length) return <Loading />

    return (
        <Container width="100%" paddingInline={3} zIndex={'2'}>
            {/* Таймер */}
            <Box>
                <Text color="black" ml={3} fontWeight="bold">{timeTeamTest}</Text>
                <audio ref={audioRef} src="audio/signal.mp3" />
            </Box>

            {/* Вопросы */}
            <Box zIndex={0}>
                <VStack align="stretch" zIndex={0}>
                    {questions.map((q, index) => (
                        <Box
                            key={q.id}
                            color="#4775A6"
                            bg="#FFE4D7"
                            p={6}
                            mb={3}
                            borderRadius="25px"
                            border="1px solid"
                            borderColor="#4775A6"
                            position="relative"
                            overflow="hidden"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '20px',
                                background: '#FFC1A3',
                                borderTopLeftRadius: '15px',
                                borderTopRightRadius: '15px',
                                borderBottomLeftRadius: '2px',
                                borderBottomRightRadius: '2px',
                                transform: 'translateY(0%)',
                                zIndex: 1,
                            }}
                        >
                            <Box borderRadius="md">
                                <Text color="#4775A6" position="absolute" mt={1} right="3%" fontSize="lg" fontWeight="bold">
                                    {index + 1}/{questions.length}
                                </Text>
                            </Box>

                            <Text ml={2} fontWeight="semibold" mb={4} fontSize="30px">{q.text}</Text>

                            <Stack ml={2} mb={10}>
                                {q.options.map((option, optIndex) => (
                                    <label key={optIndex} style={{ fontSize: 20, display: "flex", alignItems: "center", cursor: "pointer" }}>
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            value={option.value}
                                            checked={getAnswerForQuestion(q.id) === option.value}
                                            onChange={() => handleAnswerChange(q.id, option.value)}
                                            style={{
                                                width: 20,
                                                height: 20,
                                                marginRight: 4,
                                                cursor: "pointer",
                                                accentColor: "#4775A6"
                                            }}
                                        />
                                        <span>{option.text}</span>
                                    </label>
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </VStack>
            </Box>

            {/* Кнопка завершения теста */}
            <Box display="flex" justifyContent="flex-end">
                <Button
                    onClick={handleSubmitAnswerChange}
                    borderRadius="16px"
                    px={16}
                    py={7}
                    fontSize="18px"
                    mt={3}
                    color="#4775A6"
                    bg="#FFE4D7"
                >
                    Завершить
                </Button>
            </Box>

            {/* Статус ответов */}
            <Box mb={4} textAlign="center">
                <Text fontSize="sm" opacity={0.7}>
                    Отвечено: {answers.length} из {questions.length} вопросов
                </Text>
            </Box>
        </Container>
    )
}
