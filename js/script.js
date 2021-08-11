const state = {
    buttonListLeft: document.querySelector('.converter__list--left'),
    buttonListRight: document.querySelector('.converter__list--right'),
    selectLeft: document.querySelector('.converter__list-select'),
    selectRight: document.querySelector('.converter__list-select--right'),
    rateLeftText: document.querySelector('.converter--left .converter__current-rate'),
    rateRightText: document.querySelector('.converter--right .converter__current-rate'),
    inputLeft: document.querySelector('.converter--left .converter__input'),
    inputRight: document.querySelector('.converter--right .converter__input'),
    buttonArrows: document.querySelector('.arrows'),
    modal: document.querySelector('.modal'),

    URL: 'https://www1.oanda.com/rates/api/v2/rates/spot.json',
    API_KEY: 'sJdI0ater0rUIYOTFdUo6pY1',

    initialCurrency: 'RUB',
    secondaryCurrency: 'USD',
    rateLeftToRight: null,
    rateRightToLeft: null,
    flagAPI: false,
}

state.buttonListLeft.addEventListener('click', (event) => {
    if (event.target.classList.contains('converter__list-button')) {
        state.buttonListLeft.querySelectorAll('.converter__list-button').forEach((el) => {
            el.classList.remove('converter__list-button--active')
        })
        event.target.classList.add('converter__list-button--active')
        state.initialCurrency = event.target.innerText
        fetchData(state.initialCurrency)
        state.selectLeft.classList.remove('converter__list-select--active')
    }
})

state.buttonListRight.addEventListener('click', (event) => {
    if (event.target.classList.contains('converter__list-button')) {
        state.buttonListRight.querySelectorAll('.converter__list-button').forEach((el) => {
            el.classList.remove('converter__list-button--active')
        })
        event.target.classList.add('converter__list-button--active')
        state.secondaryCurrency = event.target.innerText
        fetchData(state.secondaryCurrency)
        state.selectRight.classList.remove('converter__list-select--active')
    }
})

const fetchData = async (currency) => {
    console.log(currency)
    state.flagAPI = false
    if (state.initialCurrency === state.secondaryCurrency) {
        // currencies are equal

        // should renew 2spans + right input
        state.rateLeftToRight = 1

        // вызвать функцию перерисовки чтобы обновить данные
        dataRender();

        state.inputRight.value = state.inputLeft.value
    } else try {
        // setTimeout(() => {
        //     if (!state.flagAPI) {
        //         state.modal.classList.remove('modal--hide')
        //     }
        // }, 500)
        const response = await fetch(`${state.URL}?api_key=${state.API_KEY}&base=${state.initialCurrency}&quote=${state.secondaryCurrency}`)
        const data = await response.json()
        console.log(data);
        // получаем актуальный курс
        state.rateLeftToRight = Number(data.quotes[0].midpoint)
        // вызываем ф-ию которая считает по этому курсу и обновляет данные
        const responseRight = await fetch(`${state.URL}?api_key=${state.API_KEY}&base=${state.secondaryCurrency}&quote=${state.initialCurrency}`)
        const dataRight = await responseRight.json()
        state.rateRightToLeft = Number(dataRight.quotes[0].midpoint)
        dataRender();
        state.flagAPI = true
    } catch (error) {
        console.log(error)
        state.modal.classList.remove('modal--hide')
    }
}



// функция которая обновляет данные в инпутах и в спанах

const dataRender = () => {
    // принимать новые значения для 2х спанов и 2х инпутов

    // обновлять значения

    // кейс когда валюты равны
    if (state.initialCurrency === state.secondaryCurrency) {
        state.rateLeftText.innerHTML = `1 ${state.initialCurrency} = 1 ${state.secondaryCurrency}`
        state.rateRightText.innerHTML = `1 ${state.initialCurrency} = 1 ${state.secondaryCurrency}`
    } else {
        // кейс когда валюты не равны

        state.rateLeftText.innerHTML = `1 ${state.initialCurrency} =  ${state.rateLeftToRight} ${state.secondaryCurrency}`
        state.rateRightText.innerHTML = `1 ${state.secondaryCurrency} =  ${state.rateRightToLeft} ${state.initialCurrency}`

        state.inputRight.value = (parseInt(state.inputLeft.value) * Number(state.rateLeftToRight)).toFixed(2)
    }
}

fetchData()

state.inputLeft.addEventListener('input', (event) => {
    console.log(parseInt(state.inputLeft.value), state.rateLeftToRight)
    state.inputLeft.value === '' ? state.inputRight.value = '' : state.inputRight.value = (parseInt(state.inputLeft.value) * state.rateLeftToRight).toFixed(2)
})

state.inputRight.addEventListener('input', (event) => {
    state.inputRight.value === '' ? state.inputLeft.value = '' :  state.inputLeft.value = (parseInt(state.inputRight.value) * state.rateRightToLeft).toFixed(2)
})

state.selectLeft.addEventListener('change', (event) => {
    state.buttonListLeft.querySelectorAll('.converter__list-button').forEach((el) => {
        el.classList.remove('converter__list-button--active')
    })
    state.initialCurrency = state.selectLeft.value
    event.target.classList.add('converter__list-select--active')
    fetchData(state.initialCurrency)
})

state.selectRight.addEventListener('change', (event) => {
    state.buttonListRight.querySelectorAll('.converter__list-button').forEach((el) => {
        el.classList.remove('converter__list-button--active')
    })
    state.secondaryCurrency = state.selectRight.value
    event.target.classList.add('converter__list-select--active')
    fetchData(state.secondaryCurrency)
})

state.buttonArrows.addEventListener('click', () => {
    state.inputLeft.value = state.inputRight.value
    dataRender()
})

state.modal.addEventListener('click', (event) => {
    event.target.classList.add('modal--hide')
})