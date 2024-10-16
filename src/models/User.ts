import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import UserRoles from "../types/UserRoles.js";
import { DatabaseError } from "../types/CustomErrors.js";
import { ValidationError } from "../types/CustomErrors.js";

interface interfaceUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRoles;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<interfaceUser> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this as interfaceUser;

  if (!user.isModified("password")) {
    console.log("Password not modified, skipping encryption.");
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;

    next();
  } catch (error) {
    const dbError: DatabaseError = new Error(
      "Error while encrypting the password"
    ) as DatabaseError;

    dbError.statusCode = 500;
    dbError.state = "error";
    dbError.query = "bcrypt.hash";

    next(dbError);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    const user = this as interfaceUser;
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error) {
    const validationError: ValidationError = new Error(
      "Error while comparing passwords"
    ) as ValidationError;
    validationError.statusCode = 400;
    validationError.state = "error";
    validationError.validationErrors = ["Password comparison failed"];
    throw validationError;
  }
};

const user = mongoose.model<interfaceUser>("User", userSchema);

export default user;
