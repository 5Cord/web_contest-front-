import { Box, Input } from "@chakra-ui/react"
import { ButtonYellow } from "../ui/CustomTag"
import { useState } from "react"

interface PresentationProps {
    idPresentation: string
}

export const Presentation: React.FC<PresentationProps> = ({ idPresentation }) => {
    const [slideNow, setSlideNow] = useState<string | null>(localStorage.getItem("slide"))

    function handlerSlide(action: "next" | "prev") {
        if (slideNow === "1" && action === "prev") {
            return
        }

        if (!slideNow) {
            localStorage.setItem("slide", "1")
        }

        var slide: number
        action === "next" ? slide = Number(slideNow) + 1 : slide = Number(slideNow) - 1
        setSlideNow(slide.toString())
        localStorage.setItem("slide", slide.toString())
    }

    return (
        <Box height={"100%"} marginTop={"5px"}>
            <Input
                display={"flex"}
                textAlign={"center"}
                w={"100px"}
                borderRadius={"15px"}
                _focus={{ outline: "none", border: "1px solid #F5D700" }}
                margin={"auto"}
                defaultValue={slideNow?.toString()}
                onChange={(e) => {
                    setSlideNow(e.target.value)
                    localStorage.setItem("slide", e.target.value)
                }}
            />
            <Box display={"flex"} gap={2} height={"90%"} marginTop={"20px"}>
                <ButtonYellow
                    background={"white"}
                    w={"100px"} height={"100%"}
                    cursor={"pointer"}
                    _hover={{ background: "#F5D700" }}
                    onClick={() => handlerSlide("prev")}
                >
                    {`<`}
                </ButtonYellow>
                <iframe
                    src={`https://docs.google.com/presentation/d/${idPresentation}/embed?rm=minimal&ui=0&slide=id.p${slideNow}`}
                    width="100%"
                    height="100%"
                    allowFullScreen={false}
                />
                <ButtonYellow
                    background={"white"}
                    w={"100px"} height={"100%"}
                    margin={"0"} cursor={"pointer"}
                    _hover={{ background: "#F5D700" }}
                    onClick={() => handlerSlide("next")}
                >
                    {`>`}
                </ButtonYellow>
            </Box>
        </Box>
    )
}