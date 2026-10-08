import { Schema, Types, model } from "mongoose";

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export interface IAppointment {
  customer: Types.ObjectId;
  provider: Types.ObjectId;
  service: Types.ObjectId;

  startTime: Date;
  endTime: Date;

  status: AppointmentStatus;

  notes?: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

appointmentSchema.index({
  provider: 1,
  startTime: 1,
  endTime: 1,
});

export const Appointment = model<IAppointment>("Appointment", appointmentSchema);
