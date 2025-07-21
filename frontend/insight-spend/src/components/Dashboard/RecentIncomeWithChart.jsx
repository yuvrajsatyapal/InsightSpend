import React, { useState, useEffect } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'


const COLORS = [
  "#60A5FA",  // Blue
  "#f43f5e",  // Rose Red
  "#fbbf24",  // Amber Yellow
  "#4f39f6",  // Deep Indigo
  "#22c55e",  // Emerald Green
  "#fb923c",  // Orange
  "#6366f1",  // Indigo
  "#ec4899",  // Pink
  "#06b6d4",  // Cyan / Sky
  "#8b5cf6",  // Violet
];

const RecentIncomeWithChart = ({data, totalIncome}) => {

    const [charData, setCharData] = useState([]);

    const prepareCharData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount
        }));

        setCharData(dataArr);
    };

    useEffect(() => {
        prepareCharData();
        return () => {};
    }, [data]);

  return (
    <div className='card'>
        <div className='flex items-center justify-between'>
            <h5 className='text-lg'>Last 60 Days Income</h5>
        </div>

        <CustomPieChart 
        data={charData}
        label="Total Income"
        colors={COLORS}
        totalAmount={`$${totalIncome}`}
        showTextAnchor
        />
    </div>
  )
}

export default RecentIncomeWithChart