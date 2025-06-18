// Отправка изменения этапа урока 
export type ChangeLessonRequest = {
    step: "prev" | "next" 
}

// Сообщение
export type MessageResponse = {
    message: string
}

// Ответ пользователя
export type Answer = {
    id: string | null
    answer: string | null
}

// Отправка ответов на вопрос (одиночный)
export type AnswerRequest = {
    answer: Answer[]
}

// Запрос на вход
export type EntryResponse = {
    message: string
    redirect: string
}

// Запрос на выход
export type ExitResponse = {
    message: string
    redirect: string
}

// Вопросы
export type Questions = {
    id: string
    question: string
    answers: string[]
    socer: number
}

// Получение вопросов (одиночный)
export type GetQuestionsResponse = {
    message: string
    questions: Questions[]
}

// Получение вопросов (групповой)
export type GetQuestionsTeamResponse = {
    message: string
    questions: Questions[]
}