const state = {
    buttonListLeft: document.querySelector('.converter__list--left'),
    buttonListRight: document.querySelector('.converter__list--right'),
    initialCurrency: 'EUR',
    secondaryCurrency: 'USD',
    selectLeft: document.querySelector('.converter__list-select'),
    selectRight: document.querySelector('.converter__list-select--right'),
    URL: 'https://www1.oanda.com/rates/api/v2/rates/spot.json',
    API_KEY: 'sJdI0ater0rUIYOTFdUo6pY1',
    rateLeftText: document.querySelector('.converter--left .converter__current-rate'),
    rateRightText: document.querySelector('.converter--right .converter__current-rate'),
    inputLeft: document.querySelector('.converter--left .converter__input'),
    inputRight: document.querySelector('.converter--right .converter__input'),
    rateLeftToRight: null,
    rateRightToLeft: null,
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
    if (state.initialCurrency === state.secondaryCurrency) {
        // currencies are equal

        // should renew 2spans + right input
        state.rateLeftToRight = 1
        state.rateLeftText.innerHTML = `1 ${state.initialCurrency} = 1 ${state.secondaryCurrency}`
        state.rateRightText.innerHTML = `1 ${state.initialCurrency} = 1 ${state.secondaryCurrency}`
        state.inputRight.value = state.inputLeft.value
    } else {
        fetch(`${state.URL}?api_key=${state.API_KEY}&base=${state.initialCurrency}&quote=${state.secondaryCurrency}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                state.rateLeftToRight = Number(data.quotes[0].midpoint).toFixed(2)
                state.rateLeftText.innerHTML = `1 ${state.initialCurrency} = ${data.quotes[0].midpoint} ${state.secondaryCurrency}`
                state.inputRight.value = (parseInt(state.inputLeft.value) * Number(data.quotes[0].midpoint)).toFixed(2)
            })
    }
}

fetchData()

state.inputLeft.addEventListener('input', (event) => {
    state.inputRight.value = (parseInt(state.inputLeft.value) * state.rateLeftToRight)
    console.log(parseInt(state.inputLeft.value), state.rateLeftToRight)
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