// set global variables
export const currencyPattern = new RegExp(/^\d*\.?\d*$/)
export let validations = {}

export function updateValidations(id, value) {
    validations[id] = value
}