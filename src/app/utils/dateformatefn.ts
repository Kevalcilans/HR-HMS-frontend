function formatDateToISO(dateInput:any) {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');  // Ensure two digits for the day
  
    return `${year}-${month}-${day}`;
  }

  export default formatDateToISO