const orderTotal = require('./orderTotal')

const emptyFunction = null

it('calls vaptapi.com correctly', () => {
    let isFakeFetchCalled = false
    const fakeProcess = {
      env: {
        VAT_API_KEY: 'key123'
      }
    }
    const fakeFetch = (url, opts) => {

        expect(opts.headers.apikey).toBe('key123')
        expect(url).toBe('https://vatapi.com/v1/country-code-check?code=DE')
        isFakeFetchCalled = true
        return Promise.resolve({
          json: () => Promise.resolve({
            rates: {
              standard:{
                 value: 19
              }
            }
          }) 
        })
    }
    return orderTotal(fakeFetch, fakeProcess,{
        country: 'DE',
        items: [
            { 'name': 'Dragon Waffles', price: 20, quantity: 2 }
        ]
    }).then(result => {
      expect(result).toBe(20*2*1.19)
        expect(isFakeFetchCalled).toBe(true)
    })
})

it('Quantity',() =>
  orderTotal(null, null,{
      items:[
          { name: 'Dragon candy', price: 2, quantity: 3}
      ]
  }).then(result => expect(result).toBe(6)))

it('No quantity specified', () =>
  orderTotal(null,null, {
      items:[
          {'name':'Dragon candy',price: 3}
      ]
  }).then(result => expect(result).toBe(3))
)  

it('Happy path (Example 1)', ()=>
  orderTotal(null, null, {
    items:[
        { name:'Dragon food', price: 8, quantity: 1},
        { name:'Dragon cage (small)', price: 800 , quantity:1}
    ]    
  }).then(result => expect(result).toBe(808))
)

it('Happy path (Example 2)', () =>
  orderTotal(null,null, {
    items:[
        { name:'Dragon collar', price: 20, quantity: 1 },
        { name:'Dragon chew toy', price: 40, quantity: 1}
    ]  
  }).then(result => expect(result).toBe(60))
)


// if(orderTotal({
//     items:[
//         { name:'Dragon candy', price: 2, quantity: 3 }
//     ]
// }) !==6){
//     throw new Error('Check fail: Quantity');
    
// }
// if(orderTotal({
//     items:[
//         { name:'Dragon candy', price: 3}
//     ]
// })!==3){
//     throw new Error('Check fail: No quantity specified')
// }
// if(orderTotal({
//     items:[
//         { name:'Dragon food', price: 8, quantity: 1},
//         { name:'Dragon cage (small)', price: 800 , quantity:1}
//     ]    
// }) !== 808){
//     throw new Error('Check fail: Happy path (Example 1)')
// }

// if(orderTotal({
//     items:[
//         { name:'Dragon collar', price: 20, quantity: 1 },
//         { name:'Dragon chew toy', price: 40, quantity: 1}
//     ]    
// }) !== 60){
//     throw new Error('Check fail: Happy path (Example 2)')
// }
