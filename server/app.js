const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow cross origin requests
app.use(cors());

mongoose.connect('mongodb+srv://admin:passpass123@cluster0.ptgoh.gcp.mongodb.net/testdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
    console.log('connected to database')
})
//middlewear
//graphql schema
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));


app.listen(4000, () => {
    console.log("now listning on port 4000");
})