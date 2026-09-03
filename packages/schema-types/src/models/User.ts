import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  id?: string;
  email: string;
  password?: string;
  fullName: string;
  role: "admin" | "company" | "candidate";
  googleId?: string;
  avatarUrl?: string;
  phone?: string;
  emailVerified: boolean;
  companyId?: string;
  candidateId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "company", "candidate"],
      default: "company",
      index: true,
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: String,
      sparse: true,
      index: true,
    },
    candidateId: {
      type: String,
      sparse: true,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        ret.id = ret._id ? String(ret._id) : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Hash password before saving if modified
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
