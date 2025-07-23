import React, { useState, useEffect } from 'react'
import CustomPieChart from '../Charts/CustomPieChart'


const COLORS = [
  "#60A5FA",  
  "#f43f5e",  
  "#fbbf24",  
  "#4f39f6",  
  "#22c55e",  
  "#fb923c",  
  "#6366f1",  
  "#ec4899",  
  "#06b6d4",  
  "#8b5cf6",  
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
