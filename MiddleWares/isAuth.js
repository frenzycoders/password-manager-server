const { PasswordManager } = require("../Routes/models/password_models");

const isAuth = async (req, res, next) => {
    let key = req.headers['x-key'];
    console.log(key);
    try {
        let user = await PasswordManager.findOne({ key: key });
        if (!user) return res.status(404).send({ message: "Token expire please logout and login again" });
        else {
            req.user = user;
            req.key = key;
            next();
        }
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
}

module.exports = {
    isAuth
}