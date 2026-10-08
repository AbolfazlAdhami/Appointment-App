import { Schema, Types, model } from "mongoose";

export interface IService {
  provider: Types.ObjectId;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

const serviceSchema = new Schema<IService>(
  {
    provider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
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

export const Service = model<IService>("Service", serviceSchema);
