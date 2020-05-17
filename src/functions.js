import { currencyPattern, validations, updateValidations, row, incrementRow } from './global.js'

export function addRow(el) {
    // increase row number
    incrementRow()

    // row div#row
    const newRow = document.createElement('div')
          newRow.className = 'row'

    // leistung div.label > input
    const leistungLabel = document.createElement('div')
          leistungLabel.className = 'label'
          leistungLabel.setAttribute('data-label', 'Leistung')
    const leistungInput = document.createElement('input')
          leistungInput.type = 'text'
    leistungLabel.appendChild(leistungInput)

    // objekt div.label > select > option
    const objectLabel = document.createElement('div')
          objectLabel.className = 'label'
          objectLabel.setAttribute('data-label', 'Objekt')
    const objectSelect = document.createElement('select')
    for (let index = 0; index < 2; index++) {
        const option = document.createElement('option')
        objectSelect.appendChild(option)
    }
    objectLabel.appendChild(objectSelect)

    // netto div.label > div.currency-input > input#row-N-netto
    const nettoLabel = document.createElement('div')
          nettoLabel.className = 'label'
          nettoLabel.setAttribute('data-label', 'Preis netto')
    const nettoWrapper = document.createElement('div')
          nettoWrapper.className = 'currency-input'
    nettoLabel.appendChild(nettoWrapper)
    const nettoInput = document.createElement('input')
          nettoInput.id = `row-${row}-netto`
          nettoInput.type = 'text'
          nettoInput.placeholder = '0.00'
    nettoWrapper.appendChild(nettoInput)

    // mwst div.label > select#row-N-mwst > option
    const mwstLabel = document.createElement('div')
          mwstLabel.className = 'label'
          mwstLabel.setAttribute('data-label', 'Mwst')
    const mwstSelect = document.createElement('select')
          mwstSelect.id = `row-${row}-mwst`
    const mwst0 = document.createElement('option')
          mwst0.value = 0
    const mwst0text = document.createTextNode('0%')
    mwst0.appendChild(mwst0text)
    mwstSelect.appendChild(mwst0)
    const mwst7 = document.createElement('option')
          mwst7.value = 7
    const mwst7text = document.createTextNode('7%')
    mwst7.appendChild(mwst7text)
    mwstSelect.appendChild(mwst7)
    const mwst19 = document.createElement('option')
          mwst19.value = 19
    const mwst19text = document.createTextNode('19%')
    mwst19.appendChild(mwst19text)
    mwstSelect.appendChild(mwst19)
    mwstLabel.appendChild(mwstSelect)

    // brutto div.label > div.currency-input > input#row-N-brutto
    const bruttoLabel = document.createElement('div')
          bruttoLabel.className = 'label'
          bruttoLabel.setAttribute('data-label', 'Preis brutto')
    const bruttoWrapper = document.createElement('div')
          bruttoWrapper.className = 'currency-input'
    const bruttoInput = document.createElement('input')
          bruttoInput.id = `row-${row}-brutto`
          bruttoInput.type = 'text'
          bruttoInput.placeholder = '0.00'
    bruttoWrapper.appendChild(bruttoInput)
    bruttoLabel.appendChild(bruttoWrapper)

    // trash div.label > i.remove-row
    const trashLabel = document.createElement('div')
          trashLabel.className = 'label'
          trashLabel.setAttribute('data-label', 'Entfernen')
    const trashButton = document.createElement('i')
          trashButton.className = 'far fa-trash-alt remove-row'
    trashLabel.appendChild(trashButton)

    // merge it all together
    newRow.appendChild(leistungLabel)
    newRow.appendChild(objectLabel)
    newRow.appendChild(nettoLabel)
    newRow.appendChild(mwstLabel)
    newRow.appendChild(bruttoLabel)
    newRow.appendChild(trashLabel)

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
    const value = mwst ? parseFloat(document.querySelector(nettoId).value) || 0 : parseFloat(el.value) || 0
    let totalNetto = 0
    let totalBrutto = 0
    
    // calculate netto and brutto
    if (mwst || from === 'netto') {
        mwst = mwst ? parseFloat(mwst) || 0 : parseFloat(document.querySelector(mwstId).value) || 0
        document.querySelector(bruttoId).value = parseFloat(value + ((value / 100) * mwst)).toFixed(2)
    } else {
        mwst = parseFloat(document.querySelector(mwstId).value) || 0
        document.querySelector(nettoId).value = parseFloat(value / (1 + (mwst / 100))).toFixed(2)
    }

    // calculate totals
    for (let index = 0; index < document.querySelectorAll('[id^="row-"][id$="-netto"]').length; index++) {
        const netto = document.querySelectorAll('[id^="row-"][id$="-netto"]')[index];
        totalNetto += parseFloat(netto.value) || 0
    }

    for (let index = 0; index < document.querySelectorAll('[id^="row-"][id$="-brutto"]').length; index++) {
        const brutto = document.querySelectorAll('[id^="row-"][id$="-brutto"]')[index];
        totalBrutto += parseFloat(brutto.value) || 0
    }

    document.getElementById('total-netto').value = totalNetto.toFixed(2)
    document.getElementById('total-mwst').value = parseFloat(totalBrutto - totalNetto).toFixed(2)
    document.getElementById('total-brutto').value = totalBrutto.toFixed(2)
}