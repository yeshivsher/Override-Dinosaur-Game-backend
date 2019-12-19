function getFunction() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({a: 'a', b: 'b'});
        }, 1000)
    })

    return promise;
}

module.exports = {
    getFunction
}