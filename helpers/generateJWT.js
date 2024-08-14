const jwt = require('jsonwebtoken')

const generateJWT = ( uid, name ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid, name };
        jwt.sign(payload, process.env.PRIVATE_KEY,{
            expiresIn: '1h'
        },(err, token) => {
            if(err){
                reject(err)
                console.log('The token could not be generated');
            }
            else{
                resolve(token)
            }
        })
    })
}

module.exports = {
    generateJWT
}