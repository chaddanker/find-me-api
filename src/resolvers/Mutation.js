async function newuser(parent, args, context, info) {

    const newUser = await context.prisma.user.create({
        data: {
            name: args.name,
            username: args.username,
            cell: args.cell,
            qrcode: args.qrcode,
            location: args.location
        }
    });

    return newUser;
}

async function updateuser (_, args, context) {
    const updatedUser = await context.prisma.user.update({
        where: {
            id: Number(args.id)
        },
        data: {
            name: args.name,
            username: args.username,
            cell: args.cell,
            qrcode: args.qrcode,
            location: args.location
        }
    });

    return updatedUser;
}

async function deleteuser (_, {id}, context) {
    const deletedUser = await context.prisma.user.delete({ where: { id: Number(id) }, });

    return deletedUser;
}


module.exports = {
    newuser,
    updateuser,
    deleteuser,
}