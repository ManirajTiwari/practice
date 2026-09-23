import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String },
    pharmacyName: { type: String },
    secondaryPhone: { type: String },
    address: { type: String },
    currencyName: { type: String },
    currencySymbol: { type: String },
    subscriptionActive: { type: Boolean, default: false },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

export const User = model("User", userSchema);