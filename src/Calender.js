import React, { useState, useEffect, useRef } from "react";

const Calendar = ({ onDateSelect }) => {
  
  const [yearRange, setYearRange] = useState([
    Math.floor(new Date().getFullYear() / 10) * 10,
    Math.floor(new Date().getFullYear() / 10) * 10 + 9,
  ]);
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
 
  const dropdownRef = useRef(null);

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const [theme, setTheme] = useState("light");

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const [selectedDate, setSelectedDate] = useState(null);

  const [view, setView] = useState("month");
 




  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const generateCalendarDates = (year, month) => {

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const previousMonthDays = getDaysInMonth(year, month - 1);

    const prevMonthDates = Array.from(
      { length: firstDayOfMonth },
      (_, i) => previousMonthDays - firstDayOfMonth + i + 1
    );

    const currentMonthDates = Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    );

    const nextMonthDates = Array.from(
      { length: 42 - prevMonthDates.length - currentMonthDates.length },
      (_, i) => i + 1
    );

    return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];

  };


  const handleDateClick = (date, isPrevMonth, isNextMonth) => {
    let newYear = selectedYear;
    let newMonth = currentMonth;


    if (isPrevMonth) {
        newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        newYear = currentMonth === 0 ? newYear - 1 : newYear;
    } else if (isNextMonth) {
        newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        newYear = currentMonth === 11 ? newYear + 1 : newYear;
    }


    setSelectedDate({ year: newYear, month: newMonth, date });

 const selected = { year: newYear, month: newMonth, date };


    setSelectedDate(selected);
    setSelectedYear(newYear);
    setCurrentMonth(newMonth);
   


 
    const formattedDate = `${newMonth + 1}/${date}/${newYear}`;
    console.log("Selected Date:", formattedDate);

    if (onDateSelect) {
      onDateSelect(selected);
    }
};



  useEffect(() => {
    const savedDate = JSON.parse(localStorage.getItem("selectedDate"));
    if (savedDate) {

      setSelectedDate(savedDate);
      setSelectedYear(savedDate.year);
      setCurrentMonth(savedDate.month);
    }

   
  }, []);
  

//save selected date to the local storage
  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
    }
  }, [selectedDate]);


//close year-range popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);


  const getYearsInRange = (start, end) => {
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push(year);
    }
    return years;
  };

  // Update year range
  const handleRangeChange = (direction) => {
    const step = 10;
    if (direction === "prev") {
      setYearRange([yearRange[0] - step, yearRange[1] - step]);
    } else if (direction === "next") {
      setYearRange([yearRange[0] + step, yearRange[1] + step]);
    }
  };
  
 
    const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };


  return (
    <div
      className={`max-w-lg mx-auto border rounded shadow-md transition-all ${
        theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"
      }`}
    >
     
      <div className="flex items-center justify-between border-b border-gray-300 p-4">
      <div className="relative flex space-x-4">
        <button
          onClick={toggleTheme}
          className={`p-1 rounded-full ${
            theme === "light" ? "bg-yellow-200" : "bg-gray-500"
          }`}
        >
          {theme === "light" ? "☀️" : "🌙"}
        </button>
 
<div className="relative" ref={dropdownRef}>
<div
              onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
              className={`border rounded p-3 py-1 cursor-pointer flex items-center justify-between ${
                theme === "light" ? "border-gray-300" : "border-gray-600"
              }`}
            >
    <span>{selectedYear}</span>
    <svg
  xmlns="http://www.w3.org/2000/svg"
  className={`ml-5 w-4 h-4 transition-transform ${
    isYearDropdownOpen ? "rotate-180" : "rotate-0"
  }`}
  fill="none"
  viewBox="0 0 24 24"
  stroke="gray" 
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
</svg>

  </div>

  {isYearDropdownOpen && (
    <div className="absolute z-50 mt-2 w-72 bg-white border border-gray-300 rounded shadow-md text-black">
  
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <button
          onClick={() => handleRangeChange("prev")}
          className="text-blue-500 hover:underline"
        >
          &lt; Prev
        </button>
        <span className="font-bold">
          {yearRange[0]} - {yearRange[1]}
        </span>
        <button
          onClick={() => handleRangeChange("next")}
          className="text-blue-500 hover:underline"
        >
          Next &gt;
        </button>
      </div>

    
      <div className="grid grid-cols-3 gap-2 p-2">
        {getYearsInRange(yearRange[0], yearRange[1]).map((year) => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year);
              setIsYearDropdownOpen(false);
            }}
            className={`px-2 py-1 rounded ${
              year === selectedYear
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  )}
</div>


{view === "month" && (
<div className="relative flex items-center">
  <select
    value={currentMonth}
    onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
    className={`appearance-none border border-gray-300 rounded px-5 py-1 cursor-pointer w-full ${
      theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"
    }`}
  >
    {months.map((month, index) => (
      <option
        key={month}
        value={index}
        style={{
          backgroundColor: theme === "light" ? "white" : "#2d3748", 
          color: theme === "light" ? "black" : "white", 
        }}
      >
        {month}
      </option>
    ))}
  </select>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="absolute ml-6 right-1 w-4 h-4 pointer-events-none"
    fill="none"
    viewBox="0 0 24 24"
    stroke="gray"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>)}



        </div>


        <div className="flex ml-4">
          <button
            onClick={() => setView("month")}
            className={`px-5 py-1 border rounded-l border-gray-300 ${
              view === "month" ? "text-blue-500 border-blue-500" : ""
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("year")}
            className={`px-5 py-1 border rounded-r border-gray-300 ${
              view === "year" ? "text-blue-500 border-blue-500" : ""
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {view === "month" ? (
        <div
        className={`grid grid-cols-7 gap-3 text-center p-3 ${
          theme === "light" ? "" : "bg-gray-700 text-gray-300"
        }`}
      >
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="font-semibold">{day}</div>
          ))}
       {generateCalendarDates(selectedYear, currentMonth).map((date, index) => {
  const isPrevMonth = index < 7 && date > 20; 
  const isNextMonth = index >= 28 && date < 15; 
  const isCurrentMonth = !isPrevMonth && !isNextMonth; 
  const actualMonth = isPrevMonth
    ? currentMonth === 0 ? 11 : currentMonth - 1
    : isNextMonth
    ? currentMonth === 11 ? 0 : currentMonth + 1
    : currentMonth;

  const actualYear = isPrevMonth
    ? currentMonth === 0 ? selectedYear - 1 : selectedYear
    : isNextMonth
    ? currentMonth === 11 ? selectedYear + 1 : selectedYear
    : selectedYear;

  const isSelected =
    selectedDate &&
    selectedDate.date === date &&
    selectedDate.month === actualMonth &&
    selectedDate.year === actualYear;

  return (
    <div
      key={index}
      className={`p-2 text-center rounded cursor-pointer ${
        isPrevMonth || isNextMonth ? "text-gray-400" : ""
      } ${isSelected ? "bg-blue-500 text-white" : ""}  ${
                theme === "light"
                  ? "hover:bg-gray-100"
                  : "hover:bg-gray-600"
      }`}
      onClick={() => handleDateClick(date, isPrevMonth, isNextMonth)}
    >
      {date}
    </div>
  );
})}


        </div>
      ) : (
        <div className="grid grid-cols-3 gap-10 text-center max-w-lg mx-auto p-3">
          {months.map((month, index) => (
            <div
              key={index}
              className={`flex items-center justify-center cursor-pointer rounded hover:bg-gray-500 hover:text-white ${
                currentMonth === index ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => {
                setCurrentMonth(index);
                setView("month");
              }}
              style={{
                width: "80px", 
                height: "40px",
              }}
            >
              {month.slice(0, 3)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
