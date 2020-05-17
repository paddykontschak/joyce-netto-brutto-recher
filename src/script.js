import { updateValidations, row, decreaseRow } from './global.js'
import { addRow, currencyValidator, calculate } from './functions.js'

// add first row
addRow(document.querySelector('#add-row'))

// allow user to add additional rows
document.querySelector('#add-row i').addEventListener('click', (event) => {
    addRow(event.target.parentElement)
})

// global click event for dynamically created elements
document.addEventListener('click', (event) => {
    if (event.target && event.target.className.includes('remove-row')) {
        // allow the user to delete rows
        // keep at least 1 row though
        if (row != 1) {
            event.target.parentElement.parentElement.remove()
            decreaseRow()
        }
    }

    // collect all netto and brutto input ids and their values
    for (let index = 0; index < document.getElementsByTagName('input').length; index++) {
        const input = document.getElementsByTagName('input')[index]
        
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
    for (let index = 0; index < document.getElementsByTagName('select').length; index++) {
        const select = document.getElementsByTagName('select')[index]
    
        select.addEventListener('change', (e) => {
            calculate(e.target, 'netto', e.target.value)
        })
    }
 })