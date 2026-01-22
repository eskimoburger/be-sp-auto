/**
 * Reseed Vehicle metadata (Types, Brands, Models) + Sample Vehicles with Customers
 * All data is complete (no null fields where possible).
 * Preserves existing data - uses upsert/findFirst patterns.
 * 
 * Usage: bun run prisma/seed-vehicles.ts
 */
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { fakerTH as faker } from "@faker-js/faker";

const connectionString = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!connectionString) {
    console.error("TURSO_DATABASE_URL is required");
    process.exit(1);
}

const adapter = new PrismaLibSql({
    url: connectionString,
    authToken: authToken
});
const prisma = new PrismaClient({ adapter });

// Thai provinces for realistic data
const TH_PROVINCES = [
    { name: "กรุงเทพมหานคร", code: "10" },
    { name: "นนทบุรี", code: "12" },
    { name: "ปทุมธานี", code: "13" },
    { name: "สมุทรปราการ", code: "11" },
    { name: "ชลบุรี", code: "20" },
    { name: "เชียงใหม่", code: "50" },
    { name: "ภูเก็ต", code: "83" },
    { name: "นครราชสีมา", code: "30" }
];

const TH_COLORS = [
    "ดำ", "ขาว", "เงิน", "เทา", "แดง", "น้ำเงิน", "บรอนซ์เงิน", "บรอนซ์ทอง", "เขียว", "เหลือง"
];

const TH_DISTRICTS = [
    "บางกะปิ", "ห้วยขวาง", "สาทร", "บางรัก", "คลองเตย", "ปากเกร็ด", "เมือง", "บางพลี"
];

const TH_SUBDISTRICTS = [
    "คลองตัน", "สามเสนใน", "สีลม", "สุรวงศ์", "คลองเตย", "บ้านใหม่", "ในเมือง", "ราชเทวี"
];

// How many sample vehicles to seed
const SEED_SAMPLE_VEHICLES = Number.parseInt(process.env.SEED_SAMPLE_VEHICLES ?? "5", 10);

function generateThaiPhone(): string {
    const prefixes = ["08", "09", "06"];
    const prefix = faker.helpers.arrayElement(prefixes);
    return `${prefix}${faker.string.numeric(8)}`;
}

function generateVIN(): string {
    // Simplified VIN format
    return faker.string.alphanumeric(17).toUpperCase();
}

function generateEngineNumber(): string {
    return `${faker.string.alpha(3).toUpperCase()}-${faker.string.numeric(7)}`;
}

function generateChassisNumber(): string {
    return `${faker.string.alpha(2).toUpperCase()}${faker.string.numeric(8)}`;
}

function generateRegistration(): string {
    // Thai registration format: กข 1234
    const thaiChars = "กขคงจฉชซญฐดตถทธนบปผพภมยรลวศษสหอ";
    const char1 = thaiChars[Math.floor(Math.random() * thaiChars.length)];
    const char2 = thaiChars[Math.floor(Math.random() * thaiChars.length)];
    const num = faker.string.numeric(4);
    return `${char1}${char2} ${num}`;
}

async function main() {
    console.log("🚗 Re-seeding Vehicle metadata + Sample Vehicles (preserving existing data)...\n");

    // 1. Vehicle Types
    console.log("📦 Seeding Vehicle Types...");
    const { ALL_BRANDS, VEHICLE_TYPES } = await import("../vehicleData");

    const typeMap = new Map<string, number>();
    let typesCreated = 0;
    let typesUpdated = 0;

    for (const typeName of VEHICLE_TYPES) {
        const code = typeName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-");
        const match = /\(([^)]+)\)/.exec(typeName);
        const nameEn = match ? match[1] : typeName;

        const existing = await prisma.vehicleType.findUnique({ where: { code } });

        const createdType = await prisma.vehicleType.upsert({
            where: { code },
            update: { name: typeName, nameEn: nameEn || typeName },
            create: { code, name: typeName, nameEn: nameEn || typeName }
        });

        if (existing) {
            typesUpdated++;
        } else {
            typesCreated++;
        }
        typeMap.set(typeName, createdType.id);
    }
    console.log(`   ✅ Types: ${typesCreated} created, ${typesUpdated} updated\n`);

    // 2. Vehicle Brands
    console.log("🏭 Seeding Vehicle Brands...");
    let brandsCreated = 0;
    let brandsUpdated = 0;

    for (const brand of ALL_BRANDS) {
        const existing = await prisma.vehicleBrand.findUnique({ where: { code: brand.id } });

        await prisma.vehicleBrand.upsert({
            where: { code: brand.id },
            update: {
                name: brand.name,
                nameEn: brand.nameEn,
                country: brand.country,
                logoUrl: brand.logoUrl || null
            },
            create: {
                code: brand.id,
                name: brand.name,
                nameEn: brand.nameEn,
                country: brand.country,
                logoUrl: brand.logoUrl || null
            }
        });

        if (existing) {
            brandsUpdated++;
        } else {
            brandsCreated++;
        }
    }
    console.log(`   ✅ Brands: ${brandsCreated} created, ${brandsUpdated} updated\n`);

    // 3. Vehicle Models
    console.log("🚙 Seeding Vehicle Models...");
    let modelsCreated = 0;
    let modelsSkipped = 0;

    for (const brand of ALL_BRANDS) {
        const dbBrand = await prisma.vehicleBrand.findUnique({ where: { code: brand.id } });
        if (!dbBrand) continue;

        for (const model of brand.models) {
            const typeId = typeMap.get(model.type);
            if (!typeId) {
                console.warn(`   ⚠️ Type not found for model ${model.name}: ${model.type}`);
                continue;
            }

            const exists = await prisma.vehicleModel.findFirst({
                where: { brandId: dbBrand.id, name: model.name }
            });

            if (!exists) {
                await prisma.vehicleModel.create({
                    data: {
                        brandId: dbBrand.id,
                        name: model.name,
                        typeId
                    }
                });
                modelsCreated++;
            } else {
                modelsSkipped++;
            }
        }
    }
    console.log(`   ✅ Models: ${modelsCreated} created, ${modelsSkipped} already exist\n`);

    // 4. Sample Customers & Vehicles (with complete data, no nulls)
    console.log(`👤 Seeding ${SEED_SAMPLE_VEHICLES} Sample Customers with Vehicles (complete data)...`);

    const vehicleModels = await prisma.vehicleModel.findMany({
        include: { brand: true, type: true }
    });

    let customersCreated = 0;
    let vehiclesCreated = 0;

    for (let i = 0; i < SEED_SAMPLE_VEHICLES; i++) {
        const province = faker.helpers.arrayElement(TH_PROVINCES);
        const district = faker.helpers.arrayElement(TH_DISTRICTS);
        const subDistrict = faker.helpers.arrayElement(TH_SUBDISTRICTS);

        // Create Customer with complete data (no nulls)
        const customer = await prisma.customer.create({
            data: {
                name: faker.person.fullName(),
                phone: generateThaiPhone(),
                address: `${faker.location.streetAddress()} ${district} ${province.name}`
            }
        });
        customersCreated++;

        // Create Vehicle with complete data (no nulls)
        const randomModel = vehicleModels.length
            ? faker.helpers.arrayElement(vehicleModels)
            : null;

        const registrationDate = faker.date.past({ years: 5 });
        const year = String(registrationDate.getFullYear() + 543); // Buddhist year

        const vehicle = await prisma.vehicle.create({
            data: {
                customerId: customer.id,
                registration: generateRegistration(),
                vinNumber: generateVIN(),
                brand: randomModel?.brand?.name ?? "Toyota",
                model: randomModel?.name ?? "Camry",
                type: randomModel?.type?.name ?? "รถเก๋ง (Sedan)",
                year: year,
                color: faker.helpers.arrayElement(TH_COLORS),

                // Registration Province
                registrationProvince: province.name,
                registrationProvinceCode: province.code,
                registrationDate: registrationDate,

                // Owner Address (complete)
                ownerProvince: province.name,
                ownerProvinceCode: province.code,
                ownerDistrict: district,
                ownerSubDistrict: subDistrict,
                ownerAddress: faker.location.streetAddress(),
                ownerPostalCode: faker.location.zipCode(),

                // Vehicle identifiers
                engineNumber: generateEngineNumber(),
                chassisNumber: generateChassisNumber()
            }
        });
        vehiclesCreated++;

        console.log(`   📝 Created: ${customer.name} → ${vehicle.registration} (${vehicle.brand} ${vehicle.model})`);
    }
    console.log(`   ✅ Customers: ${customersCreated} created`);
    console.log(`   ✅ Vehicles: ${vehiclesCreated} created\n`);

    // Summary
    const totalTypes = await prisma.vehicleType.count();
    const totalBrands = await prisma.vehicleBrand.count();
    const totalModels = await prisma.vehicleModel.count();
    const totalCustomers = await prisma.customer.count();
    const totalVehicles = await prisma.vehicle.count();

    console.log("📊 Summary:");
    console.log(`   Total Vehicle Types: ${totalTypes}`);
    console.log(`   Total Vehicle Brands: ${totalBrands}`);
    console.log(`   Total Vehicle Models: ${totalModels}`);
    console.log(`   Total Customers: ${totalCustomers}`);
    console.log(`   Total Vehicles: ${totalVehicles}`);
    console.log("\n✅ Vehicle metadata + sample data seeding complete!");
}

main()
    .catch((e: unknown) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
