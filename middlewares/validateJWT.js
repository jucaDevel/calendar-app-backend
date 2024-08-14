const { verify } = require('jsonwebtoken');
const { response } = require('express');

const validateJWT = (req, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'NO_TOKEN'
        })
    }

    try {
        const { uid, name } = verify(token, process.env.PRIVATE_KEY);

        req.uid = uid;
        req.name = name

    } catch (error) {
        // console.log(error);
        return res.status(401).json({
            ok:false,
            msg:'INVALID_TOKEN'
        })
    }

    next();
}

module.exports = {
    validateJWT
}