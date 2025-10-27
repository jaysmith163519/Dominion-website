const { text } = require("express")

let today = new Date()
let day = new Date().getFullYear()
console.log(today)
let birthdaydate = "2025-10-20T08:28:22.935Z"
let birthday = new Date(birthdaydate).getDate()
console.log(birthday)
let option = [{ text: "Happy Birthday", votes: [{ james: 1 }] }, { text: "Merry Christmas", votes: [{ esther: 1 }, { mwangi: 1 }] }]
let vote = option.forEach(votes => {
    let text = votes.text
    let vot = votes.votes.length;
    let tot = { text, vot }
    console.log(tot)


})
console.log(vote)


