function orderTotal(fetch , order) {
    fetch('https://vatapi.com/v1/country-code-check?code=' + order.country)
     .then(response => response.json())
     .then(data => data.rates.standard.value)
     .then(vat => order.items.reduce((prev, cur) => 
        cur.price * (cur.quantity || 1)+ prev,0)* vat)
    return Promise.resolve(order.items.reduce((prev, cur)=>
     cur.price * (cur.quantity || 1) + prev, 0))  
}

module.exports = orderTotal