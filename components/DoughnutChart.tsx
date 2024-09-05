'use client'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
    const accountNames = accounts.map((account) => account.name)
    const balances = accounts.map((account) => account.currentBalance)
    const data = {
        datasets: [
            {
                label: 'Bank Accounts',
                data: balances,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                ],
            },
        ],
        labels: accountNames,
    }
    return (
        <Doughnut
            data={data}
            options={{
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    )
}

export default DoughnutChart
