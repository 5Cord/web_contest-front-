import { useEffect, useRef, useState } from "react"
import { useChangeLesson } from "@/hooks/api"
import { Box, Button, ButtonGroup, Container, Stack, Steps } from "@chakra-ui/react"

const steps = ["Организация", "Мотивация", "Новый знания", "Индив. задание", "Групп. задание", "Решение", "Оценки"]
const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
]

interface StepProps {
    stageLesson: number;
    cookieStatus: string | undefined
}

export const Step: React.FC<StepProps> = ({ stageLesson, cookieStatus }) => {
    const { ChangeLesson } = useChangeLesson()
    const stepRefs = useRef<(HTMLDivElement | null)[]>([])
    const containerRef = useRef<HTMLDivElement>(null)
    const [arrows, setArrows] = useState<{ x1: number; y1: number; x2: number; y2: number; cp1: { x: number; y: number }; cp2: { x: number; y: number } }[]>([])

    useEffect(() => {
        const getCoords = (index: number) => {
            const el = stepRefs.current[index]
            const container = containerRef.current
            if (!el || !container) return null

            const containerRect = container.getBoundingClientRect()
            const rect = el.getBoundingClientRect()

            // Координаты относительно контейнера
            return {
                x: rect.left - containerRect.left + rect.width / 2 + 50,
                y: rect.top - containerRect.top + 55
            }
        }

        const newArrows = connections.reduce((acc, conn) => {
            if (stageLesson - 1 < conn.from) {
                return acc
            }

            const start = getCoords(conn.from)
            const end = getCoords(conn.to)
            if (!start || !end) return acc

            const midX = (start.x + end.x) / 2
            const cpHeight = Math.min(start.y, end.y) - 80

            const startXAdjusted = start.x - 75
            const endXAdjusted = end.x - 80

            const cp1 = { x: midX, y: cpHeight }
            const cp2 = { x: midX, y: cpHeight }

            acc.push({
                x1: startXAdjusted,
                y1: start.y - 50,
                x2: endXAdjusted,
                y2: end.y - 50,
                cp1,
                cp2
            })
            return acc
        }, [] as { x1: number; y1: number; x2: number; y2: number; cp1: { x: number; y: number }; cp2: { x: number; y: number } }[])

        setArrows(newArrows)
    }, [stageLesson])

    return (
        <Container padding={"20px"} position="relative" ref={containerRef}>
            <Stack gap="16">
                <Steps.Root size={"sm"} step={stageLesson - 1} count={steps.length} colorPalette={"blue"}>
                    <Steps.List>
                        {steps.map((step, index) => (
                            <Steps.Item key={index} index={index} title={step}>
                                <Box ref={(el: any) => (stepRefs.current[index] = el)}>
                                    <Steps.Indicator />
                                    <Steps.Title>{step}</Steps.Title>
                                </Box>
                                <Steps.Separator height={"20px"} />
                            </Steps.Item>
                        ))}
                    </Steps.List>

                    {cookieStatus && cookieStatus === "teacher" && (
                        <ButtonGroup display={"flex"} w={"100%"} justifyContent={"center"} size="sm" variant="outline">
                            <Steps.PrevTrigger asChild>
                                <Button onClick={() => ChangeLesson({ step: "prev" })}>Пред.</Button>
                            </Steps.PrevTrigger>
                            <Steps.NextTrigger asChild>
                                <Button onClick={() => ChangeLesson({ step: "next" })}>След.</Button>
                            </Steps.NextTrigger>
                        </ButtonGroup>
                    )}
                </Steps.Root>
            </Stack>

            <svg style={{
                position: "absolute",
                top: -3,
                left: 2,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 10
            }}>
                {arrows.map((arrow, i) => {
                    const pathData = `
                      M ${arrow.x1},${arrow.y1}
                      C ${arrow.cp1.x},${arrow.cp1.y} ${arrow.cp2.x},${arrow.cp2.y} ${arrow.x2},${arrow.y2}
                    `

                    return (
                        <g key={i}>
                            <defs>
                                <marker id={`arrowhead-${i}`} markerWidth="10" markerHeight="7"
                                    refX="10" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#3182ce" />
                                </marker>
                            </defs>
                            <path
                                d={pathData}
                                fill="none"
                                stroke="#3182ce"
                                strokeWidth="2"
                                markerEnd={`url(#arrowhead-${i})`}
                            />
                        </g>
                    )
                })}
            </svg>
        </Container>
    )
}