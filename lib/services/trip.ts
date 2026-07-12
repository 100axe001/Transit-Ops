import { tripRepository, vehicleRepository, driverRepository } from "@/lib/repositories";
import { tripSchema, TripFormData, completeTripSchema, CompleteTripFormData } from "@/lib/validations";
import {
  canVehicleBeDispatched,
  canCarryLoad,
  getVehicleStatusAfterDispatch,
  getVehicleStatusAfterTripComplete,
  getVehicleStatusAfterTripCancel,
} from "@/lib/domain/vehicle";
import {
  isDriverDispatchable,
  getDriverStatusAfterDispatch,
  getDriverStatusAfterTripComplete,
  getDriverStatusAfterTripCancel,
} from "@/lib/domain/driver";
import { canDispatchTrip, canCompleteTrip, canCancelTrip } from "@/lib/domain/trip";
import { TripStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const tripService = {
  async list(params?: { search?: string; status?: TripStatus; page?: number; pageSize?: number }) {
    const [trips, total] = await Promise.all([
      tripRepository.findAll(params),
      tripRepository.count(params),
    ]);
    return { trips, total };
  },

  async getById(id: string) {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new Error("Trip not found");
    return trip;
  },

  async getRecent(limit = 5) {
    return tripRepository.findRecent(limit);
  },

  async create(data: TripFormData) {
    const parsed = tripSchema.parse(data);

    const vehicle = await vehicleRepository.findById(parsed.vehicleId);
    if (!vehicle) throw new Error("Vehicle not found");

    const driver = await driverRepository.findById(parsed.driverId);
    if (!driver) throw new Error("Driver not found");

    const vehicleCheck = canVehicleBeDispatched(vehicle);
    if (!vehicleCheck.valid) throw new Error(vehicleCheck.error);

    const driverCheck = isDriverDispatchable(driver);
    if (!driverCheck.valid) throw new Error(driverCheck.error);

    const loadCheck = canCarryLoad(vehicle.maximumLoadCapacity, parsed.cargoWeight);
    if (!loadCheck.valid) throw new Error(loadCheck.error);

    return tripRepository.create({
      source: parsed.source,
      destination: parsed.destination,
      cargoWeight: parsed.cargoWeight,
      plannedDistance: parsed.plannedDistance,
      revenue: parsed.revenue,
      status: "DRAFT",
      vehicle: { connect: { id: parsed.vehicleId } },
      driver: { connect: { id: parsed.driverId } },
    });
  },

  async dispatch(id: string) {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new Error("Trip not found");

    const statusCheck = canDispatchTrip(trip.status);
    if (!statusCheck.valid) throw new Error(statusCheck.error);

    const vehicleCheck = canVehicleBeDispatched(trip.vehicle);
    if (!vehicleCheck.valid) throw new Error(vehicleCheck.error);

    const driverCheck = isDriverDispatchable(trip.driver);
    if (!driverCheck.valid) throw new Error(driverCheck.error);

    return prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: getVehicleStatusAfterDispatch() },
      });
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: getDriverStatusAfterDispatch() },
      });
      return tx.trip.update({
        where: { id },
        data: { status: "DISPATCHED", startTime: new Date() },
        include: { vehicle: true, driver: true },
      });
    });
  },

  async complete(id: string, data: CompleteTripFormData) {
    const parsed = completeTripSchema.parse(data);
    const trip = await tripRepository.findById(id);
    if (!trip) throw new Error("Trip not found");

    const statusCheck = canCompleteTrip(trip.status);
    if (!statusCheck.valid) throw new Error(statusCheck.error);

    return prisma.$transaction(async (tx) => {
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: getVehicleStatusAfterTripComplete(),
          odometer: { increment: parsed.actualDistance },
        },
      });
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: getDriverStatusAfterTripComplete() },
      });
      return tx.trip.update({
        where: { id },
        data: {
          status: "COMPLETED",
          actualDistance: parsed.actualDistance,
          fuelConsumed: parsed.fuelConsumed,
          endTime: new Date(),
        },
        include: { vehicle: true, driver: true },
      });
    });
  },

  async cancel(id: string) {
    const trip = await tripRepository.findById(id);
    if (!trip) throw new Error("Trip not found");

    const statusCheck = canCancelTrip(trip.status);
    if (!statusCheck.valid) throw new Error(statusCheck.error);

    const wasDispatched = trip.status === "DISPATCHED";

    return prisma.$transaction(async (tx) => {
      if (wasDispatched) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: getVehicleStatusAfterTripCancel() },
        });
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: getDriverStatusAfterTripCancel() },
        });
      }
      return tx.trip.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: { vehicle: true, driver: true },
      });
    });
  },

  async getStatusCounts() {
    return tripRepository.countByStatus();
  },
};
