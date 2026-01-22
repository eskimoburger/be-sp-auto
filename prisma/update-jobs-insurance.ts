import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
    url: connectionString!,
    authToken: authToken
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Fetching insurance companies...");
    const insuranceCompanies = await prisma.insuranceCompany.findMany();

    if (insuranceCompanies.length === 0) {
        console.log("No insurance companies found in database!");
        return;
    }

    console.log(`Found ${insuranceCompanies.length} insurance companies:`);
    insuranceCompanies.forEach(ins => console.log(`  - ${ins.id}: ${ins.name}`));

    console.log("\nFetching jobs without insurance company...");
    const jobsWithoutInsurance = await prisma.job.findMany({
        where: { insuranceCompanyId: null }
    });

    console.log(`Found ${jobsWithoutInsurance.length} jobs without insurance company`);

    if (jobsWithoutInsurance.length > 0) {
        console.log("Updating jobs with random insurance companies...");
        for (const job of jobsWithoutInsurance) {
            const randomInsurance = insuranceCompanies[Math.floor(Math.random() * insuranceCompanies.length)];
            await prisma.job.update({
                where: { id: job.id },
                data: { insuranceCompanyId: randomInsurance.id }
            });
            console.log(`  Updated job ${job.id} (${job.jobNumber}) with ${randomInsurance.name}`);
        }
    }

    console.log("\nDone!");
}

main()
    .catch((e: unknown) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
