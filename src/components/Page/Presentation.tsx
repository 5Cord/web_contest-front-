import { Box, Input } from "@chakra-ui/react"
import { ButtonMy } from "../ui/CustomTag"
import { useState } from "react"

interface PresentationProps {
    idPresentation: string
}

export const Presentation: React.FC<PresentationProps> = ({ idPresentation }) => {
    const [slideNow, setSlideNow] = useState<string | null>(
        localStorage.getItem("slide") || "1"
    )

    function handlerSlide(action: "next" | "prev") {
        const current = Number(slideNow || "1")
        const nextSlide = action === "next" ? current + 1 : Math.max(1, current - 1)
        setSlideNow(nextSlide.toString())
        localStorage.setItem("slide", nextSlide.toString())
    }

    return (
        <Box height="100vh">
            <Input
                display="block"
                textAlign="center"
                w="100px"
                borderRadius="15px"
                _focus={{ outline: "none", border: "1px solid #6A4CBC" }}
                margin="10px auto"
                value={slideNow || ""}
                onChange={(e) => {
                    setSlideNow(e.target.value)
                    localStorage.setItem("slide", e.target.value)
                }}
                color="var(--font-color)"
            />

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="calc(100vh - 80px)"
                overflow="hidden"
                padding="10px"
            >
                <ButtonMy
                    background="white"
                    w="60px"
                    h="100%"
                    fontSize="2xl"
                    onClick={() => handlerSlide("prev")}
                >
                    {"<"}
                </ButtonMy>

                <Box
                    flex="1"
                    maxWidth="100vw"
                    aspectRatio="16 / 10"
                    position="relative"
                >
                    <iframe
                        src={`https://docs.google.com/presentation/d/${idPresentation}/embed?rm=minimal&ui=0&slide=id.p${slideNow}`}
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                        allowFullScreen={false}
                    />
                </Box>

                <ButtonMy
                    background="white"
                    w="60px"
                    h="100%"
                    fontSize="2xl"
                    onClick={() => handlerSlide("next")}
                >
                    {">"}
                </ButtonMy>
            </Box>
        </Box>
    )
}
