const appController = require('express').Router();
const { isAuth } = require('../MiddleWares/isAuth');
const { checkRequiredFields, checkRequiredHeaders, checkRequiredQueries } = require('../MiddleWares/MiddleWares');
const AppServices = require('./app.service');

appController.get('/me', checkRequiredHeaders(['x-key']), isAuth, AppServices.getMyProfile);
appController.post('/create-space', checkRequiredFields(['email']), AppServices.createSpace);
appController.post('/verify-user/:email/:otp', AppServices.verifyIdentity);
appController.get('/fetch-passwords/', checkRequiredHeaders(['x-key']), isAuth, AppServices.fetchAllPassword)
appController.patch('/update-password/:id', checkRequiredHeaders(['x-key']), isAuth, AppServices.updatePassword);
appController.delete('/delete-password/:id', checkRequiredHeaders(['x-key']), isAuth, AppServices.deletePassword)
appController.post('/sync', checkRequiredHeaders(['x-key']), isAuth, AppServices.syncPasswords)
appController.post('/create-password', checkRequiredHeaders(['x-key']), isAuth, checkRequiredFields(['id', 'title', 'username', 'password', 'click', 'important', 'createdAt', 'updatedAt']), AppServices.createPassword);
appController.patch('/update-click', checkRequiredHeaders(['x-key']), isAuth, checkRequiredFields(['id', 'click']), AppServices.updateClick);
appController.delete('/delete-multilple', checkRequiredHeaders(['x-key']), isAuth, checkRequiredFields(['ids']), AppServices.deleteMultiple);
appController.patch('/update-multiple',checkRequiredHeaders(['x-key']), isAuth, checkRequiredFields(['data']),AppServices.updateMultiple);
module.exports = appController;