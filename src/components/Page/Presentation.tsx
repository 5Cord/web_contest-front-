import { Box, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface PresentationProps {
    idPresentation: string
}

export const Presentation: React.FC<PresentationProps> = ({ idPresentation }) => {
    const navigate = useNavigate()
    const [slideNow, setSlideNow] = useState<string | null>(
        localStorage.getItem("slide") || "1"
    )

    function handlerSlide(action: "next" | "prev") {
        const current = Number(slideNow || "1")
        const nextSlide = action === "next" ? current + 1 : Math.max(1, current - 1)
        setSlideNow(nextSlide.toString())
        localStorage.setItem("slide", nextSlide.toString())
    }

    const handleBack = () => {
        // Сохраняем текущий слайд (уже в localStorage)
        navigate("/lesson") // возвращаем на предыдущую страницу
    }

    return (
        <Box height="100vh" position="relative">
            {/* Плавающая стрелка назад */}
            <Box
                as="button"
                onClick={handleBack}
                position="fixed"
                top="20px"
                left="20px"
                w="50px"
                h="50px"
                borderRadius="50%"
                background="rgba(0,0,0,0.3)"
                color="white"
                fontSize="30px"
                fontWeight="bold"
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex={999}
                cursor="pointer"
                _hover={{ background: "rgba(0,0,0,0.5)" }}
            >
                ←
            </Box>

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
                justifyContent="center"
                alignItems="center"
                height="calc(100vh - 80px)"
                overflow="hidden"
                padding="10px"
            >
                {/* Стрелка назад слайд */}
                <Box
                    as="button"
                    onClick={() => handlerSlide("prev")}
                    aria-label="Previous slide"
                    w="70px"
                    h="70px"
                    rotate={180}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    background="transparent"
                    color="#4775A6"
                    fontSize="90px"
                    fontWeight="bold"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _active={{ transform: "scale(0.5)" }}
                    position="relative"
                >
                    <Box as="span" display="block" transform="translateX(2px)">›</Box>
                    <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w="50px"
                        h="50px"
                        borderRadius="50%"
                        background="transparent"
                        transition="all 0.3s ease"
                        _hover={{ background: "rgba(255, 255, 255, 0.1)" }}
                    />
                </Box>

                {/* Слайд iframe */}
                <Box flex="1" maxWidth="100vw" aspectRatio="16 / 10" position="relative">
                    <iframe
                        src={`https://docs.google.com/presentation/d/${idPresentation}/embed?rm=minimal&ui=0&slide=id.p${slideNow}`}
                        style={{ position: "absolute", width: "100%", height: "100%" }}
                        allowFullScreen={false}
                    />
                </Box>

                {/* Стрелка вперед слайд */}
                <Box
                    as="button"
                    onClick={() => handlerSlide("next")}
                    aria-label="Next slide"
                    w="70px"
                    h="70px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="50%"
                    background="transparent"
                    color="#4775A6"
                    fontSize="90px"
                    fontWeight="bold"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _active={{ transform: "scale(0.5)" }}
                    position="relative"
                >
                    <Box as="span" display="block" transform="translateX(2px)">›</Box>
                </Box>
            </Box>
        </Box>
    )
}
