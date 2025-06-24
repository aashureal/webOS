function getFormattedDate() {
    const date = new Date();               // ← no +1 here
    const weekdays = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
    const months   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  
    const day     = weekdays[date.getDay()];
    const month   = months[date.getMonth()];
    const dayNum  = date.getDate();
  
    return `${day} ${month} ${dayNum}`;    // e.g. "Tues Jun 24"
  }
  


  let d = getFormattedDate()

  console.log(d)