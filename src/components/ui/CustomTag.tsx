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
    flag: boolean
    question: Questions[]
    answers: Answer[]
    handleAnswerChange: (id: string, value: string | null) => void | undefined;
}

interface ButtonYellowProps extends BoxProps {
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
                <Box
                    color="#666363" margin="10px"
                    display="flex" justifyContent="center"
                    cursor="pointer" fontSize={"20px"}
                    paddingTop={"5px"} paddingBottom={"5px"}
                    borderRadius={"50px"} userSelect={"none"}
                    _hover={{ background: "#F5D700", color: "black" }}
                >
                    {title}
                </Box>
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

export const TestAnswer: React.FC<TestAnswerProps> = ({ flag, question, answers, handleAnswerChange }) => {
    return (
        <>
            {flag && question.map((qst, i) => (
                <Box key={qst.id}>
                    <RadioGroup.Root
                        userSelect={"none"}
                        value={answers.find(a => a.id === qst.id)?.answer || ""}
                        onValueChange={(value) => handleAnswerChange(qst.id, value.value)}
                    >
                        <Box display={"flex"} justifyContent={"space-between"}>
                            <Heading>Задача {i + 1}: {qst.question}</Heading>
                            <Span>BIMCOIN: {qst.socer}</Span>
                        </Box>
                        <VStack display={"flex"} marginTop={"10px"} alignItems={"flex-start"}>
                            {qst.answers.map((ans) => (
                                <RadioGroup.Item
                                    display="flex"
                                    key={ans}
                                    value={ans}
                                    alignItems="center"
                                    bg="gray.100"
                                    borderRadius="5px"
                                    p={2}
                                    _checked={{
                                        bg: "yellow.400",
                                    }}
                                >
                                    <RadioGroup.ItemHiddenInput />
                                    <RadioGroup.ItemIndicator
                                        borderRadius="5px"
                                        border="1px solid black"
                                        borderBottom="3px solid black"
                                        bg="white"
                                        _checked={{
                                            bg: "black",
                                            borderColor: "black",
                                            borderBottom: "3px solid black"
                                        }}
                                    />
                                    <RadioGroup.ItemText ml={2}>{ans}</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            ))}
                        </VStack>
                    </RadioGroup.Root>
                    <Box w={"100%"} border={"1px solid #F5D700"} marginTop={"20px"} marginBottom={"20px"}></Box>
                </Box>
            ))}
        </>
    )

}

export const ButtonYellow: React.FC<ButtonYellowProps> = ({ children, onClick, ...props }) => {
    return (
        <Box
            display="flex" alignItems="center"
            justifyContent="center" textAlign="center"
            backgroundColor={"#F5D700"} marginLeft={"25px"}
            border="1px solid black" borderBottom="4px solid black"
            userSelect={"none"} color="black"
            width="100%" height="40px" borderRadius="5px"
            onClick={onClick}
            {...props}
        >
            {children}
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