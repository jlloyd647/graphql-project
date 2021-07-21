const graphql = require('graphql')
var _ = require('lodash');
const User = require('../model/user')
const Hobby = require('../model/hobby')
const Post = require('../model/post')

//dummy data
/*
var usersData = [
    {id: '1',  name: 'Bond', age: 36, profession: 'Agent'},
    {id: '13',  name: 'Anna', age: 26, profession: 'Patrol'},
    {id: '211',  name: 'Bella', age: 16, profession: 'Student'},
    {id: '19',  name: 'Gina', age: 26, profession: 'Front Desk'},
    {id: '150',  name: 'Georgina', age: 36, profession: 'Clerk'}
]

var hobbiesData = [
    {id: '1',  title: 'Programming', description: 'Using computers', userId: '1'},
    {id: '2',  title: 'Rowing', description: 'Using boats', userId: '1'},
    {id: '3',  title: 'Swimming', description: 'Using pools', userId: '19'},
    {id: '4',  title: 'Fencing', description: 'Using swords', userId: '211'},
    {id: '5',  title: 'Hiking', description: 'Using woods', userId: '1'}
]

var postsData = [
    {id: '101', post: 'I work with computers', userId: '1'},
    {id: '102', post: 'I row boats', userId: '1'},
    {id: '103', post: 'I swim in pools', userId: '19'},
    {id: '104', post: 'I fight with swords', userId: '211'},
    {id: '105', post: 'I hike in the woods', userId: '1'}
]
*/

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull

} = graphql

//Create types
const UserType = new graphql.GraphQLObjectType({
    name: 'User',
    description:  'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({userId: parent.id})
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args){
                return Hobby.find({userId: parent.id})
            }
        }
    })
})

const HobbyType = new graphql.GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId)
            }
        }
    })
})

const PostType = new graphql.GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        post: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId)
            }
        }
    })
})

//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },

        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({})
            }
        },

        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findById(args.id)
            }
        },

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({})
            }
        },

        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findById(args.id)
            }
        },

        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({})
            }
        }

    }
})

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },

            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                return user.save()
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updateUser = User.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {new: true} //send back the updated objectType
                )
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removedUser = User.findByIdAndRemove(
                    args.id
                ).exec()
                if(!removedUser){
                    throw new("Error")
                }

                return removedUser
            }
        },
        createPost: {
           type: PostType,
           args: {
               //id: {type: GraphQLID},
               post: {type: new GraphQLNonNull(GraphQLString)},
               userId: {type: new GraphQLNonNull(GraphQLID)},
               },
            resolve(parent, args){
                let post = new Post({
                    post: args.post,
                    userId: args.userId
                })
                return post.save()
           } 
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                post: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updatePost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            post: args.post,
                            userId: args.userId,
                        }
                    },
                    {new: true} //send back the updated objectType
                )
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removedPost = Post.findByIdAndRemove(
                    args.id
                ).exec()
                if(!removedPost){
                    throw new("Error")
                }

                return removedPost
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                //id: {type: GraphQLID}
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args){
                let hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })
                return hobby.save()
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description,
                            userId: args.userId,
                        }
                    },
                    {new: true} //send back the updated objectType
                )
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(
                    args.id
                ).exec()
                if(!removedHobby){
                    throw new("Error")
                }

                return removedHobby
            }
        },
    }
})

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})