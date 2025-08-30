import { useEffect, useRef, useState } from "react";
import { useChangeLesson } from "@/hooks/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./ui/Step.module.css";
import Card1 from "./SVG/Card1.svg";
import Card2 from "./SVG/Card2.svg";
import Card3 from "./SVG/Card3.svg";
import Card4 from "./SVG/Card4.svg";
import Card5 from "./SVG/Card5.svg";

const steps = [
    { id: 1, step: "ПОСТАНОВКА ЦЕЛИ\nВЫРАБОТКА ПЛАНА РЕШЕНИЯ", boldParts: ["ПОСТАНОВКА ЦЕЛИ"], card: Card1 },
    { id: 2, step: "ЗАДАНИЕ №1 \nПРОИЗВОДСТВЕННАЯ ЗАДАЧA", boldParts: ["ЗАДАНИЕ №1"], card: Card2 },
    { id: 3, step: "ЗАДАНИЕ №2 \nПРОИЗВОДСТВЕННАЯ ЗАДАЧА", boldParts: ["ЗАДАНИЕ №2"], card: Card3 },
    { id: 4, step: "ЛИЧНАЯ СТАТИСТИКА СОТРУДНИКА", boldParts: ["ЛИЧНАЯ СТАТИСТИКА СОТРУДНИКА"], card: Card4 },
    { id: 5, step: "ИТОГОВЫЙ ПРОДУКТ \nОТЧЁТ О КОЛЛИЗИЯХ", boldParts: ["ИТОГОВЫЙ ПРОДУКТ"], card: Card5 },
];

const formatStepText = (text: string, boldParts: string[]) => {
    if (!boldParts || boldParts.length === 0) return text;
    let formattedText = text;
    boldParts.forEach((part) => {
        formattedText = formattedText.replace(part, `<strong>${part}</strong>`);
    });
    return formattedText;
};

const connectionGroups = {
    1: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 4 }],
    2: [{ from: 1, to: 2 }, { from: 1, to: 3 }],
    3: [{ from: 2, to: 4 }],
    4: [{ from: 3, to: 4 }],
};

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
    animationDelay: number;
    group: number;
};

export const Step: React.FC<StepProps> = ({ stageLesson, cookieStatus }) => {
    const { ChangeLesson } = useChangeLesson();
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [arrows, setArrows] = useState<Arrow[]>([]);
    const navigate = useNavigate();

    const getArrowKey = (from: number, to: number) => `${from}-${to}`;

    // Вычисляем visitedStages и availableStages напрямую из stageLesson
    const visitedStages = new Set<number>();
    const availableStages = new Set<number>();
    for (let i = 1; i <= steps.length; i++) {
        if (i <= stageLesson) visitedStages.add(i);
        availableStages.add(i);
    }
    // if (connectionGroups[stageLesson as keyof typeof connectionGroups]) {
    //     connectionGroups[stageLesson as keyof typeof connectionGroups].forEach(conn => {
    //         availableStages.add(conn.to + 1);
    //     });
    // }

    const progressPercentage = (stageLesson / steps.length) * 100;

    useEffect(() => {
        const getCoords = (index: number) => {
            const el = stepRefs.current[index];
            const container = containerRef.current;
            if (!el || !container) return null;
            const containerRect = container.getBoundingClientRect();
            const rect = el.getBoundingClientRect();
            return { x: rect.left - containerRect.left + rect.width / 2, y: rect.top - containerRect.top - 3 };
        };

        const calculateControlPoints = (start: { x: number; y: number }, end: { x: number; y: number }) => {
            const distanceX = Math.abs(end.x - start.x);
            const arcHeight = 60;
            const sharpnessFactor = 0.15;
            return {
                cp1: { x: start.x + distanceX * sharpnessFactor, y: start.y - arcHeight },
                cp2: { x: end.x - distanceX * sharpnessFactor, y: end.y - arcHeight },
            };
        };

        const newArrows: Arrow[] = [];

        visitedStages.forEach(stage => {
            const stageConnections = connectionGroups[stage as keyof typeof connectionGroups];
            if (!stageConnections) return;

            stageConnections.forEach((conn) => {
                if (!availableStages.has(conn.to + 1)) return;

                const start = getCoords(conn.from);
                const end = getCoords(conn.to);
                if (!start || !end) return;

                const { cp1, cp2 } = calculateControlPoints(start, end);
                const key = getArrowKey(conn.from, conn.to);

                const animationDelay = (stage - 1) * 0.2;
                newArrows.push({ x1: start.x, y1: start.y, x2: end.x, y2: end.y, cp1, cp2, key, animationDelay, group: stage });
            });
        });

        setArrows(newArrows);
    }, [stageLesson]);

    const getStepStatus = (index: number) => {
        const stepId = index + 1;
        if (stepId < stageLesson) return "completed";
        if (stepId === stageLesson) return "active";
        return "incomplete";
    };

    const handleStepClick = (stepId: number) => {
        if (!availableStages.has(stepId)) return;

        if (cookieStatus === "teacher") {
            if (stepId !== stageLesson && stageLesson < stepId) ChangeLesson({ step: stepId });
        }
        navigate(`/lesson?stage=${stepId}`);
    };

    const renderArrow = (arrow: Arrow) => {
        const pathData = `M ${arrow.x1},${arrow.y1} C ${arrow.cp1.x},${arrow.cp1.y} ${arrow.cp2.x},${arrow.cp2.y} ${arrow.x2},${arrow.y2}`;
        return (
            <g key={arrow.key}>
                <motion.path
                    d={pathData}
                    fill="none"
                    stroke="#4775A6"
                    strokeWidth="6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: arrow.animationDelay }}
                />
            </g>
        );
    };

    return (
        <>
            <div className={styles.container} ref={containerRef}>
                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => {
                        const status = getStepStatus(index);
                        const isClickable = availableStages.has(step.id);

                        return (
                            <div
                                className={`${styles.stepWrapper} ${!isClickable ? styles.stepWrapperLocked : ''}`}
                                key={index}
                                title={step.step}
                                style={{ maxWidth: `${100 / steps.length}%` }}
                                onClick={() => handleStepClick(step.id)}
                            >
                                <img
                                    src={step.card}
                                    alt={`Card ${step.id}`}
                                    className={`${styles.cardBackground} ${styles[`cardBackground${step.id}`]} ${status === 'active' ? styles.cardActive : ''}`}
                                />
                                <div className={styles.stepContent}>
                                    <div className={`${styles.checkbox} ${styles[status]}`}>
                                        {status === "completed" && (
                                            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                                                <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#ffffff" strokeWidth="1" />
                                                <path d="M5 8L7 10L11 4" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {status === "active" && (
                                            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                                                <circle cx="8" cy="8" r="7" fill="#ffffff" stroke="#000000" strokeWidth="1" />
                                                <circle cx="8" cy="8" r="2" fill="black" />
                                            </svg>
                                        )}
                                        {status === "incomplete" && (
                                            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                                                <circle cx="8" cy="8" r="7" stroke="#000000" strokeWidth="1" />
                                            </svg>
                                        )}
                                    </div>
                                    <div
                                        ref={(el: any) => (stepRefs.current[index] = el)}
                                        className={`${styles.stepBox} ${status === "completed"
                                                ? styles.stepBoxCompleted
                                                : status === "active"
                                                    ? styles.stepBoxActive
                                                    : styles.stepBoxIncomplete
                                            }`}
                                    >
                                        <div className={styles.stepText}>
                                            <span dangerouslySetInnerHTML={{ __html: formatStepText(step.step, step.boldParts) }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <svg className={styles.arrowsSvg}>{arrows.map(renderArrow)}</svg>
            </div>

            <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                    <motion.div
                        className={styles.progressFill}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </>
    );
};
