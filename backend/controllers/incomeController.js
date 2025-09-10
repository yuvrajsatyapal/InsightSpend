const xlsx = require('xlsx');
const Income = require('../models/Income');
const moment = require("moment");
const fs = require('fs');



exports.addIncome = async (req, res) => {
    const UserId = req.user.id;

    try {
        const { icon, source, amount, date } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newIncome = await Income({
            userId: UserId,
            icon,
            source,
            amount,
            date: new Date(date),
        });

        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.deleteIncome = async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        
        
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: moment(item.date).format("DD/MM/YYYY")
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download('income_details.xlsx');
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });

        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: moment(item.date).format("DD/MM/YYYY")
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");

        const filePath = "income_details.xlsx";
        xlsx.writeFile(wb, filePath);

        
        setTimeout(() => {
            res.download(filePath, () => {
                fs.unlinkSync(filePath); 
            });
        }, 100); 

    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
