// Database seed script - generates demo data for all modules
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Users
  const password = await bcrypt.hash("password123", 12);
  const users = await Promise.all([
    prisma.user.create({ data: { name: "Sarah Johnson", email: "fleet@transitops.com", password, role: "FLEET_MANAGER" } }),
    prisma.user.create({ data: { name: "Mike Chen", email: "dispatch@transitops.com", password, role: "DISPATCHER" } }),
    prisma.user.create({ data: { name: "Lisa Park", email: "safety@transitops.com", password, role: "SAFETY_OFFICER" } }),
    prisma.user.create({ data: { name: "David Kim", email: "finance@transitops.com", password, role: "FINANCIAL_ANALYST" } }),
  ]);
  console.log(`Created ${users.length} users`);

  // Vehicles
  const vehicleData = [
    { registrationNumber: "TRK-001", vehicleName: "Highway Hauler", model: "Volvo FH16", vehicleType: "TRUCK" as const, maximumLoadCapacity: 25000, acquisitionCost: 120000, odometer: 145000, region: "North" },
    { registrationNumber: "TRK-002", vehicleName: "Road Runner", model: "Scania R500", vehicleType: "TRUCK" as const, maximumLoadCapacity: 22000, acquisitionCost: 115000, odometer: 98000, region: "South" },
    { registrationNumber: "TRK-003", vehicleName: "Thunder Bolt", model: "MAN TGX", vehicleType: "TRUCK" as const, maximumLoadCapacity: 20000, acquisitionCost: 105000, odometer: 210000, region: "East" },
    { registrationNumber: "TRK-004", vehicleName: "Iron Horse", model: "DAF XF", vehicleType: "TRUCK" as const, maximumLoadCapacity: 24000, acquisitionCost: 110000, odometer: 175000, region: "West" },
    { registrationNumber: "TRK-005", vehicleName: "Night Rider", model: "Mercedes Actros", vehicleType: "TRUCK" as const, maximumLoadCapacity: 26000, acquisitionCost: 135000, odometer: 67000, region: "North" },
    { registrationNumber: "VAN-001", vehicleName: "City Sprint", model: "Ford Transit", vehicleType: "VAN" as const, maximumLoadCapacity: 1500, acquisitionCost: 35000, odometer: 45000, region: "Central" },
    { registrationNumber: "VAN-002", vehicleName: "Metro Express", model: "Mercedes Sprinter", vehicleType: "VAN" as const, maximumLoadCapacity: 2000, acquisitionCost: 42000, odometer: 38000, region: "Central" },
    { registrationNumber: "VAN-003", vehicleName: "Quick Deliver", model: "Iveco Daily", vehicleType: "VAN" as const, maximumLoadCapacity: 1800, acquisitionCost: 38000, odometer: 52000, region: "East" },
    { registrationNumber: "VAN-004", vehicleName: "Urban Fleet", model: "Peugeot Boxer", vehicleType: "VAN" as const, maximumLoadCapacity: 1600, acquisitionCost: 32000, odometer: 61000, region: "West" },
    { registrationNumber: "VAN-005", vehicleName: "Rapid Cargo", model: "Renault Master", vehicleType: "VAN" as const, maximumLoadCapacity: 1700, acquisitionCost: 34000, odometer: 29000, region: "South" },
    { registrationNumber: "BUS-001", vehicleName: "Commuter One", model: "Volvo 9700", vehicleType: "BUS" as const, maximumLoadCapacity: 5000, acquisitionCost: 250000, odometer: 320000, region: "North" },
    { registrationNumber: "BUS-002", vehicleName: "Express Line", model: "Scania Touring", vehicleType: "BUS" as const, maximumLoadCapacity: 4500, acquisitionCost: 230000, odometer: 280000, region: "South" },
    { registrationNumber: "BUS-003", vehicleName: "City Link", model: "Mercedes Tourismo", vehicleType: "BUS" as const, maximumLoadCapacity: 4800, acquisitionCost: 240000, odometer: 195000, region: "Central" },
    { registrationNumber: "SDN-001", vehicleName: "Executive", model: "Toyota Camry", vehicleType: "SEDAN" as const, maximumLoadCapacity: 400, acquisitionCost: 28000, odometer: 15000, region: "Central" },
    { registrationNumber: "SDN-002", vehicleName: "Manager Fleet", model: "Honda Accord", vehicleType: "SEDAN" as const, maximumLoadCapacity: 380, acquisitionCost: 30000, odometer: 22000, region: "North" },
    { registrationNumber: "SUV-001", vehicleName: "Field Ops", model: "Toyota Land Cruiser", vehicleType: "SUV" as const, maximumLoadCapacity: 800, acquisitionCost: 65000, odometer: 88000, region: "East" },
    { registrationNumber: "SUV-002", vehicleName: "Terrain Master", model: "Ford Ranger", vehicleType: "SUV" as const, maximumLoadCapacity: 1000, acquisitionCost: 55000, odometer: 45000, region: "West" },
    { registrationNumber: "TRK-006", vehicleName: "Steel Giant", model: "Kenworth T680", vehicleType: "TRUCK" as const, maximumLoadCapacity: 28000, acquisitionCost: 145000, odometer: 55000, region: "North" },
    { registrationNumber: "TRK-007", vehicleName: "Long Haul", model: "Peterbilt 579", vehicleType: "TRUCK" as const, maximumLoadCapacity: 27000, acquisitionCost: 140000, odometer: 132000, region: "South" },
    { registrationNumber: "VAN-006", vehicleName: "Parcel Pro", model: "Fiat Ducato", vehicleType: "VAN" as const, maximumLoadCapacity: 1400, acquisitionCost: 30000, odometer: 73000, region: "Central" },
    { registrationNumber: "TRK-008", vehicleName: "Blue Titan", model: "Freightliner Cascadia", vehicleType: "TRUCK" as const, maximumLoadCapacity: 30000, acquisitionCost: 155000, odometer: 89000, status: "IN_SHOP" as const, region: "East" },
    { registrationNumber: "VAN-007", vehicleName: "Swift Move", model: "VW Crafter", vehicleType: "VAN" as const, maximumLoadCapacity: 1900, acquisitionCost: 40000, odometer: 31000, region: "West" },
    { registrationNumber: "TRK-009", vehicleName: "Desert Storm", model: "Mack Anthem", vehicleType: "TRUCK" as const, maximumLoadCapacity: 25000, acquisitionCost: 130000, odometer: 245000, status: "RETIRED" as const, region: "South" },
    { registrationNumber: "BUS-004", vehicleName: "Metro Shuttle", model: "BYD K9", vehicleType: "BUS" as const, maximumLoadCapacity: 4000, acquisitionCost: 280000, odometer: 110000, region: "Central" },
    { registrationNumber: "SUV-003", vehicleName: "Scout", model: "Jeep Wrangler", vehicleType: "SUV" as const, maximumLoadCapacity: 600, acquisitionCost: 48000, odometer: 37000, region: "North" },
  ];

  const vehicles = await Promise.all(
    vehicleData.map((v) => prisma.vehicle.create({ data: v }))
  );
  console.log(`Created ${vehicles.length} vehicles`);

  // Drivers
  const driverData = Array.from({ length: 40 }, (_, i) => {
    const names = [
      "Alex Thompson", "Maria Garcia", "James Wilson", "Emma Davis", "Robert Brown",
      "Jennifer Martinez", "William Anderson", "Patricia Taylor", "John Thomas", "Linda Jackson",
      "Michael White", "Barbara Harris", "David Martin", "Susan Clark", "Richard Lewis",
      "Jessica Robinson", "Joseph Walker", "Sarah Hall", "Thomas Allen", "Karen Young",
      "Charles King", "Nancy Wright", "Daniel Lopez", "Betty Hill", "Matthew Scott",
      "Margaret Green", "Anthony Adams", "Sandra Baker", "Mark Gonzalez", "Ashley Nelson",
      "Donald Carter", "Dorothy Mitchell", "Steven Perez", "Kimberly Roberts", "Paul Turner",
      "Emily Phillips", "Andrew Campbell", "Michelle Parker", "Joshua Evans", "Amanda Edwards",
    ];
    const categories = ["Heavy Vehicle", "Light Vehicle", "Bus", "Hazmat"];
    const statuses = ["AVAILABLE", "AVAILABLE", "AVAILABLE", "AVAILABLE", "OFF_DUTY", "SUSPENDED"] as const;
    const expiryOffset = i < 35 ? (90 + i * 30) : -(i - 35) * 10;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryOffset);

    return {
      name: names[i],
      licenseNumber: `DL-${String(1000 + i).slice(1)}-${String(2025 + Math.floor(i / 10))}`,
      category: categories[i % categories.length],
      expiryDate,
      phone: `+1-555-${String(1000 + i * 7).slice(0, 4)}`,
      safetyScore: Math.max(60, 100 - Math.floor(Math.random() * 30)),
      status: statuses[i % statuses.length],
    };
  });

  const drivers = await Promise.all(
    driverData.map((d) => prisma.driver.create({ data: d }))
  );
  console.log(`Created ${drivers.length} drivers`);

  // Trips
  const routes = [
    ["New York", "Boston"], ["Los Angeles", "San Francisco"], ["Chicago", "Detroit"],
    ["Houston", "Dallas"], ["Miami", "Orlando"], ["Seattle", "Portland"],
    ["Denver", "Salt Lake City"], ["Atlanta", "Charlotte"], ["Phoenix", "Las Vegas"],
    ["Philadelphia", "Washington DC"],
  ];

  const availableVehicles = vehicles.filter(v => v.status === "AVAILABLE");
  const availableDrivers = drivers.filter(d => d.status === "AVAILABLE");

  const trips = [];
  for (let i = 0; i < 50; i++) {
    const route = routes[i % routes.length];
    const vehicle = availableVehicles[i % availableVehicles.length];
    const driver = availableDrivers[i % availableDrivers.length];
    const statuses = ["COMPLETED", "COMPLETED", "COMPLETED", "COMPLETED", "DRAFT", "CANCELLED"] as const;
    const status = statuses[i % statuses.length];
    const plannedDistance = 200 + Math.floor(Math.random() * 800);
    const revenue = 500 + Math.floor(Math.random() * 3000);

    const startTime = new Date();
    startTime.setDate(startTime.getDate() - (60 - i));
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 4 + Math.floor(Math.random() * 20));

    const trip = await prisma.trip.create({
      data: {
        source: route[0],
        destination: route[1],
        cargoWeight: Math.floor(Math.random() * vehicle.maximumLoadCapacity * 0.8),
        plannedDistance,
        actualDistance: status === "COMPLETED" ? plannedDistance + Math.floor(Math.random() * 50 - 25) : null,
        fuelConsumed: status === "COMPLETED" ? plannedDistance / (3 + Math.random() * 4) : null,
        startTime: status !== "DRAFT" ? startTime : null,
        endTime: status === "COMPLETED" ? endTime : null,
        revenue,
        status,
        vehicleId: vehicle.id,
        driverId: driver.id,
      },
    });
    trips.push(trip);
  }
  console.log(`Created ${trips.length} trips`);

  // Maintenance Records
  const maintenanceTitles = [
    "Oil Change", "Brake Service", "Engine Repair", "Tire Replacement",
    "Transmission Service", "AC Repair", "Battery Replacement", "Suspension Check",
    "Exhaust System Repair", "Electrical Diagnostics", "Coolant Flush", "Fuel Injector Service",
    "Alignment Check", "Windshield Replacement", "Turbo Service",
  ];

  for (let i = 0; i < 15; i++) {
    const vehicle = vehicles[i % vehicles.length];
    const openedAt = new Date();
    openedAt.setDate(openedAt.getDate() - (30 - i * 2));
    const isClosed = i < 12;

    await prisma.maintenance.create({
      data: {
        vehicleId: vehicle.id,
        title: maintenanceTitles[i],
        description: `Scheduled ${maintenanceTitles[i].toLowerCase()} service for ${vehicle.vehicleName}`,
        cost: 200 + Math.floor(Math.random() * 2000),
        status: isClosed ? "CLOSED" : "OPEN",
        openedAt,
        closedAt: isClosed ? new Date(openedAt.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
      },
    });
  }
  console.log("Created 15 maintenance records");

  // Fuel Logs
  for (let i = 0; i < 120; i++) {
    const vehicle = vehicles[i % vehicles.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));

    await prisma.fuelLog.create({
      data: {
        vehicleId: vehicle.id,
        liters: 30 + Math.floor(Math.random() * 200),
        cost: 50 + Math.floor(Math.random() * 400),
        date,
        odometer: vehicle.odometer + Math.floor(Math.random() * 5000),
      },
    });
  }
  console.log("Created 120 fuel logs");

  // Expenses
  const expenseTypes = ["TOLL", "REPAIR", "INSURANCE", "PARKING", "OTHER"] as const;
  for (let i = 0; i < 100; i++) {
    const vehicle = vehicles[i % vehicles.length];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));

    await prisma.expense.create({
      data: {
        vehicleId: vehicle.id,
        type: expenseTypes[i % expenseTypes.length],
        amount: 20 + Math.floor(Math.random() * 500),
        description: `${expenseTypes[i % expenseTypes.length]} expense for ${vehicle.vehicleName}`,
        date,
      },
    });
  }
  console.log("Created 100 expenses");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
