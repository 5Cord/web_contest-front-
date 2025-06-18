import { Box, Container, Span } from "@chakra-ui/react"
import { ButtonMy, BoxMy } from "./ui/CustomTag"
import { FaRegStopCircle, FaRegPlayCircle } from "react-icons/fa";
import { useChangeTime, useExit } from "@/hooks/api";

interface BarProps {
    timeLesson: string
    flagTimeLesson: boolean
    errorTimeLesson: Error | null
    cookieStatus: string | undefined
}

export const Bar: React.FC<BarProps> = ({ timeLesson, flagTimeLesson, errorTimeLesson, cookieStatus }) => {
    const { Exit } = useExit()
    const { ChangeTime } = useChangeTime()

    return (
        <Container
            padding={"20px"} paddingBottom={"0px"} display={"flex"}
            alignItems={"center"} justifyContent={"space-between"}
        >
            <ButtonMy onClick={() => Exit()}>Выйти</ButtonMy>
            <Box display={"flex"} alignItems={"center"} gap={2}>
                <BoxMy>
                    {!timeLesson ?
                        errorTimeLesson == null ? "45:00" : errorTimeLesson.message
                        : timeLesson
                    }
                </BoxMy>
                {cookieStatus && cookieStatus === "teacher" &&
                    <Span cursor={"pointer"} onClick={() => ChangeTime("lesson")}>
                        {flagTimeLesson ? <FaRegStopCircle size={"20px"} /> : <FaRegPlayCircle size={"20px"} />}
                    </Span>
                }
            </Box>
        </Container >
    )
}