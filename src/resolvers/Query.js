async function userlist(parent, args, context, info) {

    const where = args.filter
    ? {
        OR: [
                { username: { contains: args.filter } },
                { name: { contains: args.filter } },
        ],
    } : {};

    const users = await context.prisma.user.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
    });

    const count = await context.prisma.user.count({ where });

    return {
        users,
        count,
    };
}

async function user (_, { id, username }, context) {
    return context.prisma.user.findOne({ where: { username } });
}

module.exports = {
    userlist,
    user,
};