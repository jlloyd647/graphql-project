const grahpql = require('graphql')


/*
mongodb+srv://admin:solsgl8@cluster0.nrtvn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
*/



const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLSchema,
    GraphQLNonNull

} = grahpql

//Scalar Type
/*
    String = GraphQLString
    int = GraphQLString
    Float = GraphQLString
    Boolean = GraphQLString
    ID = GraphQLString
*/

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'Represents a person type',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)},
        isMarried: {type: GraphQLBoolean},
        gpa: {type: GraphQLFloat},
        justAType: {
            type: Person,
            resolve(parent, args) {
                return parent;
            }
        }
    })
})

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        person: {
            type: Person,
            resolve(parent, args) {
                let personObj = {
                    name: null,
                    age: 35,
                    isMarried: true,
                    gpa: 4.0
                }
                return personObj
            }
        }

    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})