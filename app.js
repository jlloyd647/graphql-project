const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const mongoose = require('mongoose')

const cors = require('cors')
const schema = require('./schema/schema')
//const testSchema = require('./schema/types_schema')


const app = express()

mongoose.connect('mongodb+srv://admin:solsgl8@cluster0.nrtvn.mongodb.net/Cluster0?retryWrites=true&w=majority',  
                  {useNewUrlParser: true})
mongoose.connection.once('open', () => {
    console.log('Yes! We are connected!')
})

app.use(cors())

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(4000, () => { //localhost:4000
    console.log('Listening for requests on port 4000')
})