import { Box } from "@chakra-ui/react"

type TextProps = {
    children: string
}

export const Text = ({ children }: TextProps) => {
    return (
        <Box color={"var(--font-color)"}>
            {children}
        </ Box>
    )
}