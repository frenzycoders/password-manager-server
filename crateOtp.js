const createOtp = () => {
    let number = Math.floor(Math.random() * 1000000)
    if (number < 100000) number += 100000
    return number
}


module.exports = { createOtp }