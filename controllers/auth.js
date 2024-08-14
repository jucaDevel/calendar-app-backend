const { response } = require("express");
const { generateJWT } = require("../helpers/generateJWT");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const { googleVerify } = require("../helpers/verifyGoogleToken");


const getAllUsers = async (req = request, res = response) => {
    try {
        const users = await User.find({},'-password')
        if(users.length === 0){
            res.status(400).json({
                ok: false,
                msg:'No hay eventos'
            })    
        }
        else{
            res.status(200).json({
                ok: true,
                data: users
            })
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg:'ERROR_OCURRED'
        })
    }
}

const createUser = async (req, res = response) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'USER_EXISTS'
            })
        };

        user = new User( req.body );
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = await generateJWT(user.id, user.name);

        return res.status(200).json({
            ok: true,
            msg: 'USER_CREATED',
            data: user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg: 'ERROR_OCURRED'
        });
    }
}

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'USER_NOT_EXISTS'
            })
        };

        const validPassword = bcrypt.compareSync( password, user.password )
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'INCORRECT_PASSWORD'
            })
        }

        const token = await generateJWT(user.id, user.name);

        return res.status(200).json({
            ok: true,
            msg: 'USER_LOGGED',
            data:user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg: 'ERROR_OCURRED'
        });
    }
}

const revalidateToken = async (req, res = response) => {
    const { uid, name } = req;

    try {
        //Generate JWT
        const token = await generateJWT(uid, name);

        res.status(200).json({
            ok: true,
            data: { uid, name },
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'ERROR_OCURRED',
        })
    }
}

const googleSignIn = async (req, res = response ) => {
    const { authCode, password, isRegister } = req.body;
    try {
        const { email, name } = await googleVerify( authCode );
        if(!email){
            return res.status(400).json({
                msg:'ERROR',
            })    
        }
        let user = await User.findOne({email})
        if(!user && isRegister){

            const newDataUser = {
                name,
                email,
                password
            }

            user = new User( newDataUser )

            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);

            await user.save()
        }
        else if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'USER_NOT_EXISTS'
            });
        }

        const token = await generateJWT(user.id, user.name);

        return res.status(200).json({
            ok: true,
            msg: 'USER_LOGGED',
            data:user,
            token
        });


    } catch (error) {
        return res.status(400).json({
            msg:'ERROR',
            error
        })
    }
}

module.exports = {
    createUser,
    login,
    revalidateToken,
    googleSignIn,
    getAllUsers
}