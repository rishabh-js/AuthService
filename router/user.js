const express = require("express");
const router = express.Router();
const UserModel = require('./../model/user.model');
const getHashedPass = require("../middlewares/hashedPass");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../constants");

//getAll user names
router.get('/', async function(req, res, next){
    const {pageNo, pageSize} = req.query;
    const first = (pageNo - 1)*pageSize;
    const last = pageNo*pageSize;
    try {
        if(!pageNo || !pageSize) {
            res.status(400);
            throw new Error('Required contract doesn\'t match. Please connect with Administrator');
        }
        const users = await UserModel.find({});
        res.status(200).send({
            data: users.slice(first, last),
            total: users.length 
        });
    } catch(e) {
        next(e);
    }
});

//create User
router.post('/', getHashedPass, async function(req, res, next) {
    const { body: {name, email, password} } = req; 
    const payload = {name, email, password};
    try {
        await UserModel.create(payload);
        res.status(201).send({operation: 'Success'});
    } catch(e) {
        res.status(400);
        next(e);
    }
});

//update user
router.put('/:id', getHashedPass, async function(req, res, next) {
    const { id } = req.params;
    const { body: {name, password} } = req;
    const payload = {name, password };
    try {
        if(!id) {
            res.status(400);
            throw new Error('Required contract doesn\'t matches. Please contact Administrator');
        }
        const user = await UserModel.findByIdAndUpdate({_id: id}, payload);
        if(user) {
            res.status(200).send({operation: 'Success'});
        } else {
            res.send({operation: 'Failure'});
        }
    } catch(e) {
        next(e);
    }
});

//delete user
router.delete('/:id', async function(req, res, next) {
    const { id } = req.params;
    try {
        if(!id) {
            throw new Error('Required contract doesn\'t matches. Please contact Administrator');
        }
        const user = await UserModel.findByIdAndDelete({_id: id});
        if(user) {
            res.send({operation: 'Success'});
        } else {
            res.send({operation: 'Failure'});
        }
    } catch(e) {
        next(e);
    }
});


//user signIn
router.post('/signIn', async function(req, res, next) {
    const {body: {email, password}} = req;
    try {
        const user = await UserModel.findOne({email});
        const result = await bcrypt.compare(password, user.password);
        if(user && result) {
            const token = jwt.sign({ name: user.name }, JWT_PRIVATE_KEY,  { expiresIn: 60 * 60 });
            res.cookie("tkn", token, {
                httpOnly: true,
                sameSite: 'strict'
            });
            res.send({operation: 'success'});
        } else {
            res.send({operation: 'failure', response: 'Bad Credentials'});
        }
    } catch(e) {
        next(e);
    }
});

module.exports = router;
