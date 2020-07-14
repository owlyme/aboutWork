let dataTypes = [
  undefined,
  null,
  "string",
  123,
  {},
  true,
  Symbol()
]


dataTypes.forEach(i => {
  console.log("typeof ", i,  " => "  + typeof i)
})
// typeof  undefined  => undefined
// typeof  null  => object
// typeof  string  => string
// typeof  123  => number
// typeof  {}  => object
// typeof  true  => boolean
// typeof  Symbol()  => symbol