import { Schema, Types, model } from "mongoose";

export enum WeekDay {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export interface IAvailability {
  provider: Types.ObjectId;
  dayOfWeek: WeekDay;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const availabilitySchema = new Schema<IAvailability>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    dayOfWeek: {
      type: Number,
      enum: Object.values(WeekDay),
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

availabilitySchema.index({
  provider: 1,
  dayOfWeek: 1,
});

export const Availability = model<IAvailability>("Availability", availabilitySchema);
