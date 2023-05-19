/**
 * Gets the values that are checked 
 * @returns array of values that are currently checked.
 */
const getValues = () => {
    const arr = [];
    console.log('################################');
    const checked = document.querySelectorAll("input[type=checkbox]:checked").forEach(value => {
        console.log(value);
        arr.push(value.value);
    });
    console.log('################################');
    return arr;
}


/**
 * Sends a POST request to /todo to update the to-do list's
 * checkbox status in order to save the user's progress
 * in the database.
 * 
 * @see {@link getValues} for getting the array of values.
 */
const postCheckList = async () => {
    const valueArr = getValues();
    const request = { checkedValues: valueArr } ;
    const response = await fetch("http://127.0.0.1:8000/todo", {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    });

}

document.querySelectorAll("input[type=checkbox]").forEach(box => {
    box.addEventListener('change', postCheckList);
});
