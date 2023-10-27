const fetch = require("node-fetch")

const fetchJson = async (url) => {
let response = await fetch(url, {
  method: "get",
  body: null,
})

let data = await response.json()
return data
}

module.exports = { fetchJson }