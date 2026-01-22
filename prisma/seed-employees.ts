import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const adapter = new PrismaLibSql({
    url: connectionString!,
    authToken: authToken
});
const prisma = new PrismaClient({ adapter });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require("bcryptjs");

async function main() {
    console.log("Seeding ONLY Employees...");
    const passwordHash = await bcrypt.hash("123456", 10);
    const employees = [
        { name: "สมชาย มีสุข", role: "receiver" },
        { name: "วิชัย เก่ง", role: "receiver" },
        { name: "สุธี แก้ว", role: "technician" },
        { name: "ประเสริฐ ทอง", role: "technician" },
        { name: "กฤษณ์ เดชา", role: "technician" },
        { name: "อนุชิต รักษ์", role: "technician" },
        { name: "ธนา วิริยะ", role: "admin", username: "admin1", password: passwordHash },
        { name: "พิชัย หาญ", role: "admin", username: "admin2", password: passwordHash },
        { name: "สมศักดิ์ มั่นคง", role: "admin", username: "admin3", password: passwordHash }
    ];
    for (const emp of employees) {
        const exists = await prisma.employee.findFirst({ where: { name: emp.name } });
        if (!exists) {
            console.log(`Creating employee: ${emp.name}`);
            await prisma.employee.create({ data: emp });
        } else {
            // Update existing admins with credentials
            if (emp.username) {
                console.log(`Updating employee credentials (force): ${emp.name}`);
                await prisma.employee.update({
                    where: { id: exists.id },
                    data: { username: emp.username, password: emp.password }
                });
            } else {
                console.log(`Employee already exists: ${emp.name}`);
            }
        }
    }
    console.log("Employee seeding finished.");
}

main()
    .catch((e: unknown) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
