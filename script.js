const currencies = ['RUB', 'USD', 'EUR', 'GBP'];

const formatter = (value, seperater) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperater);
}

const uri = 'https://api.exchangerate.host/latest';

const exchange = async(value, variables) => {

    let url = new URL(uri);

    
    url.searchParams.append('base', variables[0]);
    url.searchParams.append('symbols', variables[1]);

    let data;

    await fetch(url.href).then(res => {
        if (res.ok) {
            return res.json();
        }
    }).then(({ rates }) => {
        data = Object.entries(rates)[0][1];
    });

    let result = parseFloat(value) * data;
    if (isNaN(result)) {
        result = '';
    }

    return {
        result: result,
        currency: data,
    };
}

const inp = document.querySelector('input[type="text"]');

async function getCurrency() {
    let curreny_1 = document.querySelector('[name=currency1]:checked');
    let curreny_2 = document.querySelector('[name=currency2]:checked');

    let currencies = [
        curreny_1.value,
        curreny_2.value,
    ];
    let value = inp.value.replaceAll(' ', '');
    let result = await exchange(value, currencies);
    const val = parseFloat(result.result.toString().replaceAll(' ', ''));
    const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 });
    let value11 = isNaN(formatter.format(val)) ? '' : formatter.format(val);
    document.querySelector('.right_value').value = value11;
    document.querySelector('.right_text').innerHTML = `1 ${currencies[1]} = ${(1 / result.currency).toFixed(4)} ${currencies[0]}`;
    document.querySelector('.left_text').innerHTML = `1 ${currencies[0]} = ${result.currency.toFixed(4)} ${currencies[1]}`;
}



inp.addEventListener('input', async(e) => {
    getCurrency();
});

let radios = document.querySelectorAll('input[type="radio"]');

[...radios].forEach(radio => {
    radio.addEventListener('change', async(e) => {
        getCurrency();
    });
});

window.addEventListener('load', async() => {
    await getCurrency();
})