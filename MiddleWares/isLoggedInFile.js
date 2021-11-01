const { PasswordManager } = require("../Routes/models/password_models");

const isLoggedInFile = async (req, res, next) => {
    let key = req.headers['x-key'];
    if (!key) {
        req.login = false;
        req.user = {};
        next();
    } else {
        try {
            let user = await PasswordManager.findOne({ key: key });
            if (!user) {
                req.login = false;
                req.user = {};
                next();
            }
            else {
                req.user = user;
                req.key = key;
                req.login = true;
                next();
            }
        } catch (error) {
            res.status(500).send({ message: "Server error" });
        }
    }

}

module.exports = {
    isLoggedInFile
}