import type { Answer, Questions } from "@/hooks/api/types";
import { Box, Center, CloseButton, Dialog, Heading, Portal, RadioGroup, Span, Spinner, VStack, type BoxProps } from "@chakra-ui/react";
import type React from "react";

interface DialogProps {
    childrenBody?: React.ReactNode;
    childrenFooter?: React.ReactNode;
    children?: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    cover?: boolean
}

interface TimeBoxProps extends BoxProps {
    children?: React.ReactNode;
    flag: boolean;
    onClick: () => void;
}

interface TestAnswerProps extends BoxProps {
    question: Questions[]
    answers: Answer[]
    handleAnswerChange: (id: string, value: string | null) => void | undefined;
}

interface ButtonMyProps extends BoxProps {
    children: React.ReactNode
    onClick?: () => void
}

export const DialogData = ({
    childrenBody,
    childrenFooter,
    children,
    title,
    showCloseButton = true,
    cover = false
}: DialogProps) => {
    if (children) {
        return <div className="dialog-data">{children}</div>;
    }

    return (
        <Dialog.Root size={cover ? "cover" : "md"} scrollBehavior={!cover ? "inside" : undefined} placement={"center"} motionPreset="slide-in-bottom">
            <Dialog.Trigger asChild>
                <ButtonMy
                    fontSize={"15px"}
                >
                    {title}
                </ButtonMy>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title fontSize={"20px"}>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body >
                            {childrenBody}
                        </Dialog.Body>
                        {childrenFooter && (
                            <Dialog.Footer w="100%">
                                {childrenFooter}
                            </Dialog.Footer>
                        )}
                        {showCloseButton && (
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        )}
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

export const TimeBox: React.FC<TimeBoxProps> = ({ children, flag, onClick, ...props }) => {
    return (
        <Box
            background={flag ? "#F5D700" : "#fffff00"}
            border={flag ? "2px solid #ffffff00" : "2px solid #F5D700"}
            borderRadius="50px"
            paddingTop="5px"
            paddingBottom="5px"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="20px"
            cursor="pointer"
            onClick={onClick}
            {...props}
        >
            {children}
        </Box>
    );
};

export const TestAnswer: React.FC<TestAnswerProps> = ({ question, answers, handleAnswerChange }) => {
    return (
        <>
            {question.map((qst, i) => (
                <Box key={qst.id} color={"white"}>
                    <RadioGroup.Root
                        userSelect={"none"}
                        value={answers.find(a => a.id === qst.id)?.answer || ""}
                        onValueChange={(value) => handleAnswerChange(qst.id, value.value)}
                    >
                        <Box display={"flex"} justifyContent={"space-between"} margin={"20px"}>
                            <Heading fontSize={"20px"}>Задача {i + 1}: {qst.question}</Heading>
                            <Span fontSize={"20px"}>BIMCOIN: {qst.socer}</Span>
                        </Box>
                        <VStack display={"flex"} marginTop={"10px"} alignItems={"flex-start"}>
                            {qst.answers.map((ans) => (
                                <RadioGroup.Item key={ans} value={ans}>
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator _checked={{ backgroundColor: "white" }} />
                                    <RadioGroup.ItemText ml={2}>{ans}</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            ))}
                        </VStack>
                    </RadioGroup.Root>
                </Box>
            ))}
        </>
    )

}

export const ButtonMy: React.FC<ButtonMyProps> = ({ children, onClick, ...props }) => {
    return (
        <Box
            width={"fit-content"} paddingRight={"20px"} paddingLeft={'20px'}
            display="flex" alignItems="center"
            background={"var(--first-bg)"}
            justifyContent="center" textAlign="center"
            border="1px solid var(--border-color)"
            userSelect={"none"} color="var(--font-color)"
            height="40px" borderRadius="5px" fontWeight={"700"}
            onClick={onClick}
            {...props}
        >
            {typeof children === "string" ? children.toUpperCase() : children}
        </Box >
    )
}

export const Loading = () => {
    return (
        <Center
            margin={"auto"}
        >
            <Box>
                <Spinner size={"xl"} color={"#173DA6"} />
            </Box>
        </Center>
    )
}