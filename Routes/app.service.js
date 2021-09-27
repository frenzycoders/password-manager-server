const { PasswordManager } = require("./models/password_models");
const randomString = require('randomstring');
const { createOtp } = require('./../crateOtp');
const { sendMail } = require('./../mailGateWay');
const redis = require('./../redis');
const { PasswordModel } = require("./models/passwords");
const { exists } = require("./../redis");
class AppServices {

    //Fetch All
    async createSpace(req, res) {
        try {
            let { email } = req.body;
            let user = await PasswordManager.findOne({ email: email });
            let key = email + '--' + Date.now().toString() + '--' + randomString.generate();
            if (!user) {
                let otp = createOtp();
                await redis.set(email, otp, 'EX', 10 * 60 * 5);
                await sendMail([email], { subject: "Account Verification", text: `Your one time password for verification is ${otp}` });
                user = await PasswordManager.create({ email, key });
                return res.status(201).send({ message: "Created Verify Please.", email, id: user._id, key: 'N' });
            } else {
                let otp = createOtp();
                user.key = key;
                await user.save();
                await redis.set(user.email, otp, 'EX', 10 * 60 * 5);
                await sendMail([user.email], { subject: "Account Verification", text: `Your one time password for verification is ${otp}` });
                return res.status(200).send({ id: user._id, key: 'N', email: user.email, message: "Verify Please." });
            }
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async verifyIdentity(req, res) {
        try {
            let { email, otp } = req.params;
            let redisToken = await redis.get(email);
            if (redisToken && otp && redisToken == otp) {
                let user = await PasswordManager.findOneAndUpdate({ email: email }, { status: true });
                user.status = true;
                await sendMail([email], { subject: "New Login Request", text: "`Dear User someone logged in your account." });
                redis.del(email);
                return res.status(200).send({ id: user._id, key: user.key, email: user.email, message: "Created" });
            }
            res.status(404).send({ message: "Wrong otp" });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async fetchAllPassword(req, res) {
        try {
            await req.user.populate('passwords').execPopulate();
            res.status(200).send({ passwords: req.user.passwords });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async deletePassword(req, res) {
        try {
            let { id } = req.params;
            if (!req.user.passwords.includes(id)) return res.status(404).send({ message: "This Password is not attach with your profile." });
            let oldList = req.user.passwords;
            let list = [];
            oldList.forEach((e) => {
                if (e.toString() !== id.toString()) list.push(e);
                else console.log(e);
            })
            req.user.passwords = list;
            await req.user.save();
            await PasswordModel.findByIdAndDelete(id);
            await req.user.populate('passwords').execPopulate();
            res.status(200).send({ passwords: req.user.passwords, message: "Deleted" });
        } catch (error) {
            
            res.status(500).send({ message: error.message })
        }
    }

    async deleteMultiple(req, res) {
        try {

            let { ids } = req.body;
            ids = JSON.parse(ids);
            
            let exist = [];
            let notExist = [];
            ids.forEach((e) => {
            
                if (req.user.passwords.includes(e)) {
                    req.user.passwords.pop(e)
                    exist.push(e);
                } else notExist.push(e);
            })
            let result = await PasswordModel.deleteMany({ _id: exist });
            
            await req.user.save();
            res.status(200).send({ message: "Passwords Deleted", id: result, deletedIds: exist, notExist });
        } catch (error) {
           
            res.status(500).send({ message: error.message });
        }
    }

    async updatePassword(req, res) {
        try {
            let { id } = req.params;
            if (!req.user.passwords.includes(id)) res.status(404).send({ message: "The Password you want to update is not yours." });
            let result = await PasswordModel.findByIdAndUpdate(id, req.body);
            res.status(200).send({ message: "Updated", result });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async updateMultiple(req, res) {
        try {
            let { data } = req.body;
            data = JSON.parse(data);

            let exist = [];
            let notExist = [];
            data.forEach(async (e) => {
                if (req.user.passwords.includes(e._id)) {
                    await PasswordModel.updateMany({ _id: e._id }, {
                        "title": e.title,
                        "username": e.username,
                        "password": e.password,
                        "click": e.click,
                        "important": e.important,
                        "createdAt": e.createdAt,
                        "updatedAt": e.updatedAt,
                    });
                } else notExist.push(e);
            })
            res.status(200).send({ message: "Password Updated", });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async updateClick(req, res) {
        try {
            let { id, click } = req.body;
            if (!req.user.passwords.includes(id)) res.status(404).send({ message: "The Password you want to update is not yours." });
            await PasswordModel.findByIdAndUpdate(id, { click });
            res.status(200).send({ message: "Updated" });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
    async syncPasswords(req, res) {
        try {
            let { data } = req.body;
            if (data.length > 0) {
                let passwords = await PasswordModel.insertMany(data)
                const pwdid = passwords.map((p) => {
                    return { _id: p._id, id: p.id };
                })
                req.user.passwords = [...req.user.passwords, ...pwdid];
                await req.user.save();
                await req.user.populate('passwords').execPopulate();
                return res.status(201).send({ message: "Created.", passwords: req.user.passwords, updatedPasswords: pwdid });
            }
            await req.user.populate('passwords').execPopulate();
            res.status(200).send({ passwords: req.user.passwords });

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }

    async createPassword(req, res) {
        try {
            let password = await PasswordModel.create(req.body);
            req.user.passwords = [...req.user.passwords, password._id];
            await req.user.save();
            res.status(201).send({ password, message: "Password Created" });

        } catch (error) {
            res.status(500).send(error.message);
        }
    }

    async getMyProfile() {
        try {
            let user = await req.user.populate('passwords').execPopulate();
            res.status(200).send({ email: user.email, key: user.key, passwords: user.passwords });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
}

const appService = new AppServices();
module.exports = appService;