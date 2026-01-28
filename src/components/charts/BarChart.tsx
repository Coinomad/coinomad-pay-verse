"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart"

interface BarChartProps {
    data: any[]
    dataKey: string
    labelKey?: string
    title?: string
    color?: string
    width?: number
    height?: number
    className?: string
    heightClassName?: string
    showGrid?: boolean
    showYAxis?: boolean
}

export const DynamicBarChart: React.FC<BarChartProps> = ({
    data,
    dataKey,
    labelKey = "label",
    title = "Bar Chart",
    color = "#CE4DED",
    width,
    height = 300,
    className,
    heightClassName,
    showGrid = true,
    showYAxis = true,
}) => {
    const chartConfig: ChartConfig = {
        [dataKey]: {
            label: title,
            color,
        },
    }

    const containerStyle: React.CSSProperties = {
        height: heightClassName ? undefined : `${height}px`,
        width: width ? `${width}px` : "100%",
    }

    return (
        <div className={`w-full ${heightClassName ?? ""} ${className ?? ""}`} style={containerStyle}>
            <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                        {showGrid && (
                            <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
                        )}

                        <XAxis
                            dataKey={labelKey}
                            axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                            tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }}
                            tickLine={false}
                            tickMargin={6}
                            stroke="#FFFFFF"

                        />

                        {showYAxis && (
                            <YAxis
                                axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                                tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }}
                                tickLine={false}
                                stroke="#FFFFFF"
                                tickMargin={6}
                            />
                        )}

                        <ChartTooltip
                            content={<ChartTooltipContent />}
                        />

                        <Bar
                            dataKey={dataKey}
                            fill={color}
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}
