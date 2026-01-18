// Comprehensive vehicle data for Thailand market
// Sources: AutoLife Thailand, Motorist, and various Thai automotive websites

export interface VehicleBrand {
    id: string;
    name: string;
    nameEn: string;
    country: string;
    logoUrl?: string;
    models: VehicleModel[];
}

export interface VehicleModel {
    name: string;
    type: VehicleType;
}

export type VehicleType =
    | "รถเก๋ง (Sedan)"
    | "รถแฮตช์แบ็ก (Hatchback)"
    | "SUV"
    | "รถกระบะ (Pickup)"
    | "รถตู้ (MPV)"
    | "รถครอสโอเวอร์ (Crossover)"
    | "รถคูเป้ (Coupe)"
    | "รถสปอร์ต (Sport)"
    | "รถไฟฟ้า (EV)";

// Vehicle Types - Thai terminology
export const VEHICLE_TYPES: VehicleType[] = [
    "รถเก๋ง (Sedan)",
    "รถแฮตช์แบ็ก (Hatchback)",
    "SUV",
    "รถกระบะ (Pickup)",
    "รถตู้ (MPV)",
    "รถครอสโอเวอร์ (Crossover)",
    "รถคูเป้ (Coupe)",
    "รถสปอร์ต (Sport)",
    "รถไฟฟ้า (EV)"
];

// Japanese Brands - Most popular in Thailand
export const JAPANESE_BRANDS: VehicleBrand[] = [
    {
        id: "toyota",
        name: "โตโยต้า",
        nameEn: "Toyota",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/toyota-logo.png",
        models: [
            { name: "Yaris ATIV", type: "รถเก๋ง (Sedan)" },
            { name: "Vios", type: "รถเก๋ง (Sedan)" },
            { name: "Corolla Altis", type: "รถเก๋ง (Sedan)" },
            { name: "Camry", type: "รถเก๋ง (Sedan)" },
            { name: "Corolla Cross", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Yaris Cross", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Fortuner", type: "SUV" },
            { name: "Hilux Revo", type: "รถกระบะ (Pickup)" },
            { name: "Commuter", type: "รถตู้ (MPV)" },
            { name: "Innova", type: "รถตู้ (MPV)" },
            { name: "Haice", type: "รถตู้ (MPV)" },
            { name: "Prius", type: "รถไฟฟ้า (EV)" },
            { name: "bZ4X", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "honda",
        name: "ฮอนด้า",
        nameEn: "Honda",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/honda-logo.png",
        models: [
            { name: "City", type: "รถเก๋ง (Sedan)" },
            { name: "City Hatchback", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Civic", type: "รถเก๋ง (Sedan)" },
            { name: "Civic Type R", type: "รถสปอร์ต (Sport)" },
            { name: "Accord", type: "รถเก๋ง (Sedan)" },
            { name: "HR-V", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "CR-V", type: "SUV" },
            { name: "BR-V", type: "SUV" },
            { name: "Jazz", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "e:HEV", type: "รถไฟฟ้า (EV)" },
            { name: "e:NS1", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "isuzu",
        name: "อีซูซุ",
        nameEn: "Isuzu",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/isuzu-logo.png",
        models: [
            { name: "D-Max", type: "รถกระบะ (Pickup)" },
            { name: "D-Max Cab 4", type: "รถกระบะ (Pickup)" },
            { name: "MU-X", type: "SUV" },
            { name: "NPR", type: "รถตู้ (MPV)" },
            { name: "NQR", type: "รถตู้ (MPV)" }
        ]
    },
    {
        id: "nissan",
        name: "นิสสัน",
        nameEn: "Nissan",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/nissan-logo.png",
        models: [
            { name: "Almera", type: "รถเก๋ง (Sedan)" },
            { name: "Navara", type: "รถกระบะ (Pickup)" },
            { name: "Kicks", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Leaf", type: "รถไฟฟ้า (EV)" },
            { name: "Note", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Terra", type: "SUV" },
            { name: "Patrol", type: "SUV" },
            { name: "Sylvia", type: "รถคูเป้ (Coupe)" },
            { name: "370Z", type: "รถสปอร์ต (Sport)" }
        ]
    },
    {
        id: "mazda",
        name: "มาสด้า",
        nameEn: "Mazda",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/mazda-logo.png",
        models: [
            { name: "Mazda 2", type: "รถเก๋ง (Sedan)" },
            { name: "Mazda 2 Hatchback", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Mazda 3", type: "รถเก๋ง (Sedan)" },
            { name: "Mazda 3 Fastback", type: "รถคูเป้ (Coupe)" },
            { name: "Mazda 6", type: "รถเก๋ง (Sedan)" },
            { name: "CX-3", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "CX-5", type: "SUV" },
            { name: "CX-8", type: "SUV" },
            { name: "CX-9", type: "SUV" },
            { name: "MX-5", type: "รถสปอร์ต (Sport)" },
            { name: "MX-30", type: "รถไฟฟ้า (EV)" },
            { name: "BT-50 Pro", type: "รถกระบะ (Pickup)" }
        ]
    },
    {
        id: "mitsubishi",
        name: "มิตซูบิชิ",
        nameEn: "Mitsubishi",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/mitsubishi-logo.png",
        models: [
            { name: "Attrage", type: "รถเก๋ง (Sedan)" },
            { name: "Mirage", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Triton", type: "รถกระบะ (Pickup)" },
            { name: "Xpander", type: "รถตู้ (MPV)" },
            { name: "Xpander Cross", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Pajero Sport", type: "SUV" },
            { name: "Outlander", type: "SUV" },
            { name: "Eclipse Cross", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Lancer Evolution", type: "รถสปอร์ต (Sport)" }
        ]
    },
    {
        id: "suzuki",
        name: "ซูซูกิ",
        nameEn: "Suzuki",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/suzuki-logo.png",
        models: [
            { name: "Ciaz", type: "รถเก๋ง (Sedan)" },
            { name: "Swift", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Ignis", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Ertiga", type: "รถตู้ (MPV)" },
            { name: "Xpander", type: "รถตู้ (MPV)" },
            { name: "Jimny", type: "SUV" },
            { name: "Vitara", type: "SUV" }
        ]
    },
    {
        id: "subaru",
        name: "ซูบารุ",
        nameEn: "Subaru",
        country: "ญี่ปุ่น",
        logoUrl: "https://vl.imgix.net/img/subaru-logo.png",
        models: [
            { name: "Impreza", type: "รถเก๋ง (Sedan)" },
            { name: "Levorg", type: "รถเก๋ง (Sedan)" },
            { name: "WRX STI", type: "รถสปอร์ต (Sport)" },
            { name: "Forester", type: "SUV" },
            { name: "Outback", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "XV", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "BRZ", type: "รถสปอร์ต (Sport)" }
        ]
    }
];

// European Brands - Luxury segment
export const EUROPEAN_BRANDS: VehicleBrand[] = [
    {
        id: "bmw",
        name: "บีเอ็มดับเบิลยู (BMW)",
        nameEn: "BMW",
        country: "เยอรมนี",
        logoUrl: "https://vl.imgix.net/img/bmw-logo.png",
        models: [
            { name: "Series 2", type: "รถคูเป้ (Coupe)" },
            { name: "Series 3", type: "รถเก๋ง (Sedan)" },
            { name: "Series 5", type: "รถเก๋ง (Sedan)" },
            { name: "Series 7", type: "รถเก๋ง (Sedan)" },
            { name: "X1", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "X3", type: "SUV" },
            { name: "X5", type: "SUV" },
            { name: "X7", type: "SUV" },
            { name: "Z4", type: "รถสปอร์ต (Sport)" },
            { name: "iX", type: "รถไฟฟ้า (EV)" },
            { name: "i4", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "mercedes-benz",
        name: "เมอร์เซเดส-เบนซ์",
        nameEn: "Mercedes-Benz",
        country: "เยอรมนี",
        logoUrl: "https://vl.imgix.net/img/mercedes-benz-logo.png",
        models: [
            { name: "A-Class", type: "รถเก๋ง (Sedan)" },
            { name: "C-Class", type: "รถเก๋ง (Sedan)" },
            { name: "E-Class", type: "รถเก๋ง (Sedan)" },
            { name: "S-Class", type: "รถเก๋ง (Sedan)" },
            { name: "GLA", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "GLB", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "GLC", type: "SUV" },
            { name: "GLE", type: "SUV" },
            { name: "GLS", type: "SUV" },
            { name: "EQC", type: "รถไฟฟ้า (EV)" },
            { name: "EQS", type: "รถไฟฟ้า (EV)" },
            { name: "AMG GT", type: "รถสปอร์ต (Sport)" }
        ]
    },
    {
        id: "audi",
        name: "ออดี้",
        nameEn: "Audi",
        country: "เยอรมนี",
        logoUrl: "https://vl.imgix.net/img/audi-logo.png",
        models: [
            { name: "A3", type: "รถเก๋ง (Sedan)" },
            { name: "A4", type: "รถเก๋ง (Sedan)" },
            { name: "A6", type: "รถเก๋ง (Sedan)" },
            { name: "A8", type: "รถเก๋ง (Sedan)" },
            { name: "Q2", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Q3", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Q5", type: "SUV" },
            { name: "Q7", type: "SUV" },
            { name: "Q8", type: "SUV" },
            { name: "TT", type: "รถสปอร์ต (Sport)" },
            { name: "R8", type: "รถสปอร์ต (Sport)" },
            { name: "e-tron", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "volkswagen",
        name: "โฟล์คสวาเกน",
        nameEn: "Volkswagen",
        country: "เยอรมนี",
        logoUrl: "https://vl.imgix.net/img/volkswagen-logo.png",
        models: [
            { name: "Virtus", type: "รถเก๋ง (Sedan)" },
            { name: "Jetta", type: "รถเก๋ง (Sedan)" },
            { name: "Polo", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Golf", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Tiguan", type: "SUV" },
            { name: "Teramont", type: "SUV" },
            { name: "ID.4", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "mini",
        name: "มินิ",
        nameEn: "MINI",
        country: "อังกฤษ",
        logoUrl: "https://vl.imgix.net/img/mini-logo.png",
        models: [
            { name: "Cooper 3 Door", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Cooper 5 Door", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Cooper SE", type: "รถไฟฟ้า (EV)" },
            { name: "Countryman", type: "รถครอสโอเวอร์ (Crossover)" }
        ]
    },
    {
        id: "volvo",
        name: "วอลโว่",
        nameEn: "Volvo",
        country: "สวีเดน",
        logoUrl: "https://vl.imgix.net/img/volvo-logo.png",
        models: [
            { name: "S60", type: "รถเก๋ง (Sedan)" },
            { name: "S90", type: "รถเก๋ง (Sedan)" },
            { name: "XC40", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "XC60", type: "SUV" },
            { name: "XC90", type: "SUV" },
            { name: "Recharge", type: "รถไฟฟ้า (EV)" }
        ]
    }
];

// American Brands
export const AMERICAN_BRANDS: VehicleBrand[] = [
    {
        id: "ford",
        name: "ฟอร์ด",
        nameEn: "Ford",
        country: "อเมริกา",
        logoUrl: "https://vl.imgix.net/img/ford-logo.png",
        models: [
            { name: "Ranger", type: "รถกระบะ (Pickup)" },
            { name: "Raptor", type: "รถกระบะ (Pickup)" },
            { name: "Everest", type: "SUV" },
            { name: "Explorer", type: "SUV" },
            { name: "Mustang", type: "รถสปอร์ต (Sport)" },
            { name: "Mustang Mach-E", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "chevrolet",
        name: "เชฟโรเลต",
        nameEn: "Chevrolet",
        country: "อเมริกา",
        logoUrl: "https://vl.imgix.net/img/chevrolet-logo.png",
        models: [
            { name: "Colorado", type: "รถกระบะ (Pickup)" },
            { name: "Trailblazer", type: "SUV" },
            { name: "Captiva", type: "SUV" },
            { name: "Yenko", type: "รถสปอร์ต (Sport)" }
        ]
    },
    {
        id: "tesla",
        name: "เทสลา",
        nameEn: "Tesla",
        country: "อเมริกา",
        logoUrl: "https://vl.imgix.net/img/tesla-logo.png",
        models: [
            { name: "Model 3", type: "รถเก๋ง (Sedan)" },
            { name: "Model S", type: "รถเก๋ง (Sedan)" },
            { name: "Model Y", type: "SUV" },
            { name: "Model X", type: "SUV" },
            { name: "Cybertruck", type: "รถกระบะ (Pickup)" }
        ]
    }
];

// Chinese Brands - Growing presence in Thailand
export const CHINESE_BRANDS: VehicleBrand[] = [
    {
        id: "byd",
        name: "บีวายดี (BYD)",
        nameEn: "BYD",
        country: "จีน",
        logoUrl: "https://vl.imgix.net/img/byd-logo.png",
        models: [
            { name: "Atto 3", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Dolphin", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Seal", type: "รถสปอร์ต (Sport)" },
            { name: "M6", type: "รถตู้ (MPV)" },
            { name: "Yuan Plus", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Tang", type: "SUV" },
            { name: "Han", type: "รถเก๋ง (Sedan)" },
            { name: "Song Plus", type: "SUV" }
        ]
    },
    {
        id: "mg",
        name: "เอ็มจี (MG)",
        nameEn: "MG",
        country: "จีน",
        logoUrl: "https://vl.imgix.net/img/mg-logo.png",
        models: [
            { name: "ZS", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "ZS EV", type: "รถไฟฟ้า (EV)" },
            { name: "4", type: "รถไฟฟ้า (EV)" },
            { name: "5", type: "รถตู้ (MPV)" },
            { name: "EXTENDER", type: "รถกระบะ (Pickup)" },
            { name: "GT", type: "รถสปอร์ต (Sport)" },
            { name: "VS", type: "รถตู้ (MPV)" }
        ]
    },
    {
        id: "gwm",
        name: "จีดับเบิลยูเอ็ม (GWM)",
        nameEn: "GWM",
        country: "จีน",
        logoUrl: "https://vl.imgix.net/img/great-wall-logo.png",
        models: [
            { name: "Haval Jolion", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Haval H6", type: "SUV" },
            { name: "Wingle 7", type: "รถกระบะ (Pickup)" },
            { name: "Poer", type: "รถกระบะ (Pickup)" },
            { name: "ORA Good Cat", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "ORA Grand Cat", type: "รถเก๋ง (Sedan)" },
            { name: "Tank 300", type: "SUV" },
            { name: "Tank 500", type: "SUV" }
        ]
    },
    {
        id: "changan",
        name: "ฉางอัน",
        nameEn: "Changan",
        country: "จีน",
        logoUrl: "https://vl.imgix.net/img/changan-logo.png",
        models: [
            { name: "Hunter", type: "รถกระบะ (Pickup)" },
            { name: "CS95", type: "SUV" },
            { name: "UNI-V", type: "รถเก๋ง (Sedan)" },
            { name: "UNI-K", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Lumin", type: "รถไฟฟ้า (EV)" },
            { name: "Deepal SL03", type: "รถไฟฟ้า (EV)" },
            { name: "Deepal S7", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "neta",
        name: "เนทา (NETA)",
        nameEn: "NETA",
        country: "จีน",
        logoUrl: "/logos/neta.svg",
        models: [
            { name: "NETA V", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "NETA U-II", type: "SUV" },
            { name: "NETA X", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "NETA S", type: "รถสปอร์ต (Sport)" },
            { name: "NETA GT", type: "รถสปอร์ต (Sport)" }
        ]
    },
    {
        id: "ora",
        name: "โอร่า (ORA)",
        nameEn: "ORA",
        country: "จีน",
        logoUrl: "/logos/ora.svg",
        models: [
            { name: "ORA Good Cat", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "ORA Grand Cat", type: "รถเก๋ง (Sedan)" }
        ]
    },
    {
        id: "chery",
        name: "เชอรี่",
        nameEn: "Chery",
        country: "จีน",
        logoUrl: "https://vl.imgix.net/img/chery-logo.png",
        models: [
            { name: "Tiggo 7 Pro", type: "SUV" },
            { name: "Tiggo 8 Pro", type: "SUV" },
            { name: "Omoda 5", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Omoda E5", type: "รถไฟฟ้า (EV)" },
            { name: "Jaecoo 7", type: "SUV" }
        ]
    },
    {
        id: "hycan",
        name: "ไฮแคน",
        nameEn: "Hycan",
        country: "จีน",
        logoUrl: "/logos/hycan.svg",
        models: [
            { name: "AION", type: "รถไฟฟ้า (EV)" },
            { name: "Z03", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "wuling",
        name: "หวูลิง",
        nameEn: "Wuling",
        country: "จีน",
        logoUrl: "https://vl.imgix.net/img/wuling-logo.png",
        models: [
            { name: "HongGuang Mini EV", type: "รถไฟฟ้า (EV)" },
            { name: "Air EV", type: "รถไฟฟ้า (EV)" }
        ]
    },
    {
        id: "jac",
        name: "เจเอซี",
        nameEn: "JAC",
        country: "จีน",
        logoUrl: "/logos/jac.svg",
        models: [
            { name: "iC5", type: "รถตู้ (MPV)" },
            { name: "T8", type: "รถกระบะ (Pickup)" },
            { name: "N75", type: "รถกระบะ (Pickup)" }
        ]
    }
];

// Korean Brands
export const KOREAN_BRANDS: VehicleBrand[] = [
    {
        id: "hyundai",
        name: "ฮุนได",
        nameEn: "Hyundai",
        country: "เกาหลีใต้",
        logoUrl: "https://vl.imgix.net/img/hyundai-logo.png",
        models: [
            { name: "Elantra", type: "รถเก๋ง (Sedan)" },
            { name: "Accent", type: "รถเก๋ง (Sedan)" },
            { name: "Sonata", type: "รถเก๋ง (Sedan)" },
            { name: "Ioniq 5", type: "รถไฟฟ้า (EV)" },
            { name: "Ioniq 6", type: "รถไฟฟ้า (EV)" },
            { name: "Creta", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Venue", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Tucson", type: "SUV" },
            { name: "Santa Fe", type: "SUV" },
            { name: "Palisade", type: "SUV" },
            { name: "H100", type: "รถตู้ (MPV)" }
        ]
    },
    {
        id: "kia",
        name: "คิอา",
        nameEn: "Kia",
        country: "เกาหลีใต้",
        logoUrl: "https://vl.imgix.net/img/kia-logo.png",
        models: [
            { name: "Rio", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Pegas", type: "รถเก๋ง (Sedan)" },
            { name: "K3", type: "รถเก๋ง (Sedan)" },
            { name: "K5", type: "รถเก๋ง (Sedan)" },
            { name: "K8", type: "รถเก๋ง (Sedan)" },
            { name: "Seltos", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Sonet", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "Sportage", type: "SUV" },
            { name: "Sorento", type: "SUV" },
            { name: "Carnival", type: "รถตู้ (MPV)" },
            { name: "EV6", type: "รถไฟฟ้า (EV)" }
        ]
    }
];

// Other Asian Brands
export const OTHER_BRANDS: VehicleBrand[] = [
    {
        id: "proton",
        name: "โปรตัน",
        nameEn: "Proton",
        country: "มาเลเซีย",
        logoUrl: "https://vl.imgix.net/img/proton-logo.png",
        models: [
            { name: "Persona", type: "รถเก๋ง (Sedan)" },
            { name: "Iriz", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Exora", type: "รถตู้ (MPV)" },
            { name: "X50", type: "รถครอสโอเวอร์ (Crossover)" },
            { name: "X70", type: "SUV" },
            { name: "X90", type: "SUV" }
        ]
    },
    {
        id: "perodua",
        name: "เปอโดซ",
        nameEn: "Perodua",
        country: "มาเลเซีย",
        logoUrl: "https://vl.imgix.net/img/perodua-logo.png",
        models: [
            { name: "Bezza", type: "รถเก๋ง (Sedan)" },
            { name: "Axia", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Myvi", type: "รถแฮตช์แบ็ก (Hatchback)" },
            { name: "Alza", type: "รถตู้ (MPV)" }
        ]
    }
];

// Combined all brands
export const ALL_BRANDS: VehicleBrand[] = [
    ...JAPANESE_BRANDS,
    ...EUROPEAN_BRANDS,
    ...AMERICAN_BRANDS,
    ...CHINESE_BRANDS,
    ...KOREAN_BRANDS,
    ...OTHER_BRANDS
];

// Helper function to get models by brand
export function getModelsByBrand(brandName: string): string[] {
    const brand = ALL_BRANDS.find((b) => b.name === brandName || b.nameEn === brandName);
    return brand?.models.map((m) => m.name) || [];
}

// Helper function to get brand logo URL
export function getBrandLogoUrl(brandName: string): string | undefined {
    const brand = ALL_BRANDS.find((b) => b.name === brandName || b.nameEn === brandName);
    return brand?.logoUrl;
}

// Helper function to get all brand names for dropdown
export function getAllBrandNames(): string[] {
    return ALL_BRANDS.map((b) => b.name);
}

// Helper function to get models filtered by type
export function getModelsByBrandAndType(brandName: string, vehicleType: VehicleType): string[] {
    const brand = ALL_BRANDS.find((b) => b.name === brandName || b.nameEn === brandName);
    return brand?.models.filter((m) => m.type === vehicleType).map((m) => m.name) || [];
}
