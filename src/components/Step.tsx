import { useEffect, useRef, useState } from "react";
import { useChangeLesson } from "@/hooks/api";
import { Box, Stack, Steps } from "@chakra-ui/react";

const steps = [
    { id: 1, step: "Организация" },
    { id: 2, step: "Мотивация" },
    { id: 3, step: "Новые знания" },
    { id: 4, step: "Индив. задание" },
    { id: 5, step: "Групп. задание" },
    { id: 6, step: "Решение" },
    { id: 7, step: "Оценки" }
];
const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 5 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
];
const colorArrow: string[] = [
    "#FF0000",
    "#FFA500",
    "#00FF00",
    "#FF00FF",
    "#00FA9A",
    "#0000FF",
    "#FF69B4",
];

interface StepProps {
    stageLesson: number;
    cookieStatus: string | undefined;
}

export const Step: React.FC<StepProps> = ({ stageLesson, cookieStatus }) => {
    const { ChangeLesson } = useChangeLesson();
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [arrows, setArrows] = useState<Arrow[]>([]);

    type Arrow = {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        cp1: { x: number; y: number };
        cp2: { x: number; y: number };
    };

    useEffect(() => {
        const getCoords = (index: number) => {
            const el = stepRefs.current[index];
            const container = containerRef.current;
            if (!el || !container) return null;

            const containerRect = container.getBoundingClientRect();
            const rect = el.getBoundingClientRect();

            return {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top - 3
            };
        };

        const calculateControlPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
            const distanceX = Math.abs(end.x - start.x);
            const distanceY = Math.abs(end.y - start.y);

            const peakHeight = Math.min(60, distanceX * 0.3) - 10;

            const adjustedHeight = distanceY < 30 ? peakHeight * 0.5 : peakHeight;

            return {
                cp1: { x: start.x + distanceX * 0.4, y: start.y - adjustedHeight },
                cp2: { x: end.x - distanceX * 0.4, y: end.y - adjustedHeight }
            };
        };

        const newArrows = connections.reduce((acc, conn) => {
            if (stageLesson - 1 < conn.from) return acc;

            const start = getCoords(conn.from);
            const end = getCoords(conn.to);
            if (!start || !end) return acc;

            const { cp1, cp2 } = calculateControlPoints(start, end);

            acc.push({
                x1: start.x,
                y1: start.y,
                x2: end.x,
                y2: end.y,
                cp1,
                cp2
            });
            return acc;
        }, [] as Arrow[]);

        setArrows(newArrows);
    }, [stageLesson]);

    const renderArrow = (arrow: Arrow, i: number) => {
        const pathData = `
            M ${arrow.x1},${arrow.y1}
            C ${arrow.cp1.x},${arrow.cp1.y} ${arrow.cp2.x},${arrow.cp2.y} ${arrow.x2},${arrow.y2}
        `;

        return (
            <g key={i}>
                <defs>
                    <marker
                        id={`arrowhead-${i}`}
                        markerWidth="10" markerHeight="7"
                        refX="10" refY="3.5" orient="auto"
                    >
                        <polygon points="0 0, 10 3.5, 0 7" fill={colorArrow[i]} />
                    </marker>
                </defs>
                <path
                    d={pathData}
                    fill="none"
                    stroke={colorArrow[i]}
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${i})`}
                />
            </g>
        );
    };

    return (
        <Box padding="20px" position="relative" ref={containerRef} overflow="hidden">
            <Stack gap="16">
                <Steps.Root size="sm" step={stageLesson - 1} count={steps.length} colorPalette="blue">
                    <Steps.List>
                        {steps.map((step, index) => (
                            <Steps.Item
                                key={index} userSelect={"none"}
                                index={index}
                                title={step.step}
                                style={{
                                    flex: `1 0 ${100 / steps.length}%`,
                                    maxWidth: `${100 / steps.length}%`,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    boxSizing: 'border-box',
                                }}
                                onClick={() => {
                                    if (cookieStatus && cookieStatus === "teacher") {
                                        if (step.id !== stageLesson) {
                                            ChangeLesson({ step: step.id })
                                        }
                                    }
                                }}
                            >
                                <Steps.Title
                                    ref={(el: any) => (stepRefs.current[index] = el)}
                                    backgroundColor={
                                        stageLesson > index + 1 ?
                                            "#F5D700" :
                                            stageLesson === index + 1 ?
                                                "#F5D70050" :
                                                "white"
                                    }
                                    color="black"
                                    border="1px solid black"
                                    borderBottom="4px solid black" width="100%" height="40px"
                                    margin="1" display="flex" alignItems="center"
                                    justifyContent="center" textAlign="center" borderRadius="5px"
                                >
                                    {step.step}
                                </Steps.Title>
                            </Steps.Item>
                        ))}
                    </Steps.List>
                </Steps.Root>
            </Stack>

            <svg
                style={{
                    position: "absolute",
                    top: 0, left: 0, width: "100%",
                    height: "100%", pointerEvents: "none",
                    zIndex: 10,
                }}
            >
                {arrows.map(renderArrow)}
            </svg>
        </Box>
    );
};