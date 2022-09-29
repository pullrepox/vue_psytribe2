export default (date) => {
    const newDate = new Date(date);
    const getMonth = newDate.toLocaleString('default', { month: 'long' })
    const getYear = newDate.getFullYear();
    return `${getMonth} ${getYear}`;
}
