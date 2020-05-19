import { updateValidations, row, updateRow } from './global.js'
import { addRow, currencyValidator, calculate } from './functions.js'

// add first row
addRow(document.querySelector('#add-row'))

// allow user to add additional rows
document.querySelector('#add-row i').addEventListener('click', (event) => {
    addRow(event.target.parentElement)
})

// main logic
function events(event) {
    if (event.target && event.target.className.includes('remove-row')) {
        // allow the user to delete rows
        // keep at least 1 row though
        if (row != 1) {
            event.target.parentElement.parentElement.remove()
            updateRow('remove')
        }
    }

    // collect all netto and brutto input ids and their values
    for (const input of document.getElementsByTagName('input')) {
        if (input.id) {
            updateValidations(input.id, input.value)
        }
    
        // validate and calculate on input change
        if (input.parentElement.className === 'currency-input') {
            input.addEventListener('input', (e) => {
                currencyValidator(e.target)
    
                if (e.target.id.includes('-netto')) {
                    calculate(e.target, 'netto')
                } else {
                    calculate(e.target, 'brutto')
                }
            })
        }
    }

    // calculate on mwst change
    for (const option of document.getElementsByTagName('select')) {
        option.addEventListener('change', (e) => {
            calculate(e.target, 'netto', e.target.value)
        })
    }
}

// global click event for dynamically created elements
// multiple events to cover multiple ways to start using the page
// (clicking, navigation with tab through inputs)
document.addEventListener('click', (event) => {
    events(event);
})

document.addEventListener('touchstart', (event) => {
    events(event);
})

document.addEventListener('change', (event) => {
    events(event);
})

document.addEventListener('keydown', (event) => {
    events(event);
})