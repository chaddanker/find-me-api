const { PrismaClientKnownRequestError } = require("@prisma/client");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

    const newLink = await prisma.link.create({
        data: {
            description: 'Fullstack tutorial for GraphQL',
            url: 'www.howtographql.com'
        },
    })

    const allLinks =  await prisma.link.findMany()
    console.log(allLinks)
}

main().catch(e => {
    throw e
}).finally(async () => {
    await prisma.$disconnect()
})

// Summary of workflow
// typical workflow you will follow when updating your data:

// Manually adjust your Prisma data model.
// Migrate your database using the prisma migrate CLI commands we covered.
// (Re-)generate Prisma Client
// Use Prisma Client in your application code to access your database.