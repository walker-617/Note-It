function getTimestamp() {
    const currentDate = new Date();
  
    const options = { hour: "numeric", minute: "numeric", second: "numeric" };
    const currentTime = currentDate.toLocaleString("en-US", options);
  
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("en-US", { month: "long" });
    const year = currentDate.getFullYear();
    const ordinalSuffix = getOrdinalSuffix(day);
  
    const formattedDateString = day + ordinalSuffix + " " + month + " " + year;
  
    return currentTime + ", " + formattedDateString;
  }
  
  function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
  
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

export { getTimestamp };