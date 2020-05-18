// set global variables
export const currencyPattern = new RegExp(/^\d*\.?\d*$/)
export let validations = {}
export let row = 0

export function updateValidations(id, value) {
    validations[id] = value
}

export function updateRow(action) {
    if (action === 'add') {
        row++
    } else if (action === 'remove') {
        row--
    }
}