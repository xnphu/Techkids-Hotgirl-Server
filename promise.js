// const promiseExp = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(function() {
//             resolve("Trả tiền")
//         }, 5000)
//         setTimeout(function() {
//             reject("K trả tiền")
//         }, 3000)
//     })
// }

// promiseExp()
//     .then((data) => {
//         console.log(data)
//     })
//     .catch((err) => {
//         console.log("Error: ", err);
//     })

const muaRau = (money) => new Promise((resolve, reject) => {
    if (money > 10000) {
        resolve("Rau cua chau day")
    } else reject("D ban nhe!");
})

const anRau = () => new Promise((resolve, reject) => {
    setTimeout(function () {
        resolve("An xong roi")
    }, 5000)
})

//Bất đồng bộ
// console.log("Bat dau mua rau")
// muaRau(10001)
//     .then((reponse) => {
//         console.log(reponse)
//         return anRau()
//     })
//     .then((auRau_response) => {
//         console.log(auRau_response)
//     })
//     .catch((err) => {
//         console.log("Error: ", err);
//     })
// console.log("Xong!")

const asyncFunction = async () => {
    try {
        console.log("Bat dau mua rau")
        await muaRau(10001)
        console.log("Da co rau");
        await anRau()
        console.log("Xong!")
    } catch (error) {
        console.log("Error: ", err)
    }
}
asyncFunction()
