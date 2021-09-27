module.exports = (projectDetails) => {
        const mongoose = require('mongoose')

    mongoose.Promise = Promise
    
    mongoose.connection.on('connected', () => {
      console.log('Connection Established with :'+projectDetails.dbName);
      console.log('Local: '+ projectDetails.isLocalDB);
      console.log('DB Connection url: '+ projectDetails.isLocalDB ? projectDetails.dbUrl + projectDetails.dbName : projectDetails.dbUrl);
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('Connection Reestablished')
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('Connection Disconnected')
    })
    
    mongoose.connection.on('close', () => {
      console.log('Connection Closed')
    })
    
    mongoose.connection.on('error', (error) => {
      console.log('ERROR: ' + error)
    })
    const run = async () => {
        await mongoose.connect(projectDetails.isLocalDB ? projectDetails.dbUrl + projectDetails.dbName : projectDetails.dbUrl, {
          autoReconnect: true,
          reconnectTries: 1000000,
          reconnectInterval: 3000,
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true
        })
    }
      
    run().catch(error => console.error(error))
    }