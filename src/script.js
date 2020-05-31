import { updateValidations } from './global.js'
import { addRow, currencyValidator, calculate } from './functions.js'

// allow user to add additional rows
document.querySelector('#add-row i').addEventListener('click', ({target}) => addRow(target.parentElement))

// main logic
function events({target}) {
    if (target && target.className.includes('remove-row')) {
        // allow the user to delete rows
        // keep at least 1 row though
        if (target.parentElement.parentElement.id != 'row-0') {
            target.parentElement.parentElement.remove()
        }
    }

    // collect all netto and brutto input ids and their values
    for (const input of document.getElementsByTagName('input')) {
        if (input.id) {
            updateValidations(input.id, input.value)
        }
    
        // validate and calculate on input change
        if (input.parentElement.className === 'currency-input') {
            input.addEventListener('input', ({target}) => {
                currencyValidator(target)
    
                if (target.id.includes('netto-')) {
                    calculate(target, 'netto')
                } else {
                    calculate(target, 'brutto')
                }
            })

            input.addEventListener('blur', ({target}) => target.value = parseFloat(target.value).toFixed(2))
        }
    }

    // calculate on mwst change
    for (const option of document.getElementsByTagName('select')) {
        option.addEventListener('change', ({target}) => calculate(target, 'netto', target.value))
    }
}

// global click event for dynamically created elements
// multiple events to cover multiple ways to start using the page
// (clicking, navigation with tab through inputs)
document.addEventListener('click', (event) => events(event))
document.addEventListener('touchstart', (event) => events(event))
document.addEventListener('change', (event) => events(event))
document.addEventListener('keydown', (event) => events(event))