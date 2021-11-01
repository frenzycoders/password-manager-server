const FilesModel = require('./files.model');
class FilesService {

    //Create Files
    async CreateFilesService(req, res) {
        res.status(200).send({ msg: "CreateFilesService" })
    }

    //Fetch All Files
    async FetchAllFilesService(req, res) {
        res.status(200).send({ msg: "FetchAllFilesService" })
    }

    //Fetch SIngle Files
    async FetchSingleFilesService(req, res) {
        res.status(200).send({ msg: "FetchSingleFilesService" })
    }

    //Delete All Files Service
    async DeleteAllFilesService(req, res) {
        res.status(200).send({ msg: "DeleteAllFilesService" })
    }

    //Delete Single Files Service
    async DeleteSingleFilesService(req, res) {
        res.status(200).send({ msg: "DeleteSingleFilesService" })
    }

    //Update Files Service
    async UpdateFilesService(req, res) {
        res.status(200).send({ msg: "UpdateFilesService" })
    }
}

const Files = new FilesService();
module.exports = Files;