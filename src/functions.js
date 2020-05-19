import { currencyPattern, validations, updateValidations, row, updateRow } from './global.js'

export function addRow(el) {
    // increase row number
    updateRow('add')

    const rowContent = `
        <div class="label" data-label="Leistung">
            <input type="text" />
        </div>
        <div class="label" data-label="Objekt">
            <select>
                <option></option>
                <option></option>
            </select>
        </div>
        <div class="label" data-label="Preis netto">
            <div class="currency-input">
                <input type="text" id="row-${row}-netto" placeholder="0.00" />
            </div>
        </div>
        <div class="label" data-label="Mwst">
            <select id="row-${row}-mwst">
                <option value="0">0%</option>
                <option value="7">7%</option>
                <option value="19">19%</option>
            </select>
        </div>
        <div class="label" data-label="Preis brutto">
            <div class="currency-input">
                <input type="text" id="row-${row}-brutto" placeholder="0.00" />
            </div>
        </div>
        <div class="label" data-label="Entfernen">
            <i class="far fa-trash-alt remove-row"></i>
        </div>
    `

    // row div#row
    const newRow = document.createElement('div')
          newRow.className = 'row'
          newRow.innerHTML = rowContent

    // insert
    document.getElementById('calculator').insertBefore(newRow, el)
}

export function currencyValidator(el) {
    // if input is a digit or period add new value to validation
    // else force input value to be the last valid value
    if (currencyPattern.test(el.value)) {
        updateValidations(el.id, el.value)
    } else {
        el.value = validations[el.id]
    }
}

export function calculate(el, from, mwst) {
    // figure out which row we're on
    // generate id names
    // set initial values
    const currentRow = mwst ? el.id.replace('-mwst','') : el.id.replace(`-${from}`,'')
    const mwstId = `#${currentRow}-mwst`
    const nettoId = `#${currentRow}-netto`
    const bruttoId = `#${currentRow}-brutto`
    // || 0 makes sure the calculation doesn't return NaN
    const value = mwst ? parseFloat(document.querySelector(nettoId).value) || 0 : parseFloat(el.value) || 0
    let totalNetto = 0
    let totalBrutto = 0
    
    // calculate netto and brutto
    // both mwst and netto calculate brutto
    if (mwst || from === 'netto') {
        mwst = mwst ? parseFloat(mwst) || 0 : parseFloat(document.querySelector(mwstId).value) || 0
        document.querySelector(bruttoId).value = parseFloat(value + ((value / 100) * mwst)).toFixed(2)
    } else {
        mwst = parseFloat(document.querySelector(mwstId).value) || 0
        document.querySelector(nettoId).value = parseFloat(value / (1 + (mwst / 100))).toFixed(2)
    }

    // calculate totals
    for (const netto of document.querySelectorAll('[id^="row-"][id$="-netto"]')) {
        totalNetto += parseFloat(netto.value) || 0
    }

    for (const brutto of document.querySelectorAll('[id^="row-"][id$="-brutto"]')) {
        totalBrutto += parseFloat(brutto.value) || 0
    }

    document.getElementById('total-netto').value = totalNetto.toFixed(2)
    document.getElementById('total-mwst').value = parseFloat(totalBrutto - totalNetto).toFixed(2)
    document.getElementById('total-brutto').value = totalBrutto.toFixed(2)
}