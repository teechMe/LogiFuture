/**
 * @summary This method returns random int between provided values
 * @param {number} min The minimal value of random int
 * @param {number} max The maximal value of random int
 * @return {number} The random integer
 * @author Nemanja Mitic
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

/**
 * @summary This method returns subtracted date from date provided
 * @param {string} endDate Date from which days will be subtracted
 * @param {number} noOfDaysToSubtract Number of days to subtract from endDate date
 * @return {string} Subtracted date
 * @author Nemanja Mitic
 */
export function subtractDate(endDate, noOfDaysToSubtract) {

    const minusHours = noOfDaysToSubtract * 24
 
    // Get the number of milliseconds since 1970-1-1, then subtract 1 day (24*60*60*1000 milliseconds)
    const dt = new Date(Date.parse(endDate) - minusHours*60*60*1000);
    
    return dt.toISOString();
}