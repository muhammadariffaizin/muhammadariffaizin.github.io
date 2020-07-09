// Get string formatted of current date
const strDateNow = () => {
    const now = new Date();
    return now.toLocaleDateString("fr-CA"); // Get the format yyyy-mm-dd
}

// Get string formatted of numbered month before
const strDatePast = (month) => {
    const newDate = new Date();
    newDate.setMonth((new Date()).getMonth() + month);
    return newDate.toLocaleDateString("fr-CA");
}

const getGMTOffset = () => {
    return -(new Date().getTimezoneOffset() / 60);
}

// Convert UTC formatted to human-based format date
const utcToDays = (utc) => {
    const json = `\"${utc}\"`;
    const date = new Date(JSON.parse(json));
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();
}
  
  // Convert UTC formatted to human-based format time
const utcToTime = (utc) => {
    const json = `\"${utc}\"`;
    const date = new Date(JSON.parse(json));
    const appendLeadingZeroes = (n) => {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }
    return appendLeadingZeroes(date.getHours()) + ":" + appendLeadingZeroes(date.getMinutes()) + " GMT+" + getGMTOffset();
}

export default {
    strDateNow,
    strDatePast,
    utcToDays,
    utcToTime
}