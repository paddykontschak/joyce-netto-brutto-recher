import { currencyPattern, validations, updateValidations } from './global.js'

export function addRow(el) {
    // increase row number
    const row = Date.now() + Math.random().toString(36).substr(2, 9)

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
                <input type="text" id="netto-${row}" placeholder="0.00" />
            </div>
        </div>
        <div class="label" data-label="Mwst">
            <select id="mwst-${row}">
                <option value="0">0%</option>
                <option value="7">7%</option>
                <option value="19">19%</option>
            </select>
        </div>
        <div class="label" data-label="Preis brutto">
            <div class="currency-input">
                <input type="text" id="brutto-${row}" placeholder="0.00" />
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

export function currencyValidator({value, id}) {
    // if input is a digit or period add new value to validation
    // else force input value to be the last valid value
    if (currencyPattern.test(value)) {
        updateValidations(id, value)
    } else {
        value = validations[id]
    }
}

export function calculate({value, id}, from, mwst) {
    // figure out which row we're on
    // generate id names
    // set initial values
    const currentRow = mwst ? id.replace('mwst-','') : id.replace(`${from}-`,'')
    const mwstId = `#mwst-${currentRow}`
    const nettoId = `#netto-${currentRow}`
    const bruttoId = `#brutto-${currentRow}`
    // || 0 makes sure the calculation doesn't return NaN
    const sourceValue = mwst ? parseFloat(document.querySelector(nettoId).value) || 0 : parseFloat(value) || 0
    let totalNetto = 0
    let totalBrutto = 0

    // calculate netto and brutto
    // both mwst and netto calculate brutto
    if (mwst || from === 'netto') {
        mwst = mwst ? parseFloat(mwst) || 0 : parseFloat(document.querySelector(mwstId).value) || 0
        document.querySelector(bruttoId).value = parseFloat(sourceValue + ((sourceValue / 100) * mwst)).toFixed(2)
    } else {
        mwst = parseFloat(document.querySelector(mwstId).value) || 0
        document.querySelector(nettoId).value = parseFloat(sourceValue / (1 + (mwst / 100))).toFixed(2)
    }

    // calculate totals
    Object.values(document.querySelectorAll('[id^="netto-"]')).map((netto) => totalNetto += parseFloat(netto.value) || 0)
    Object.values(document.querySelectorAll('[id^="brutto-"]')).map((brutto) => totalBrutto += parseFloat(brutto.value) || 0)

    document.getElementById('total-netto').value = totalNetto.toFixed(2)
    document.getElementById('total-mwst').value = parseFloat(totalBrutto - totalNetto).toFixed(2)
    document.getElementById('total-brutto').value = totalBrutto.toFixed(2)
}