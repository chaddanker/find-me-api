async function scorelist(parent, args, context, info) {

    const where = args.filter
    ? {
        OR: [
                { email: { contains: args.filter } },
                { name: { contains: args.filter } },
        ],
    } : {};

    const scores = await context.prisma.score.findMany({
        where,
        skip: args.skip,
        take: args.take,
        orderBy: args.orderBy,
    });

    const count = await context.prisma.score.count({ where });

    return {
        scores,
        count,
    };
}

async function score (_, { id }, context) {
    return context.prisma.score.findOne({ where: { id: Number(id) } });
}

module.exports = {
    scorelist,
    score,
};