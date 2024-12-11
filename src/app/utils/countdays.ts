function isLastSaturday(date) {
    const month = date.getMonth();
    const nextSaturday = new Date(date.getFullYear(), month + 1, 1);
    nextSaturday.setDate(nextSaturday.getDate() + (6 - nextSaturday.getDay()));
    return nextSaturday.getMonth() !== month; // If the next Saturday is in the next month
  }
  
  function countLeaveDays(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
  
    if (start > end) {
      return 0;
    }
  
    let leaveDays = 0;
  
   
    while (start <= end) {
      let dayOfWeek = start.getDay(); 
  
     
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        leaveDays++;
      } else if (dayOfWeek === 6 && isLastSaturday(start)) {
        
        leaveDays++;
      }
  
      start.setDate(start.getDate() + 1);
    }
  
    return leaveDays;
  }
  

  export default countLeaveDays