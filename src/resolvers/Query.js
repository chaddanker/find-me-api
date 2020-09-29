async function feed(parent, args, context, info) {

    const where = args.filter
    ? {
        OR: [
            { description: { contains: args.filter } },
            { url: { contains: args.filter } },
        ],
    } : {};

// The limit is called take, meaning you’re “taking” x elements after a provided start index.
// The start index is called skip, since you’re skipping that many elements in the list before collecting the items to be returned. If skip is not provided, it’s 0 by default. The pagination then always starts from the beginning of the list.


    const links = await context.prisma.link.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
    });

    // references same where declared above 
    const count = await context.prisma.link.count({ where });

    return {
        links,
        count,
    };
}

async function link (_, { id }, context) {
    return context.prisma.link.findOne({
        where: {
            id: parseInt(id)
        }
    });
}

module.exports = {
    feed,
    link,
};