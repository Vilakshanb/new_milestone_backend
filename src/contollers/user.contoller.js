import { comparePassword, encryptPassword } from "../helpers/bcrypt";
import { ROLES } from "../helpers/constant";
import { generateAccessJwt } from "../helpers/jwt";
import userModel from "../models/user.model";
import UserFcmTokens from "../models/userFcmTokens";

export const login = async (req, res, next) => {
  try {
    let UserExistCheck = await userModel.findOne({ $or: [{ email: new RegExp(`^${req.body.email}$`) }] });
    if (!UserExistCheck) throw new Error(`User Does Not Exist`);
    let passwordCheck = await comparePassword(UserExistCheck.password, req.body.password);
    if (!passwordCheck) throw new Error(`Invalid Credentials`);

    let token = await generateAccessJwt({
      userId: UserExistCheck._id,
      role: UserExistCheck.role,
      orgId: UserExistCheck.orgId ? UserExistCheck.orgId : null,
      user: {
        name: UserExistCheck.name,
        email: UserExistCheck.email,
        phone: UserExistCheck.phone,
        _id: UserExistCheck._id,
      },
    });
    res.status(200).json({ message: "User Logged In", token });
  } catch (error) {
    next(error);
  }
};

export const loginAgent = async (req, res, next) => {
  try {
    console.log(req.body);
    let UserExistCheck = await userModel
      .findOne({ $and: [{ email: new RegExp(`^${req.body.email}$`, "i") }, { role: ROLES.SUBBROKER }] })
      .lean()
      .exec();

    console.log(UserExistCheck, "USER EXIST");
    if (!UserExistCheck) throw new Error(`User Does Not Exist`);
    let passwordCheck = await comparePassword(UserExistCheck.password, req.body.password);
    if (!passwordCheck) throw new Error(`Invalid Credentials`);

    let token = await generateAccessJwt({
      userId: UserExistCheck._id,
      role: UserExistCheck.role,
      orgId: UserExistCheck.orgId ? UserExistCheck.orgId : "Root",
      user: {
        name: UserExistCheck.name,
        email: UserExistCheck.email,
        phone: UserExistCheck.phone,
        _id: UserExistCheck._id,
      },
    });

    console.log(token, "IN THiS ROUTE");

    res.status(200).json({ message: "User Logged In", token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    console.log(req.body);

    let UserExistEmailCheck = await userModel.findOne({
      email: new RegExp(`^${req.body.email}$`),
    });

    if (UserExistEmailCheck) throw new Error(`User with this email Already Exists`);

    let UserExistPhoneCheck = await userModel.findOne({
      phone: req.body.phone,
    });
    if (UserExistPhoneCheck) throw new Error(`User with this phone Already Exists`);

    req.body.password = await encryptPassword(req.body.password);
    await new userModel(req.body).save();

    res.status(201).json({ message: "User Created" });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    // if(req.user)
    console.log(req.user);
    let users = [];
    if (req?.user?.userObj?.role == ROLES.ORG) {
      users = await userModel.find({ orgId: req.user.userId }).lean().exec();
    } else {
      users = await userModel.find({}).lean().exec();
    }
    res.json({ message: "Users get", data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    let user = await userModel.findById(req.params.id).exec();
    if (!user) throw new Error("User not found");
    res.json({ message: "User get", data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    let user = await userModel.findByIdAndUpdate(req.params.id, req.body).exec();
    if (!user) throw new Error("User not found");
    res.json({ message: "User Updated" });
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    let user = await userModel.findByIdAndDelete(req.params.id).exec();
    if (!user) throw new Error("User not found");
    res.json({ message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

export const registerUserFcmToken = async (req, res, next) => {
  try {
    console.log(req.body.userId);
    const userFcmTokenObj = await UserFcmTokens.findOne({ token: req.body.token }).exec();
    if (!userFcmTokenObj) await new UserFcmTokens({ userId: req.body.userId, token: req.body.token }).save();
    else await UserFcmTokens.findByIdAndUpdate(userFcmTokenObj._id, { userId: req.body.userId }).exec();

    res.status(200).json({ message: "Token set", success: true });
  } catch (error) {
    next(error);
  }
};
