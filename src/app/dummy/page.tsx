"use client"
import React, { useState } from 'react';

// Function to check if a date is the last Saturday of the month
function isLastSaturday(date) {
  const month = date.getMonth();
  const nextSaturday = new Date(date.getFullYear(), month + 1, 1);
  nextSaturday.setDate(nextSaturday.getDate() + (6 - nextSaturday.getDay()));
  return nextSaturday.getMonth() !== month; // If the next Saturday is in the next month
}

function countLeaveDays(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);

  // Ensure that the start date is before the end date
  if (start > end) {
    return 0;
  }

  let leaveDays = 0;

  // Loop through each day in the range from start to end
  while (start <= end) {
    let dayOfWeek = start.getDay(); // 0: Sunday, 6: Saturday

    // If it's not Saturday or Sunday, count it as a leave day
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      leaveDays++;
    } else if (dayOfWeek === 6 && isLastSaturday(start)) {
      // Allow the last Saturday of the month to be counted
      leaveDays++;
    }

    // Move to the next day
    start.setDate(start.getDate() + 1);
  }

  return leaveDays;
}

function App() {
  // State for start and end dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveDays, setLeaveDays] = useState(null);

  const handleCalculate = () => {
    if (startDate && endDate) {
      const result = countLeaveDays(startDate, endDate);
      setLeaveDays(result);
    }
  };

  return (
    <div className="App">
      <h1>Leave Day Counter</h1>

      <div>
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <button onClick={handleCalculate}>Calculate working Days</button>

      {leaveDays !== null && (
        <div>
          <h3>Total working Days: {leaveDays}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
