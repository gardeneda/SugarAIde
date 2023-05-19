/**
 * Gets the values that are checked 
 * @returns array of values that are currently checked.
 */
export function getValues() {
    const arr = [];
    const checked = document.querySelectorAll("input[type=checkbox]:checked").forEach(value => {
        arr.push(value.value);
    });

    return arr;
}


/**
 * Sends a POST request to /todo to update the to-do list's
 * checkbox status in order to save the user's progress
 * in the database.
 * 
 * @see {@link getValues} for getting the array of values.
 */
export const postCheckList = async () => {
    const valueArr = getValues();
    const request = { checkedValues: valueArr } ;
    const response = await fetch("https://drab-rose-indri-sari.cyclic.app/todo", {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    });

    console.log(response);
}
