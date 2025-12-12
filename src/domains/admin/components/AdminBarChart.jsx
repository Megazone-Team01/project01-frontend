import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import { ChartContainer, ChartTooltip} from "@/components/ui/chart.js";

const chartConfig = {
    day: {
        label: "Day",
        color: "green"
    },
    user: {
        label: "User",
        color: "red"
    }
}

const chartData = [
    { day: "12.12", user: 200 },
    { day: "12.13", user: 140 },
    { day: "12.14", user: 230 },
    { day: "12.15", user: 210 }
];

export const AdminBarChart = () => {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={5}
                    axisLine={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltip content={chartData} />}
                />
                <Bar dataKey="user" fill="var(--color-mobile)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}

export default AdminBarChart;