const state = {
    buttonListLeft: document.querySelector('.converter__list--left'),
    buttonListRight: document.querySelector('.converter__list--right'),
    initialCurrency: 'EUR',
    secondaryCurrency: 'USD',
    selectLeft: document.querySelector('.converter__list-select'),
    selectRight: document.querySelector('.converter__list-select--right'),
    URL: 'http://api.exchangeratesapi.io/v1/latest',
    API_KEY: '5249425ddee3e46303c2e3aeca06484d',
    rateLeftText: document.querySelector('.converter--left .converter__current-rate'),
    rateRightText: document.querySelector('.converter--right .converter__current-rate'),
    inputLeft: document.querySelector('.converter--left .converter__input'),
    inputRight: document.querySelector('.converter--right .converter__input'),
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

const fetchData = (currency) => {
    console.log(currency)
    fetch(`${state.URL}?access_key=${state.API_KEY}&base=${state.initialCurrency}&symbols=${state.secondaryCurrency}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            state.rateLeftText.innerHTML = `1 ${state.initialCurrency} = ${data.rates[state.secondaryCurrency]} ${state.secondaryCurrency}`
            state.inputRight.value = parseInt(state.inputLeft.value) * Number(data.rates[state.secondaryCurrency])
        })
}

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