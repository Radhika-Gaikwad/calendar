import React, { useState, useEffect } from "react";
import Calendar from "./Calender";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const savedDate = JSON.parse(localStorage.getItem("selectedDate"));
    if (savedDate) {
      setSelectedDate(savedDate);
      
    }
  }, []);


  useEffect(() => {
    if (selectedDate) {
      localStorage.setItem("selectedDate", JSON.stringify(selectedDate));
    }
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date); 
    
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Calendar</h1>
      <Calendar onDateSelect={handleDateSelect} />
      <div className="mt-6 text-lg">
        <span className="font-semibold">Selected Date:</span>{" "}
        {selectedDate
          ? `${selectedDate.month + 1}/${selectedDate.date}/${selectedDate.year}`
          : "None"}
      </div>
    </div>
  );
}

export default App;
