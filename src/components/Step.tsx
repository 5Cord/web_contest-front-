import { useEffect, useRef, useState } from "react";
import { useChangeLesson } from "@/hooks/api";
import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const steps = [
    { id: 1, step: "ПОСТАНОВКА ЦЕЛИ.\nВЫРАБОТКА ПЛАНА РЕШЕНИЯ" },
    { id: 2, step: "ВЫПОЛНЕНИЕ ПРОИЗВОДСТВЕННОГО ЗАДАНИЯ №1" },
    { id: 3, step: "ВЫПОЛНЕНИЕ ПРОИЗВОДСТВЕННОГО ЗАДАНИЯ №2" },
    { id: 4, step: "ЛИЧНАЯ СТАТИСТИКА СОТРУДНИКА" },
    { id: 5, step: `ИТОГОВЫЙ ПРОДУКТ\n"ОТЧЁТ О КОЛЛИЗИЯХ"` },
];

const connections = [
    { from: 0, to: 4 },
    { from: 0, to: 2 },
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 3, to: 4 },
];

interface StepProps {
    stageLesson: number;
    cookieStatus: string | undefined;
}

type Arrow = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    cp1: { x: number; y: number };
    cp2: { x: number; y: number };
    key: string;
    isNew: boolean;
};

export const Step: React.FC<StepProps> = ({ stageLesson, cookieStatus }) => {
    const { ChangeLesson } = useChangeLesson();
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const navigate = useNavigate();
    const prevConnections = useRef<Set<string>>(new Set());

    const getArrowKey = (from: number, to: number) => `${from}-${to}`;

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

        const outgoingCounts: Record<number, number> = {};
        connections.forEach(conn => {
            outgoingCounts[conn.from] = (outgoingCounts[conn.from] || 0) + 1;
        });

        const calculateControlPoints = (
            start: { x: number; y: number },
            end: { x: number; y: number },
            fromIndex: number,
            toIndex: number,
            connectionIndex: number,
            totalOutgoing: number
        ) => {
            const distanceX = Math.abs(end.x - start.x);
            const distance = Math.abs(toIndex - fromIndex);

            const isLeftToRight = start.x < end.x;

            const spreadFactor = 60;
            let startOffset = 0;
            let endOffset = 0;

            if (distance === 0) {
            } else if (distance === 1) {
                startOffset = isLeftToRight ? spreadFactor * 0.6 : -spreadFactor * 0.6;
                endOffset = isLeftToRight ? -spreadFactor * 0.6 : spreadFactor * 0.6;
            } else if (distance === 2) {
                startOffset = isLeftToRight ? spreadFactor * 0.1 : -spreadFactor * 0.1;
                endOffset = isLeftToRight ? -spreadFactor * 0.1 : spreadFactor * 0.1;
            } else {
                startOffset = isLeftToRight ? spreadFactor * 0.8 : spreadFactor * 0.8;
                endOffset = isLeftToRight ? spreadFactor * 0.8 : -spreadFactor * 0.8;
            }

            if (totalOutgoing > 1) {
                startOffset = (connectionIndex / (totalOutgoing - 1)) * spreadFactor * 2 - spreadFactor;
            }

            let arcHeight;
            if (distance === 1) {
                arcHeight = 20;
            } else if (distance === 2) {
                arcHeight = 60;
            } else {
                arcHeight = 100;
            }

            const sharpnessFactor = 0.15;

            return {
                cp1: {
                    x: start.x + distanceX * sharpnessFactor + startOffset,
                    y: start.y - arcHeight
                },
                cp2: {
                    x: end.x - distanceX * sharpnessFactor + endOffset,
                    y: end.y - arcHeight
                },
                startOffset,
                endOffset
            };
        };

        const connectionCounters: Record<number, number> = {};
        const newArrows: Arrow[] = [];
        const currentConnections = new Set<string>();

        connections.forEach(conn => {
            if (stageLesson - 1 < conn.from) return;

            const start = getCoords(conn.from);
            const end = getCoords(conn.to);
            if (!start || !end) return;

            connectionCounters[conn.from] = (connectionCounters[conn.from] || 0) + 1;
            const currentCount = connectionCounters[conn.from];
            const totalOutgoing = outgoingCounts[conn.from] || 1;

            const { cp1, cp2, startOffset, endOffset } = calculateControlPoints(
                start,
                end,
                conn.from,
                conn.to,
                currentCount - 1,
                totalOutgoing
            );

            const key = getArrowKey(conn.from, conn.to);
            currentConnections.add(key);

            newArrows.push({
                x1: start.x + startOffset,
                y1: start.y,
                x2: end.x + endOffset,
                y2: end.y,
                cp1,
                cp2,
                key,
                isNew: !prevConnections.current.has(key)
            });
        });

        prevConnections.current = currentConnections;
        setArrows(newArrows);
    }, [stageLesson]);

    const renderArrow = (arrow: Arrow) => {
        const pathData = `
            M ${arrow.x1},${arrow.y1}
            C ${arrow.cp1.x},${arrow.cp1.y} ${arrow.cp2.x},${arrow.cp2.y} ${arrow.x2},${arrow.y2}
        `;

        return (
            <g key={arrow.key}>
                <defs>
                    <marker
                        id={`arrowhead-${arrow.key}`}
                        markerWidth="10"
                        markerHeight="7"
                        refX="4"
                        refY="3.5"
                        orient="auto"
                    >
                        <polygon
                            points="0 0, 5 3.5, 0 7"
                            fill={"var(--arrow-color)"}
                            style={{
                                opacity: arrow.isNew ? 0 : 1,
                                animation: arrow.isNew ? "fadeIn 0s ease-in forwards 0.1s" : "none"
                            }}
                        />
                    </marker>
                </defs>
                <path
                    d={pathData}
                    fill="none"
                    stroke={"var(--arrow-color)"}
                    strokeWidth="4"
                    markerEnd={`url(#arrowhead-${arrow.key})`}
                    style={{
                        opacity: arrow.isNew ? 0 : 1,
                        animation: arrow.isNew ? "drawArrow 0.8s ease-out forwards" : "none",
                        strokeDasharray: arrow.isNew ? "5000" : "none",
                        strokeDashoffset: arrow.isNew ? "5000" : "none"
                    }}
                />
            </g>
        );
    };

    return (
        <Box padding="30px 0px" position="relative" margin={"0"} ref={containerRef} overflow="hidden" width={"100%"}>
            <style>
                {`
                @keyframes drawArrow {
                    to {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                }
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }
                `}
            </style>
            <Box display={"flex"} flexDirection={"row"} gap={"20px"} margin={"0"} padding={"20px"} paddingTop={"25px"} width={"100%"}>
                {steps.map((step, index) => (
                    <Box
                        width={"100%"}
                        margin={"0"}
                        paddingTop={"25px"}
                        key={index}
                        userSelect={"none"}
                        title={step.step}
                        maxWidth={`${100 / steps.length}%`}
                        onClick={() => {
                            if (cookieStatus === "teacher") {
                                if (step.id !== stageLesson && stageLesson < step.id) {
                                    ChangeLesson({ step: step.id });
                                }
                                navigate(`/lesson?stage=${step.id}`);
                                return;
                            }

                            if (step.id !== 1 && step.id !== 5) {
                                navigate(`/lesson?stage=${step.id}`);
                            }
                        }}
                    >
                        <Box
                            ref={(el: any) => (stepRefs.current[index] = el)}
                            backgroundColor={stageLesson > index ? "var(--third-bg)" : "var(--first-bg)"}
                            border={stageLesson > index ? "5px solid var(--border-color)" : "1px solid var(--border-color)"}
                            color={"var(--font-color)"}
                            borderRadius="9px"
                            width="100%"
                            height="100%"
                            textAlign={"center"}
                            alignItems={"center"}
                            padding="0 5px"
                        >
                            <Text
                                fontWeight={"bold"}
                                display={"flex"}
                                textAlign={"center"}
                                height={"100%"}
                                margin={"auto"}
                                flexDirection={"column"}
                                whiteSpace="pre-line"
                            >
                                <span style={{ fontWeight: "bold", fontSize: "25px" }}>{step.id}</span>
                                {step.step}
                            </Text>
                        </Box>
                    </Box>
                ))}
            </Box>

            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 10,
                }}
            >
                {arrows.map(renderArrow)}
            </svg>
        </Box>
    );
};