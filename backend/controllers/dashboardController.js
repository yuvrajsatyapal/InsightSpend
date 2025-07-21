const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income and expense
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId }},
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalExpenses = await Expense.aggregate([
            { $match: { userId: userObjectId }},
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Income in last 60 days
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        // Expense in last 30 days
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }).sort({ date: -1 });

        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount, 0
        );

        // Last 5 combined transactions
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({
                ...txn.toObject(),
                type: "income",
            })),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(txn => ({
                ...txn.toObject(),
                type: "expense",
            }))
        ].sort((a, b) => b.date - a.date); // Latest first

        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpenses[0]?.total || 0,
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },
            recentTransactions: lastTransactions
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
