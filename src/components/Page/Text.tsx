import { Container } from "@chakra-ui/react"

type TextProps = {
    children: string
}

export const Text = ({ children }: TextProps) => {
    return (
        <Container padding={"20px"} paddingTop={"0px"} >
            {children}
        </ Container>
    )
}