/**
 * Generates today's date in MM-DD-YY String.
 * 
 * @returns The date of today in MM-DD-YY format.
 */
exports.getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    // Month starts at 0.
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const formatDate = `${month}-${day}-${year}`;

    return formatDate;
}

/**
 * Generates yesterday's date in MM-DD-YY format.
 * 
 * @returns The date of yesterday in MM-DD-YY format.
 */
exports.getYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    const year = yesterday.getFullYear();

    // Month starts at 0.
    const month = (yesterday.getMonth() + 1);
    const day = yesterday.getDate();
  
    const formatDate = `${month}-${day}-${year}`;
  
    return formatDate;
  };
  