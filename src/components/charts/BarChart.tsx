"use client"

import React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
    showGrid?: boolean
    showYAxis?: boolean
}

export const DynamicBarChart: React.FC<BarChartProps> = ({
    data,
    dataKey,
    labelKey = "label",
    title = "Bar Chart",
    color = "#CE4DED",
    width = 600,
    height = 300,
    showGrid = true,
    showYAxis = true,
}) => {
    const chartConfig: ChartConfig = {
        [dataKey]: {
            label: title,
            color,
        },
    }

    return (
        <div className="pr-4" style={{ width: `${width}px`, height: `${height}px` }}>
            <ChartContainer config={chartConfig}>
                <BarChart
                    data={data}
                    width={width}
                    height={height}
                >
                    {showGrid && (
                        <CartesianGrid stroke="rgba(255,255,255,0.12)" vertical={false} />
                    )}

                    <XAxis
                        dataKey={labelKey}
                        axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                        tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }}
                        tickLine={false}
                        tickMargin={8}
                        stroke="#FFFFFF"

                    />

                    {showYAxis && (
                        <YAxis
                            axisLine={{ stroke: '#FFFFFF', strokeWidth: 1 }}
                            tick={{ fill: '#FFFFFF', fontSize: 12, style: { fill: '#FFFFFF' } }}
                            tickLine={false}
                            stroke="#FFFFFF"
                            tickMargin={8}
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
            </ChartContainer>
        </div>
    )
}
