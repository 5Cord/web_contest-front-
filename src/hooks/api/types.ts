// Отправка изменения этапа урока 
export type ChangeLessonRequest = {
    step: number
}

// Сообщение
export type MessageResponse = {
    message: string
    redirect?: string
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

// Получение вопросов
export interface GetQuestionsResponse extends MessageResponse {
    questions: {
        [key: string]: Questions;
    };
}

export interface GetPresentationResponse extends MessageResponse {
    id: string
}