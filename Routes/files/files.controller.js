const { isLoggedInFile } = require('../../MiddleWares/isLoggedInFile');
const { checkRequiredFields, checkRequiredHeaders, checkRequiredQueries } = require('../../MiddleWares/MiddleWares');
const FilesController = require('express').Router();
const FilesService = require('./files.service');

//Get All Documents
FilesController.get('/create-file', checkRequiredFields(['title']), isLoggedInFile, FilesService.FetchAllFilesService);
//Get Files By ID
FilesController.get('/:id', FilesService.FetchSingleFilesService)


//Create Files
FilesController.post('/', FilesService.CreateFilesService)


//UpdateFiles by ID
FilesController.patch('/:id', FilesService.UpdateFilesService)

//DeleteAllFiles
FilesController.delete('/', FilesService.DeleteAllFilesService)

//DelectFiles by Id
FilesController.delete('/:id', FilesService.DeleteSingleFilesService)

module.exports = FilesController;