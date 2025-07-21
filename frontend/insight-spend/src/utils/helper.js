import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email); 
};

export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = " ";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}

export const addThousandsSeparator = (num) => {

    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");

    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;

}

export const prepareExpenseBarChartData = (data = []) => {
    const charData = data.map((item) => ({
        label: item?.month || item?.category || "Unknown",
        amount: item?.amount
    }));

    return charData;
}


export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

  const charData = sortedData.map((item) => ({
    label: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source
  }));

  return charData;
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));

    const charData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: item?.amount,
        category: item?.category
    }));

    return charData;
}



