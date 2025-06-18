import { Box, Button, Center, Spinner } from "@chakra-ui/react";
import type { BoxProps, ButtonProps } from "@chakra-ui/react"; // Явный импорт типа

interface ButtonMyProps extends ButtonProps {
    children?: string
}

interface BoxMyProps extends BoxProps {
    children?: any
}

export const ButtonMy = ({ children, ...props }: ButtonMyProps) => {
    return (
        <Button
            backgroundColor={"white"}
            color={"#173DA6"}
            border={"2px solid #BFDBFE"}
            _hover={{ backgroundColor: "#DBEAFE" }}
            {...props}
        >
            {children}
        </Button>
    );
};

export const BoxMy = ({ children, ...props }: BoxMyProps) => {
    return (
        <Box
            background={"white"}
            color={"#173DA6"}
            border={"2px solid #BFDBFE"}
            padding={"5px 16px"}
            borderRadius={"5px"}
            {...props}
        >
            {children}
        </Box>
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