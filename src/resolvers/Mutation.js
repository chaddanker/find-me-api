const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context, info) {
    // encrypt the users password using the bcryptjs library
    const password = await bcrypt.hash(args.password, 10);
    //generate a JWT which is signed with an APP_SECRET
    const user = await context.prisma.user.create({ data: { ...args, password } });

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token, 
        user,
    }
}

async function login(parent, args, context, info) {
    // use prisma client instance to retrieve an existing user with credentials given
    const user = await context.prisma.user.findOne({ where: { email: args.email } });
    // if no user is found with those credentials, throw corresponding error
    if(!user) {
        throw new Error('No such user found');
    }
    // if a user with that email address is found, compare passwords with bcrypt.js library
    const valid = await bcrypt.compare(args.password, user.password);
    if(!valid) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET);

    return {
        token, 
        user, 
    }
}

function post(parent, args, context, info) {
    const userId = getUserId(context);

    const newLink = context.prisma.link.create({
        data: {
            url: args.url,
            description: args.description,
            postedBy: { connect: { id: userId } },
        }
    });
    // subscription logic - when a new link is added ->
    context.pubsub.publish("NEW_LINK", newLink);

    return newLink;
}

async function updateLink (_, {id, description, url}, context) {
    const updatedLink = await context.prisma.link.update({
        where: {
            id: parseInt(id)
        },
        data: {
            description,
            url,
        }
    });

    return updatedLink;
}

async function deleteLink (_, {id}, context) {
    const deletedLink = await context.prisma.link.delete({
        where: {
            id: parseInt(id)
        },
    });

    return deletedLink;
}

async function vote (parent, args, context, info) {
    // validates incoming jwt with ./utils.js getUserId function
    // if valid: returns with userId of user voting
    const userId = getUserId(context);

    const vote = await context.prisma.vote.findOne({
        where: {
            linkId_userId: {
                linkId: Number(args.linkId),
                userId: userId
            }
        }
    });
    // check if vote exists already - found vote for this link made by this user in database
    if(Boolean(vote)) {
        throw new Error(`Already voted for link: ${args.linkId}`);
    }

    const newVote = context.prisma.vote.create({
        data: {
            user: { connect: { id: userId } },
            link: { connect: { id: Number(args.linkId) } },
        }
    });
    
    context.pubsub.publish("NEW_VOTE", newVote);
    
    return newVote;
}



module.exports = {
    signup, 
    login, 
    post,
    updateLink,
    deleteLink,
    vote,
}