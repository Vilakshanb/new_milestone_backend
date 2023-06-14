import FixedDeposit from "../models/FixedDeposit.model";
import Client from "../models/clients.model";
export const createFd = async (req, res, next) => {
  try {
    let return_id = "";
    let createNewRecord = true;

    if (req.body._id) {
      let existCheck = await Client.findOne({ mobileNo: req.body.investorMobile }).lean().exec();
      if (!existCheck) throw new Error("Client Not Found . Please Add New Client");
      if (existCheck.fullName != req.body.investor) {
        throw new Error("Client Not Found. Please Add New Client");
      }
      let onBoardingUser = await FixedDeposit.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      let existCheck = await Client.findOne({ mobileNo: req.body.investorMobile }).lean().exec();
      if (!existCheck) throw new Error("Client Not Found . Please Add New Client");

      if (existCheck.fullName != req.body.investor) {
        throw new Error("Client Not Found. Please Add New Client");
      }
      if (existCheck.mobileNo != req.body.investorMobile) {
        throw new Error("Client Not Found. Please Add new Client");
      }
      req.body.investorId = existCheck?._id;
      req.body.investorMobileNo = existCheck?.mobileNo;
      req.body.investorName = existCheck?.fullName;
      let obj = await new FixedDeposit(req.body).save();
      return_id = obj._id;
    }

    res.status(200).json({ message: "Success", data: return_id, success: true });
  } catch (error) {
    next(error);
  }
};

export const getFd = async (req, res, next) => {
  try {
    let findObj = {};
    if (req.user.subscription?.orgId) {
      findObj = {
        orgId: req.user.subscription?.orgId,
      };
    }
    const clients = await FixedDeposit.find(findObj).sort({ createdAt: -1 }).lean().exec();
    res.status(200).json({ message: "Clients", data: clients, success: true });
  } catch (error) {
    next(error);
  }
};
export const getById = async (req, res, next) => {
  try {
    let obj = await FixedDeposit.findById(req.params.id).lean().exec();
    res.status(200).json({ message: "obj", data: obj, success: true });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    let onBoardingUser = await FixedDeposit.findByIdAndUpdate(req.params.id, { [req.body.keyName]: req.file.filename }).exec();
    if (!onBoardingUser) {
      throw new Error("User not found");
    }
    res.json({ message: "File Uploaded" });
  } catch (error) {
    next(error);
  }
};

export const deleteFdById = async (req, res, next) => {
  try {
    await FixedDeposit.findByIdAndDelete(req.params.id).lean().exec();
    res.status(200).json({ message: "Fixed Deposit Deleted", success: true });
  } catch (error) {
    next(error);
  }
};
