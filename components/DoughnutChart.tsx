"use client";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
    const data = {
        datasets: [
            {
                label: "Bank Accounts",
                data: [500, 200, 150, 100, 50],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                ],
            },
        ],
        labels: ["Bank 1", "Bank 2", "Bank 3", "Bank 4", "Bank 5"],
    };
    return (
        <Doughnut
            data={data}
            options={{
                cutout: "60%",
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    );
};

export default DoughnutChart;
