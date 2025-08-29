import { Container, Box, Button, Text, VStack, Stack } from "@chakra-ui/react"
import { Loading } from "../ui/CustomTag"
import { useChangeTime, useCheckAnswer, useGetQuestions } from "@/hooks/api"
import { useEffect, useRef, useState } from "react"
import type { Answer, AnswerRequest, Questions } from "@/hooks/api/types"

interface TestOnlyProps {
    timeOnlyTest: string
    timeOnlyFlag: boolean
    cookieStatus: string | undefined
}

interface Question {
    id: string
    text: string
    options: { value: string; text: string }[]
}

export const TestOnly: React.FC<TestOnlyProps> = ({ timeOnlyTest, timeOnlyFlag, cookieStatus }) => {
    const { ChangeTime } = useChangeTime()
    const { CheckAnswerOnly } = useCheckAnswer()
    const { question, GetQuestionsOnly } = useGetQuestions()
    const [answers, setAnswers] = useState<Answer[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        GetQuestionsOnly()
    }, [])

    useEffect(() => {
        if (question && question.length > 0) {
            const mapped: Question[] = question.map((q: Questions) => ({
                id: q.id,
                text: q.question,
                options: q.answers.map((ans, idx) => ({
                    value: String(idx + 1), // или String(idx), если хотите с 0
                    text: ans
                }))
            }))
            setQuestions(mapped)
        }
    }, [question])


    useEffect(() => {
        let timeOnlySplit: string[] = timeOnlyTest.split(":")
        let timeMinute: number = Number(timeOnlySplit[0])

        if (!audioRef.current) return;

        if (timeMinute < 1 && timeOnlyFlag) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [timeOnlyTest, timeOnlyFlag])

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers(prev => {
            const filtered = prev.filter(a => a.id !== questionId)
            return [...filtered, { id: questionId, answer: answer }]
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
        CheckAnswerOnly(answerRequest)
        alert("Тест завершен! Ответы отправлены на проверку.")
    }

    const getAnswerForQuestion = (questionId: string) =>
        answers.find(a => a.id === questionId)?.answer || ""

    if (!questions.length) {
        return <Loading />
    }

    return (
        <Container width={'100%'} paddingInline={3} zIndex={0} position={"relative"}>
            {/* Таймер */}
            <Box zIndex={0}>
                <Text color={"black"} ml={3} fontWeight="bold">
                    {timeOnlyTest}
                </Text>
                <audio ref={audioRef} src="audio/signal.mp3" />
            </Box>

            <Box>
                <VStack spacing={7} align="stretch" zIndex={0}>
                    {questions.map((q, index) => (
                        <Box
                            color={'#4775A6'}
                            key={q.id}
                            bg="#FFE4D7"
                            p={6}
                            mb={3}
                            borderRadius={'25px'}
                            border="1px solid"
                            borderColor="#4775A6"
                            position="relative"
                            overflow={'hidden'}
                            _before={{
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '0%',
                                right: '0%',
                                height: '20px',
                                background: '#FFC1A3',
                                borderTopLeftRadius: '15px',
                                borderTopRightRadius: '15px',
                                borderBottomLeftRadius: '2px',
                                borderBottomRightRadius: '2px',
                                transform: 'translateY(0%)',
                                zIndex: 0,
                            }}
                        >
                            {/* Номер вопроса */}
                            <Box borderRadius="md">
                                <Text color={'#4775A6'} position={'absolute'} mt={1} right={'3%'} fontSize="lg" fontWeight="bold">
                                    {index + 1}/{questions.length}
                                </Text>
                            </Box>

                            {/* Текст вопроса */}
                            <Text ml={2} fontWeight="semibold" mb={4} fontSize={'30px'} paddingRight={20}>
                                {q.text}
                            </Text>

                            {/* Варианты ответов */}
                            <Stack ml={2} spacing={3} mb={10}>
                                {q.options.map((option, optIndex) => (
                                    <label
                                        key={optIndex}
                                        style={{
                                            fontSize: '20px',
                                            display: "flex",
                                            alignItems: "center",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${q.id}`}
                                            value={option.value}
                                            checked={getAnswerForQuestion(q.id) === option.value}
                                            onChange={() => handleAnswerChange(q.id, option.value)}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                marginRight: '4px',
                                                cursor: 'pointer',
                                                accentColor: '#4775A6'
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
            {questions.length > 0 && (
                <Box display={'flex'} justifyContent={'flex-end'}>
                    <Button
                        onClick={handleSubmitAnswerChange}
                        borderRadius={"16px"}
                        px={16}
                        py={7}
                        fontSize="18px"
                        mt={3}
                        color={'#4775A6'}
                        bg={'#FFE4D7'}
                    >
                        Завершить
                    </Button>
                </Box>
            )}

            {/* Статус ответов */}
            <Box mb={4} textAlign="center">
                <Text fontSize="sm" opacity={0.7}>
                    Отвечено: {answers.length} из {questions.length} вопросов
                </Text>
            </Box>
        </Container>
    )
}
