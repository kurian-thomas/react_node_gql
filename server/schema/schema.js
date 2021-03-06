const graphql = require('graphql');
const _ = require('lodash');
const Book = require("../models/book");
const Author = require("../models/author");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

//dummy data
// var books = [
//     { name: 'Book1', 'genre': 'Fantasy', 'id': '1', 'authorid': '1' },
//     { name: 'Book2', 'genre': 'Sci-fi', 'id': '2', 'authorid': '2' },
//     { name: 'Book3', 'genre': 'Romance', 'id': '3', 'authorid': '3' },
//     { name: 'Book4', 'genre': 'triller', 'id': '4', 'authorid': '2' },
//     { name: 'Book5', 'genre': 'mystery', 'id': '5', 'authorid': '3' },
//     { name: 'Book6', 'genre': 'education', 'id': '6', 'authorid': '3' },

// ];

// var authors = [
//     { 'name': 'auth1', 'age': 44, 'id': '1' },
//     { 'name': 'auth2', 'age': 45, 'id': '2' },
//     { 'name': 'auth3', 'age': 41, 'id': '3' },
// ]


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                //return _.find(authors, { id: parent.authorid })

                return Author.findById(parent.authorid);
            }
        }
    })
});


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return _.filter(books, { authorid: parent.id })
                return Book.find(parent.id);
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get data from db
                // return _.find(books, { id: args.id });
                //return Book.find({ "id": args.id });


            }
        },
        author: {
            type: AuthorType,
            args: { age: { type: GraphQLID } },
            resolve(parent, args) {
                //return _.find(authors, { id: args.id });
                return Author.find({ "age": args.age });
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //return books;
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                //return authors
                return Author.find({});
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLString },
                authorid: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorid: args.authorid
                })
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})