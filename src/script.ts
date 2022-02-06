// The script file will contain the code for your first Prisma query

//Import the PrismaClient constructor from the @prisma/client node module.
import { PrismaClient } from "@prisma/client";

// Instantiate PrismaClient.
const prisma = new PrismaClient();

// Define an async function called main to send queries to the database.
// You will write all your queries inside this function.
async function main() {
  const newLink = await prisma.link.create({
    data: {
      description: "Fullstack tutorial for graphql",
      url: "generated-from-script.ts"
    }
  })

  const allLinks = await prisma.link.findMany();
  console.log(allLinks);


}

// Call the `main` function
main()
  .catch((e) => {
    throw e;
  })
  // Close the database connections when the script terminates
  .finally(async () => {
    await prisma.$disconnect();
  });
