
exports.getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    // Month starts at 0.
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const formatDate = `${month}-${day}-${year}`;

    return formatDate;
}