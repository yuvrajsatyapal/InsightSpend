const xlsx = require('xlsx');
const Expense = require('../models/Expense');
const moment = require("moment");
const fs = require('fs');

// Add Expense Source
exports.addExpense = async (req, res) => {
    const UserId = req.user.id;

    try {
        const { icon, category, amount, date } = req.body;

        // Validation: Check for missing fields
        if (!category || !amount || !date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newExpense = await Expense({
            userId: UserId,
            icon,
            category,
            amount,
            date: new Date(date),
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}
// Get all Expense Source
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}
// Delete Expense Source
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

// Download Excel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        // Prepare data
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            Date: moment(item.date).format("DD/MM/YYYY")
        }));

        // Create workbook
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");

        // Convert to buffer (no file write needed)
        const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

        // Set response headers
        res.setHeader('Content-Disposition', 'attachment; filename=expense_details.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send buffer
        res.send(buffer);

    } catch (error) {
        console.error("Expense download error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
