async function newscore(parent, args, context, info) {

    const newScore = await context.prisma.score.create({
        data: {
            name: args.name,
            email: args.email,
            score: Number(args.score),
        }
    });

    return newScore;
}

async function updatescore (_, {id, name, email, score}, context) {
    const updatedScore = await context.prisma.score.update({
        where: {
            id: Number(id)
        },
        data: {
            email,
            name,
            score,
        }
    });

    return updatedScore;
}

async function deletescore (_, {id}, context) {
    const deletedScore = await context.prisma.score.delete({ where: { id: Number(id) }, });

    return deletedScore;
}


module.exports = {
    newscore,
    updatescore,
    deletescore,
}