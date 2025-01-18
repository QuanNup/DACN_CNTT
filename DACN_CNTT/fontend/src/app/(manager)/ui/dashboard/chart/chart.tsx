"use client"
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: "Chủ nhật",
        visit: 4000,
        click: 2400,
    },
    {
        name: "Thứ hai",
        visit: 3000,
        click: 1398,
    },
    {
        name: "Thứ ba",
        visit: 2000,
        click: 3800,
    },
    {
        name: "Thứ tư",
        visit: 2780,
        click: 3908,
    },
    {
        name: "Thứ năm",
        visit: 1890,
        click: 4800,
    },
    {
        name: "Thứ sáu",
        visit: 2390,
        click: 3800,
    },
    {
        name: "Thứ bảy",
        visit: 3490,
        click: 4300,
    },
];

const Chart = () => {
    const { theme } = useTheme();
    return (
        <div className='h-[450px] bg-gradient-to-t from-white to-gray-300 dark:from-[#282a36] dark:to-[#253352] p-5 rounded-lg'>
            <h2 className='font-medium text-2xl mb-5'>Biểu đồ tuần</h2>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{
                            background: `linear-gradient(to top, ${theme === 'dark' ? '#282a36, #253352' : '#ffffff, #d1d5db'
                                })`,
                            color: theme === 'dark' ? '#ffffff' : '#000',
                            border: "none",
                        }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="visit" stroke="#8884d8" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="click" stroke="#82ca9d" strokeDasharray="3 4 5 2" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart