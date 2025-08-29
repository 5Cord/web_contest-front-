import { Box, Input } from "@chakra-ui/react"
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
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            position="relative"
        >
            {/* Инпут для слайда */}
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
            />
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flex="1"
                width="100%"
                gap="10px"
            >
                <Box
                    as="button"
                    onClick={() => handlerSlide("prev")}
                    w="70px"
                    h="70px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="60px"
                    fontWeight="bold"
                    color="#4775A6"
                    background="transparent"
                    borderRadius="50%"
                    cursor="pointer"
                >
                    ‹
                </Box>

                <Box
                    flex="1"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={'85vh'}
                >
                    <iframe
                        src={`https://docs.google.com/presentation/d/${idPresentation}/embed?rm=minimal&ui=0&slide=id.p${slideNow}`}
                        style={{
                            width: "90%",
                            height: "90%",
                            border: "none",
                        }}
                        allowFullScreen
                    />
                </Box>

                <Box
                    as="button"
                    onClick={() => handlerSlide("next")}
                    w="70px"
                    h="70px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="60px"
                    fontWeight="bold"
                    color="#4775A6"
                    background="transparent"
                    borderRadius="50%"
                    cursor="pointer"
                >
                    ›
                </Box>
            </Box>
        </Box>
    )
}
