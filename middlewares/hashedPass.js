const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../constants");

async function getHashedPass(req, res, next) {
    const { body: { password } } = req; 
    console.log(password);
    try {
        if(password?.length && password?.trim()) {
            const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
            console.log('hashedPass=====',hashedPass)
            req.body.password = hashedPass;
        }
        next();
    } catch (e) {
        next(e)
    }
}

module.exports = getHashedPass;