const generateOptionsDay = () => {
  const options = [];
  for (let i = 1; i <= 31; i++) {
    const value = i.toString().padStart(2, "0");
    options.push({ value, label: value });
  }
  return options;
};

const generateOptionsYears = () => {
  const options = [];
  for (let i = 2024; i >= 1905; i--) {
    const value = i.toString();
    options.push({ value, label: value });
  }
  return options;
};

export const optionsMonths = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const optionsDays = generateOptionsDay();
export const optionsYears = generateOptionsYears();
