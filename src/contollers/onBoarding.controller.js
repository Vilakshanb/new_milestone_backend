/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
import { onBoardingBasicClientInfo } from "../Builders/OnBoarding.builder";
import onBoardingRawDataModel from "../models/onBoardingRawData.model";
import { captchaCreate, executeSignzy, investorLogin, loginChannel, onBoardingObjectCreation, onBoardingUpdateForm, uploadImageToSignzy, verifyCaptcha } from "../services/signzy";
import fs from "fs/promises";
import onBoardingSignzyData from "../models/onBoardingSignzyData";
import { getFilePath } from "../utils/onBoarding.util";
import onBoardingSignzyImageData from "../models/onBoardingSignzyImageData";
import moment from "moment";
import { TYPE_OF_ADDRESS } from "../helpers/constant";
import { nseFacta, nseOnboardingCreateCustomer } from "../services/nse";
import onBoardingNSE from "../models/onBoardingNSE";
import { bseOnboardingCreateCustomer } from "../services/bse";
import onBoardingBSE from "../models/onBoardingBSE";
import { storeFileAndReturnNameBase64 } from "../helpers/fileSystem";
import { aesDecrypt, aesEncrypt, decryptAes, encryptAes } from "../crypto/aes";
import { verifyKyc } from "../services/kyc";
import nseBseStateModel from "../models/nseBseState.model";
import countryModel from "../models/country.model";
import cityModel from "../models/city.model";
import nseBseTaxStatusModel from "../models/nseBseTaxStatus.model";
import nseBseHoldingModel from "../models/nseBseHolding.model";
import { SIGNZY_INCOME_RANGE, SIGNZY_PASSWORD, SIGNZY_USERNAME } from "../helpers/signzyConstants";

const convert = require("xml-js");

export const saveOnBoarding = async (req, res, next) => {
  try {
    // TODO: if data exists according to PAN DETAILS then update else create new record
    let return_id = "";
    let createNewRecord = true;

    console.log(req.body);

    if (!req.body._id && req.body.panNumber && req.body.bseTaxStatus && req.body.bseHoldingNature) {
      let onBoardingUser = await onBoardingRawDataModel
        .findOneAndUpdate(
          {
            panNumber: req.body.panNumber,
            bseTaxStatus: req.body.bseTaxStatus,
            bseHoldingNature: req.body.bseHoldingNature,
          },
          req.body
        )
        .exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = onBoardingUser?._id;
    }

    if (req.body._id) {
      // console.log(req.body);

      let onBoardingUser = await onBoardingRawDataModel.findByIdAndUpdate(req.body._id, req.body).exec();
      if (onBoardingUser) createNewRecord = false;
      return_id = req.body._id;
    }

    if (createNewRecord) {
      let tempUserName = `${req.body.panNumber?.toLowerCase()}_${new Date().getTime()}`;
      req.body.username = tempUserName;
      let obj = await new onBoardingRawDataModel(req.body).save();
      return_id = obj._id;
    }
    res.json({ message: "User Updated", data: return_id });
  } catch (error) {
    next(error);
  }
};

export const getCountries = async (req, res, next) => {
  try {
    let findObj = {
      // bseCountryCode: 101,
    };
    // if (req.query.list == "all") {
    //   findObj = {};
    // }
    let stateArr = await countryModel.find(findObj).exec();
    res.json({ message: "Countries Found", data: stateArr });
  } catch (error) {
    next(error);
  }
};

export const getCities = async (req, res, next) => {
  try {
    let findObj = {};
    console.log(req.query);
    if (req.query.nseStateCode) {
      findObj.nseStateCode = req.query.nseStateCode;
    }

    let cityArr = await cityModel.find(findObj).exec();
    res.json({ message: "Cities Found", data: cityArr });
  } catch (error) {
    next(error);
  }
};

export const getStates = async (req, res, next) => {
  try {
    let findObj = {};
    if (req.query.countryCode) {
      findObj.countryCode = req.query.countryCode;
    }
    let stateArr = await nseBseStateModel.find(findObj).exec();
    res.json({ message: "States Found", data: stateArr });
  } catch (error) {
    next(error);
  }
};

export const getTax = async (req, res, next) => {
  try {
    let findObj = {};
    let taxArr = await nseBseTaxStatusModel.find(findObj).exec();
    res.json({ message: "Tax Found", data: taxArr });
  } catch (error) {
    next(error);
  }
};

export const getHolding = async (req, res, next) => {
  try {
    let findObj = {};
    let holdingArr = await nseBseHoldingModel.find(findObj).exec();
    res.json({ message: "Holding Found", data: holdingArr });
  } catch (error) {
    next(error);
  }
};

export const getIncomeCodes = async (req, res, next) => {
  try {
    let incomeArr = SIGNZY_INCOME_RANGE;
    res.json({ message: "Income Found", data: incomeArr });
  } catch (error) {
    next(error);
  }
};

export const getOnBoardingById = async (req, res, next) => {
  try {
    let onBoardingUser = await onBoardingRawDataModel.findById(req.params.id).exec();
    if (!onBoardingUser) {
      throw new Error("User not found");
    }
    res.json({ message: "User Found", data: onBoardingUser });
  } catch (error) {
    next(error);
  }
};

export const getAllOnBoarding = async (req, res, next) => {
  try {
    let onBoardingUsers = await onBoardingRawDataModel.find().exec();
    res.json({ message: "Onboarding Users Found", data: onBoardingUsers });
  } catch (error) {
    next(error);
  }
};

export const getAllOnBoardingClientInfo = async (req, res, next) => {
  try {
    let pipeline = await onBoardingBasicClientInfo();
    let arr = await onBoardingRawDataModel.aggregate(pipeline);
    res.status(200).json({ message: "Basic Info", data: arr, success: true });
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    let onBoardingUser = await onBoardingRawDataModel.findByIdAndUpdate(req.params.id, { [req.body.keyName]: req.file.filename }).exec();
    if (!onBoardingUser) {
      throw new Error("User not found");
    }
    res.json({ message: "File Uploaded" });
  } catch (error) {
    next(error);
  }
};

export const generateAndCreateCaptcha = async (req, res, next) => {
  try {
    const response = await captchaCreate(req.params.id);
    // console.log(response);
    res.status(200).json({ message: "Captcha", data: response, success: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const uploadBase64File = async (req, res, next) => {
  try {
    // console.log(req.body);
    console.log("========================");
    if (req.body.videoStr) {
      req.body.videoFile = await storeFileAndReturnNameBase64(req.body.videoStr);
      console.log(req.body.videoFile);
      await onBoardingRawDataModel.findByIdAndUpdate(req.params.id, { videoFile: req.body.videoFile }).exec();
    }
    res.status(200).json({ message: "Video Uploaded Successfully", success: true });
  } catch (error) {
    next(error);
  }
};

export const signzyOnboardingRequestCreation = async (req, res, next) => {
  try {
    console.log(req.body, req.params);
    let onBoardingRawData = await onBoardingRawDataModel.findById(req.params.id).lean().exec();
    if (!onBoardingRawData) throw new Error("onBoarding Data Not Found");
    // console.log(onBoar)

    // verify captcha
    const verifyRes = await verifyCaptcha(req.body.captchaText, req.body.captchaId);
    console.log("verified res", verifyRes);
    if (!verifyRes?.result?.isVerified) {
      throw new Error("Captcha Failed, Please try again");
    }

    let obj = {
      email: onBoardingRawData.email,
      username: `${onBoardingRawData?.username}`.toLowerCase(),
      // password: onBoardingRawData?.mobileNumber,
      phone: onBoardingRawData?.mobileNumber,
      name: `${onBoardingRawData?.firstName} ${onBoardingRawData.middleName} ${onBoardingRawData?.lastName}`,
      // prefillData: { //   name: `${onBoardingRawData?.firstName} ${onBoardingRawData.middleName} ${onBoardingRawData?.lastName}`, //   fatherName: onBoardingRawData?.fatherName, //   motherName: onBoardingRawData?.motherName, //   dob: onBoardingRawData?.dob, //   panNumber: onBoardingRawData?.panNumber, //   dlNumber: onBoardingRawData?.dlNumber, //   dlExpiryDate: onBoardingRawData?.dlExpiryDate, //   dlIssueDate: onBoardingRawData?.dlIssueDate, //   passportNumber: onBoardingRawData?.passportNumber, //   passportIssueDate: onBoardingRawData?.passportIssueDate, //   passportExpiryDate: onBoardingRawData?.passportExpiryDate, //   aadhaarUid: onBoardingRawData?.aadhaarUid, //   voterIdNumber: onBoardingRawData?.voterIdNumber, //   otherIdNumber: onBoardingRawData?.otherIdNumber, //   otherIdIssueDate: onBoardingRawData?.otherIdIssueDate, //   otherIdExpiryDate: onBoardingRawData?.otherIdExpiryDate, //   pincode: onBoardingRawData?.pincode, //   state: onBoardingRawData?.state, //   district: onBoardingRawData?.district, //   city: onBoardingRawData?.city, //   address: onBoardingRawData?.address, //   corrPincode: onBoardingRawData?.corrPincode, //   corrState: onBoardingRawData?.corrState, //   corrDistrict: onBoardingRawData?.corrDistrict, //   corrCity: onBoardingRawData?.corrCity, //   corrAddress: onBoardingRawData?.corrAddress, //   bankAccountNumber: onBoardingRawData?.bankAccountNumber, //   bankIFSC: onBoardingRawData?.bankIFSC, //   banckAccountHolderName: onBoardingRawData?.banckAccountHolderName, //   bankAddress: onBoardingRawData?.bankAddress, //   gender: onBoardingRawData?.gender, //   maritalStatus: onBoardingRawData?.maritalStatus, //   fatherSpouseTitle: onBoardingRawData?.fatherSpouseTitle, //   fatherSpouseName: onBoardingRawData?.fatherSpouseName, //   nomineeRelationShip: onBoardingRawData?.nomineeRelationShip, //   maidenTitle: onBoardingRawData?.maidenTitle, //   maidenName: onBoardingRawData?.maidenName, //   motherTitle: onBoardingRawData?.motherTitle, //   emailId: onBoardingRawData?.emailId, //   mobileNumber: onBoardingRawData?.mobileNumber, //   placeOfBirth: onBoardingRawData?.placeOfBirth, // },
    };

    // console.log(obj);

    /// signzy login
    let loginObj = {
      username: SIGNZY_USERNAME,
      password: SIGNZY_PASSWORD,
    };
    let signzyLoginRes = await loginChannel(loginObj);
    console.log("login res", signzyLoginRes);
    // /// hit creation Api
    let onBoardingSignzyDataObj = await onBoardingSignzyData.findOne({ onBoardingDataUserId: onBoardingRawData._id }).lean().exec();

    console.log("onBoardingSignzyDataObj ", onBoardingSignzyDataObj, onBoardingSignzyDataObj?.creationObjResponse?.createdObj?.id);

    if (!onBoardingSignzyDataObj?.creationObjResponse) {
      let creationApiRes = await onBoardingObjectCreation(signzyLoginRes.userId, signzyLoginRes.id, obj);

      onBoardingSignzyDataObj = await onBoardingSignzyData.create({
        onBoardingDataUserId: onBoardingRawData._id,
        creationObjResponse: creationApiRes,
      });
      console.log(JSON.stringify(creationApiRes, null, 2));
    }

    let investorLoginRes = await investorLogin(signzyLoginRes.id, loginObj.username, onBoardingRawData.username?.toLowerCase(), onBoardingSignzyDataObj?.creationObjResponse?.createdObj?.id, req.body.captchaId, req.body.captchaText);

    let investorToken = investorLoginRes?.id;
    if (!investorToken) {
      throw new Error("Investor Token Not Found");
    }

    console.log("INVESTER LOGED IN HERE");
    let signzyImageData = await onBoardingSignzyImageData.findOne({
      onBoardingDataUserId: onBoardingRawData._id,
    });

    console.log(JSON.stringify(investorLoginRes, null, 2));
    console.log("EXECUTING POI HERE", onBoardingSignzyDataObj);
    // execute poi
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executePoiResponse) {
      console.log("SELECTING FILE");
      let file = onBoardingRawData?.panFile;
      // upload poi
      let imagesArr = [];
      let imgResObj = await uploadImageToSignzy(investorToken, file);
      let imageUrl = imgResObj?.file?.directURL;
      console.log(imageUrl, "FIRST IMAGE UPLOADED");
      if (imageUrl) {
        imagesArr.push(imageUrl);
      }

      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "identity",
          type: "individualPan",
          task: "autoRecognition",
          data: {
            images: imagesArr,
            toVerifyData: {},
            searchParam: {},
            proofType: "identity",
          },
        },
      };
      console.log("EXECUTING POI REQ", obj);
      let executePoiRes = await executeSignzy(investorLoginRes.id, obj);
      console.log(executePoiRes, "POI RES");
      if (executePoiRes) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executePoiResponse: executePoiRes }).exec();
      }
      console.log(imgResObj);
    }
    //update poi
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updatePoiResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "identityProof",
        data: {
          type: "individualPan",
          name: `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`,
          fatherName: onBoardingRawData.fatherName,
          number: onBoardingRawData?.panNumber,
          dob: moment(onBoardingRawData?.dob).format("DD/MM/YYYY"),
        },
      };
      console.log("EXECUTING POI REQ", obj);
      let updatePoiResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      console.log(updatePoiResponse, "POI RES");
      if (updatePoiResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updatePoiResponse: updatePoiResponse }).exec();
      }
    }

    //execute poa
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executePoaResponse) {
      console.log("SELECTING FILE");
      let file = onBoardingRawData?.addressProofFile;
      let file2 = onBoardingRawData?.addressProofFile2;
      console.log(file, file2, "FILES");
      // upload poi
      let imagesArr = [];
      let imgResObj = await uploadImageToSignzy(investorToken, file);
      let imageUrl = imgResObj?.file?.directURL;
      console.log(imageUrl, "FIRST IMAGE UPLOADED");
      if (imageUrl) {
        imagesArr.push(imageUrl);
      }
      if (file2) {
        let imgResObj2 = await uploadImageToSignzy(investorToken, file2);
        let imageUrl2 = imgResObj2?.file?.directURL;
        imagesArr.push(imageUrl2);
        console.log(imageUrl2, "SECOND IMAGE UPLOADED");
      }

      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "identity",
          type: onBoardingRawData?.selectionOfAddressProof,
          task: "autoRecognition",
          data: {
            images: imagesArr,
            toVerifyData: {},
            searchParam: {},
            proofType: "address",
          },
        },
      };
      console.log("EXECUTING POA REQ", obj);
      let executePoaResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executePoaResponse, "POA RES");
      if (executePoaResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executePoaResponse: executePoaResponse }).exec();
      }
      console.log(imgResObj);
    }

    //update poa
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updatePoaResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "addressProof",
        data: {},
      };
      if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.AADHAAR) {
        obj.data.type = "aadhaar";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.uid = onBoardingRawData?.aadhaarNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
      } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.PASSPORT) {
        obj.data.type = "passport";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.passportNumber = onBoardingRawData?.passportNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.birthDate = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        obj.data.issueDate = moment(onBoardingRawData?.passportIssueDate).format("DD/MM/YYYY");
        obj.data.expiryDate = moment(onBoardingRawData?.passportExpiryDate).format("DD/MM/YYYY");
      } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.DRIVING_LICENCE) {
        obj.data.type = "drivingLicence";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.number = onBoardingRawData?.dlNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        obj.data.issueDate = moment(onBoardingRawData?.dlIssueDate).format("DD/MM/YYYY");
        obj.data.expiryDate = moment(onBoardingRawData?.dlExpiryDate).format("DD/MM/YYYY");
      } else {
        obj.data.type = "drivingLicence";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.epicNumber = onBoardingRawData?.voterIdNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
      }
      console.log("EXECUTING POI REQ", obj);
      let updatePoaResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      console.log(updatePoaResponse, "POI RES");
      if (updatePoaResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updatePoaResponse: updatePoaResponse }).exec();
      }
    }

    ///execute correspondance poa

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeCorrespondenceResponse) {
      let file = onBoardingRawData?.addressProofFile;
      let file2 = onBoardingRawData?.addressProofFile2;
      let imagesArr = [];
      let imgResObj = await uploadImageToSignzy(investorToken, file);
      let imageUrl = imgResObj?.file?.directURL;
      if (imageUrl) {
        imagesArr.push(imageUrl);
      }
      if (file2) {
        let imgResObj2 = await uploadImageToSignzy(investorToken, file2);
        let imageUrl2 = imgResObj2?.file?.directURL;
        imagesArr.push(imageUrl2);
      }

      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "identity",
          type: onBoardingRawData?.selectionOfAddressProof,
          task: "autoRecognition",
          data: {
            images: imagesArr,
            toVerifyData: {},
            searchParam: {},
            proofType: "corrAddress",
          },
        },
      };
      let executeCorrespondenceResponse = await executeSignzy(investorLoginRes.id, obj);
      if (executeCorrespondenceResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeCorrespondenceResponse: executeCorrespondenceResponse }).exec();
      }
    }

    //update poa
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateCorrespondenceResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "corrAddressProof",
        data: {},
      };
      if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.AADHAAR) {
        obj.data.type = "aadhaar";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.uid = onBoardingRawData?.aadhaarNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
      } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.PASSPORT) {
        obj.data.type = "passport";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.passportNumber = onBoardingRawData?.passportNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.birthDate = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        obj.data.issueDate = moment(onBoardingRawData?.passportIssueDate).format("DD/MM/YYYY");
        obj.data.expiryDate = moment(onBoardingRawData?.passportExpiryDate).format("DD/MM/YYYY");
      } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.DRIVING_LICENCE) {
        obj.data.type = "drivingLicence";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.number = onBoardingRawData?.dlNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        obj.data.issueDate = moment(onBoardingRawData?.dlIssueDate).format("DD/MM/YYYY");
        obj.data.expiryDate = moment(onBoardingRawData?.dlExpiryDate).format("DD/MM/YYYY");
      } else {
        obj.data.type = "drivingLicence";
        obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
        obj.data.epicNumber = onBoardingRawData?.voterIdNumber;
        obj.data.address = onBoardingRawData?.address;
        obj.data.city = onBoardingRawData?.city;
        obj.data.pincode = onBoardingRawData?.pincode;
        obj.data.state = onBoardingRawData?.state;
        obj.data.district = onBoardingRawData?.district;
        obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
      }
      console.log("EXECUTING POI REQ", obj);
      let updateCorrespondenceResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      console.log(updateCorrespondenceResponse, "POI RES");
      if (updateCorrespondenceResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateCorrespondenceResponse: updateCorrespondenceResponse }).exec();
      }
    }

    //update poa userForensics
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateFormForUserForensicsResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "userForensics",
        data: {
          type: "usersData",
          userData: {
            identity: {},
            address: {},
            bankaccount: {},
          },
        },
      };

      console.log("EXECUTING POI REQ", obj);
      let updateFormForUserForensicsResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      console.log(updateFormForUserForensicsResponse, "POI RES");
      if (updateFormForUserForensicsResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateFormForUserForensicsResponse: updateFormForUserForensicsResponse }).exec();
      }
    }

    /// cancelled cheque

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeCannceledChequeResponse) {
      console.log("SELECTING FILE");
      let file = onBoardingRawData?.cancelledCheckFile1;
      let file2 = onBoardingRawData?.cancelledCheckFile2;
      console.log(file, file2, "FILES");
      // upload poi
      let imagesArr = [];
      let imgResObj = await uploadImageToSignzy(investorToken, file);
      let imageUrl = imgResObj?.file?.directURL;
      console.log(imageUrl, "FIRST IMAGE UPLOADED");
      if (imageUrl) {
        imagesArr.push(imageUrl);
      }
      if (file2) {
        let imgResObj2 = await uploadImageToSignzy(investorToken, file2);
        let imageUrl2 = imgResObj2?.file?.directURL;
        imagesArr.push(imageUrl2);
        console.log(imageUrl2, "SECOND IMAGE UPLOADED");
      }

      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "identity",
          type: "cheque",
          task: "autoRecognition",
          data: {
            images: imagesArr,
            toVerifyData: {},
            searchParam: {},
            proofType: "cheque",
          },
        },
      };
      console.log("EXECUTING CHECQUE REQ", obj);
      let executeCannceledChequeResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeCannceledChequeResponse, "CHECQUE RES");
      if (executeCannceledChequeResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeCannceledChequeResponse: executeCannceledChequeResponse }).exec();
      }
      console.log(imgResObj);
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateCancelledChequeResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "bankAccount",
        data: {
          accountNumber: onBoardingRawData?.bankAccountNumber,
          name: onBoardingRawData?.bankAccountHolderName,
          ifsc: onBoardingRawData?.bankIFSC,
        },
      };

      let updateCancelledChequeResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      if (updateCancelledChequeResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateCancelledChequeResponse: updateCancelledChequeResponse }).exec();
      }
    }

    /// bankaccount penny transfer

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeBankAccountPennyTransferResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "nonRoc",
          type: "bankaccountverifications",
          task: "bankTransfer",
          data: {
            images: [],
            toVerifyData: {},
            searchParam: {
              beneficiaryAccount: onBoardingRawData?.bankAccountNumber,
              beneficiaryIFSC: onBoardingRawData?.bankIFSC,
              beneficiaryName: onBoardingRawData?.bankAccountHolderName,
              beneficiaryMobile: onBoardingRawData?.bankMobileNumber,
            },
          },
        },
      };
      console.log("EXECUTING CHECQUE REQ", obj);
      let executeBankAccountPennyTransferResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeBankAccountPennyTransferResponse, "CHECQUE RES");
      if (executeBankAccountPennyTransferResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeBankAccountPennyTransferResponse: executeBankAccountPennyTransferResponse }).exec();
      }
    }

    ///execute bank verification
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeVerifyBankAccountResponse) {
      let onBoardingSignZyDataObjGet = await onBoardingSignzyData.findById(onBoardingSignzyDataObj?._id).lean().exec();
      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "nonRoc",
          type: "bankaccountverifications",
          task: "verifyAmount",
          data: {
            images: [],
            toVerifyData: {},
            searchParam: {
              amount: 1,
              signzyId: onBoardingSignZyDataObjGet?.executeBankAccountPennyTransferResponse?.object?.result?.signzyReferenceId,
            },
          },
        },
      };
      console.log("EXECUTING CHECQUE REQ", obj);
      let executeVerifyBankAccountResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeVerifyBankAccountResponse, "CHECQUE RES");
      if (executeVerifyBankAccountResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeVerifyBankAccountResponse: executeVerifyBankAccountResponse }).exec();
      }
    }

    ///update FORMS
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateFORMSResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "kycdata",
        data: {
          type: "kycdata",
          kycData: {
            gender: onBoardingRawData?.gender,
            maritalStatus: onBoardingRawData?.maritalStatus,
            nomineeRelationShip: onBoardingRawData?.nominee1Relation,
            fatherTitle: "Mr.",
            maidenTitle: onBoardingRawData?.maidenTitle,
            maidenName: onBoardingRawData?.maidenName,
            panNumber: onBoardingRawData?.panNumber,
            aadhaarNumber: onBoardingRawData?.aadhaarNumber,
            motherTitle: "Mrs.",
            residentialStatus: onBoardingRawData?.residentailStatus,
            occupationDescription: onBoardingRawData?.occupationDescription,
            occupationCode: onBoardingRawData?.occupationCode,
            kycAccountCode: onBoardingRawData?.kycAccountCode,
            kycAccountDescription: onBoardingRawData?.kycAccountDescription,
            communicationAddressCode: onBoardingRawData?.communicationAddressCode,
            communicationAddressType: onBoardingRawData?.communicationAddressType,
            permanentAddressCode: onBoardingRawData?.permanentAddressCode,
            permanentAddressType: onBoardingRawData?.permanentAddressType,
            citizenshipCountryCode: onBoardingRawData?.citizenshipCountryCode,
            citizenshipCountry: onBoardingRawData?.citizenshipCountry,
            applicationStatusCode: onBoardingRawData?.applicationStatusCode,
            applicationStatusDescription: onBoardingRawData?.applicationStatusDescription,
            mobileNumber: onBoardingRawData?.mobileNumber,
            countryCode: 91,
            emailId: onBoardingRawData?.emailId,
            fatherName: onBoardingRawData?.fatherName,
            motherName: onBoardingRawData?.motherName,
            placeOfBirth: onBoardingRawData?.placeOfBirth,
            annualIncome: onBoardingRawData?.signzyIncomeCode,
          },
        },
      };

      let updateFORMSResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      if (updateFORMSResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateFORMSResponse: updateFORMSResponse }).exec();
      }
    }

    //update FATCA
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateFATCAResponse) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "fatca",
        data: {
          type: "fatca",
          fatcaData: {
            pep: onBoardingRawData?.politicallyExposed,
            rpep: "NO",
            residentForTaxInIndia: "NO",
          },
        },
      };

      let updateFATCAResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      if (updateFATCAResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateFATCAResponse: updateFATCAResponse }).exec();
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateUserSignatureResponse) {
      let file = onBoardingRawData?.userSignature;
      let imgResObj = await uploadImageToSignzy(investorToken, file);
      let imageUrl = imgResObj?.file?.directURL;
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "signature",
        data: {
          type: "signature",
          signatureImageUrl: imageUrl,
          consent: "true",
        },
      };

      let updateUserSignatureResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      if (updateUserSignatureResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateUserSignatureResponse: updateUserSignatureResponse }).exec();
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateUserPhotoResponse) {
      let file = onBoardingRawData?.userPhoto;
      let imgResObj = await uploadImageToSignzy(investorToken, file);
      let imageUrl = imgResObj?.file?.directURL;
      let obj = {
        merchantId: investorLoginRes?.userId,
        save: "formData",
        type: "userPhoto",
        data: {
          photoUrl: imageUrl,
        },
      };

      let updateUserPhotoResponse = await onBoardingUpdateForm(signzyLoginRes.id, obj);
      if (updateUserPhotoResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateUserPhotoResponse: updateUserPhotoResponse }).exec();
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeStartVideoResponse) {
      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "video",
          type: "video",
          task: "start",
          data: {},
        },
      };
      console.log("EXECUTING Start Video REQ", obj);
      let executeStartVideoResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeStartVideoResponse, "CHECQUE RES");
      if (executeStartVideoResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeStartVideoResponse: executeStartVideoResponse }).exec();
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && onBoardingSignzyDataObj?.executeStartVideoResponse && !onBoardingSignzyDataObj?.executeRecordedVideoResponse) {
      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "video",
          type: "video",
          task: "start",
          data: {},
        },
      };
      console.log("EXECUTING Start Video REQ", obj);
      let executeStartVideoResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeStartVideoResponse, "CHECQUE RES");
      if (executeStartVideoResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeStartVideoResponse: executeStartVideoResponse }).exec();
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && onBoardingSignzyDataObj?.executeStartVideoResponse && !onBoardingSignzyDataObj?.executeRecordedVideoResponse) {
      let onBoardingSignZyDataObjGet = await onBoardingSignzyData.findById(onBoardingSignzyDataObj?._id).lean().exec();

      let file = onBoardingRawData?.videoFile;
      let videoFileObj = await uploadImageToSignzy(investorToken, file);
      let videoUrl = videoFileObj?.file?.directURL;
      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "video",
          type: "video",
          task: "verify",
          data: {
            video: videoUrl,
            transactionId: onBoardingSignZyDataObjGet?.executeStartVideoResponse?.object[0]?.transactionId,
            matchImage: onBoardingSignZyDataObjGet?.executePoiResponse?.object?.reqObj?.executeObj?.data?.images[0],
            type: "video",
          },
        },
      };
      console.log("EXECUTING Start Video REQ", obj);
      let executeRecordedVideoResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeRecordedVideoResponse, "CHECQUE RES");
      if (executeRecordedVideoResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeRecordedVideoResponse: executeRecordedVideoResponse }).exec();
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && onBoardingSignzyDataObj?.executeStartVideoResponse && onBoardingSignzyDataObj?.executeRecordedVideoResponse && !onBoardingSignzyDataObj?.executeContractPdf) {
      let onBoardingSignZyDataObjGet = await onBoardingSignzyData.findById(onBoardingSignzyDataObj?._id).lean().exec();

      let file = onBoardingRawData?.videoFile;
      let videoFileObj = await uploadImageToSignzy(investorToken, file);
      let videoUrl = videoFileObj?.file?.directURL;
      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "video",
          type: "video",
          task: "verify",
          data: {
            video: videoUrl,
            transactionId: onBoardingSignZyDataObjGet?.executeStartVideoResponse?.object[0]?.transactionId,
            matchImage: onBoardingSignZyDataObjGet?.executePoiResponse?.object?.reqObj?.executeObj?.data?.images[0],
            type: "video",
          },
        },
      };
      let executeRecordedVideoResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(executeRecordedVideoResponse, "CHECQUE RES");
      if (executeRecordedVideoResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeRecordedVideoResponse: executeRecordedVideoResponse }).exec();
      }
    }

    if (
      onBoardingSignzyDataObj?.creationObjResponse &&
      onBoardingSignzyDataObj?.executeStartVideoResponse &&
      onBoardingSignzyDataObj?.executeRecordedVideoResponse &&
      onBoardingSignzyDataObj?.executeContractPdf &&
      onBoardingSignzyDataObj?.executeAadhaarEsignPdf
    ) {
      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "verificationEngine",
          merchantId: investorLoginRes?.userId,
        },
      };
      console.log("EXECUTING Start Video REQ", obj);
      let verificationEngineResponse = await executeSignzy(investorLoginRes.id, obj);
      console.log(verificationEngineResponse, "CHECQUE RES");
      if (verificationEngineResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { verificationEngineResponse: verificationEngineResponse }).exec();
      }
    }

    res.status(200).json({ message: "Signzy Api Submitted", success: true });
  } catch (error) {
    if (error?.response?.data?.message) {
      console.log(error?.response?.data?.message);
    }
    console.error(JSON.stringify(error, null, 2));
    next(error);
  }
};

export const signzyGetVideoCode = async (req, res, next) => {
  try {
    console.log(req.body, req.params);
    let onBoardingRawData = await onBoardingRawDataModel.findById(req.params.id).lean().exec();
    if (!onBoardingRawData) {
      throw new Error("onBoarding Data Not Found");
    }

    /// signzy login
    let loginObj = {
      username: SIGNZY_USERNAME,
      password: SIGNZY_PASSWORD,
    };
    let signzyLoginRes = await loginChannel(loginObj);
    console.log("login res", signzyLoginRes);
    // /// hit creation Api
    let onBoardingSignzyDataObj = await onBoardingSignzyData.findOne({ onBoardingDataUserId: onBoardingRawData._id }).lean().exec();
    console.log("onBoardingSignzyDataObj ", onBoardingSignzyDataObj, onBoardingSignzyDataObj?.creationObjResponse?.createdObj?.id);

    if (!onBoardingSignzyDataObj?.creationObjResponse) {
      let obj = {
        email: onBoardingRawData.email,
        username: `${onBoardingRawData?.username}`.toLowerCase(),
        phone: onBoardingRawData?.mobileNumber,
        name: `${onBoardingRawData?.firstName}${onBoardingRawData.middleName ? " " + onBoardingRawData.middleName : ""} ${onBoardingRawData?.lastName}`,
      };

      let creationApiRes = await onBoardingObjectCreation(signzyLoginRes.userId, signzyLoginRes.id, obj);

      onBoardingSignzyDataObj = await onBoardingSignzyData.create({
        onBoardingDataUserId: onBoardingRawData._id,
        creationObjResponse: creationApiRes,
      });
      console.log(JSON.stringify(creationApiRes, null, 2));
    }

    let investorLoginRes = await investorLogin(signzyLoginRes.id, loginObj.username, onBoardingRawData.username?.toLowerCase(), onBoardingSignzyDataObj?.creationObjResponse?.createdObj?.id, req.body.captchaId, req.body.captchaText);

    let investorToken = investorLoginRes?.id;
    if (!investorToken) {
      throw new Error("Investor Token Not Found");
    }

    let randomNumber;
    if (onBoardingSignzyDataObj?.creationObjResponse && onBoardingSignzyDataObj?.executeStartVideoResponse?.object?.length && onBoardingSignzyDataObj?.executeStartVideoResponse?.object[0]?.randNumber) {
      randomNumber = onBoardingSignzyDataObj?.executeStartVideoResponse?.object[0]?.randNumber;
    } else {
      // if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeStartVideoResponse) {
      // if(onBoardingRawData?.selectionOfAddressProof ==)

      // process images

      let obj = {
        merchantId: investorLoginRes?.userId,
        inputData: {
          service: "video",
          type: "video",
          task: "start",
          data: {},
        },
      };
      console.log("EXECUTING Start Video REQ", obj);
      let executeStartVideoResponse = await executeSignzy(investorToken, obj);
      console.log(executeStartVideoResponse, "start video RES");
      if (executeStartVideoResponse?.object?.length) {
        randomNumber = executeStartVideoResponse.object[0]?.randNumber;
      }
      if (executeStartVideoResponse) {
        await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeStartVideoResponse: executeStartVideoResponse }).exec();
      }
    }

    res.status(200).json({ message: "Signzy Video", success: true, data: randomNumber });
  } catch (error) {
    console.error(error);
    if (error?.response?.data) {
      console.log(error?.response?.data);
    }
    next(error);
  }
};

export const signzyGenerateAdhaarEsign = async (req, res, next) => {
  try {
    console.log(req.body, req.params);
    let onBoardingRawData = await onBoardingRawDataModel.findById(req.params.id).lean().exec();
    if (!onBoardingRawData) {
      throw new Error("onBoarding Data Not Found");
    }

    /// signzy login
    let loginObj = {
      username: SIGNZY_USERNAME,
      password: SIGNZY_PASSWORD,
    };
    let signzyLoginRes = await loginChannel(loginObj);
    console.log("login res", signzyLoginRes);
    // /// hit creation Api
    let onBoardingSignzyDataObj = await onBoardingSignzyData.findOne({ onBoardingDataUserId: onBoardingRawData._id }).lean().exec();
    console.log("onBoardingSignzyDataObj ", onBoardingSignzyDataObj, onBoardingSignzyDataObj?.creationObjResponse?.createdObj?.id);

    if (!onBoardingSignzyDataObj?.creationObjResponse) {
      let obj = {
        email: onBoardingRawData.email,
        username: `${onBoardingRawData?.username}`.toLowerCase(),
        phone: onBoardingRawData?.mobileNumber,
        name: `${onBoardingRawData?.firstName} ${onBoardingRawData.middleName} ${onBoardingRawData?.lastName}`,
      };

      let creationApiRes = await onBoardingObjectCreation(signzyLoginRes.userId, signzyLoginRes.id, obj);

      onBoardingSignzyDataObj = await onBoardingSignzyData.create({
        onBoardingDataUserId: onBoardingRawData._id,
        creationObjResponse: creationApiRes,
      });
      console.log(JSON.stringify(creationApiRes, null, 2));
    }

    let investorLoginRes = await investorLogin(signzyLoginRes.id, loginObj.username, onBoardingRawData.username?.toLowerCase(), onBoardingSignzyDataObj?.creationObjResponse?.createdObj?.id, req.body.captchaId, req.body.captchaText);

    let investorToken = investorLoginRes?.id;
    if (!investorToken) {
      throw new Error("Investor Token Not Found");
    }

    // execute poi
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executePoiResponse) {
      try {
        console.log("SELECTING FILE");
        let file = onBoardingRawData?.panFile;
        // upload poi
        let imagesArr = [];
        let imgResObj = await uploadImageToSignzy(investorToken, file);
        let imageUrl = imgResObj?.file?.directURL;
        console.log(imageUrl, "FIRST IMAGE UPLOADED");
        if (imageUrl) {
          imagesArr.push(imageUrl);
        }

        // if(onBoardingRawData?.selectionOfAddressProof ==)

        // process images

        let obj = {
          merchantId: investorLoginRes?.userId,
          inputData: {
            service: "identity",
            type: "individualPan",
            task: "autoRecognition",
            data: {
              images: imagesArr,
              toVerifyData: {},
              searchParam: {},
              proofType: "identity",
            },
          },
        };
        console.log("EXECUTING POI REQ", obj);
        let executePoiRes = await executeSignzy(investorLoginRes.id, obj);
        console.log(executePoiRes, "POI RES");
        if (executePoiRes) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executePoiResponse: executePoiRes }).exec();
        }
        console.log(imgResObj);
      } catch (error) {
        console.error("ERROR EXECUTING POI", error);
      }
    }
    //update poi
    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "identityProof",
          data: {
            type: "individualPan",
            name: `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`,
            fatherName: onBoardingRawData.fatherName,
            number: onBoardingRawData?.panNumber,
            dob: moment(onBoardingRawData?.dob).format("DD/MM/YYYY"),
          },
        };
        console.log("EXECUTING UPDATING POI REQ", obj, investorToken);
        let updatePoiResponse = await onBoardingUpdateForm(investorToken, obj);
        console.log(updatePoiResponse, "POI RES");
        if (updatePoiResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updatePoiResponse: updatePoiResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR UPDATING POI", error);
      }
    }

    //execute poa
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executePoaResponse) {
      try {
        console.log("SELECTING FILE");
        let file = onBoardingRawData?.addressProofFile;
        let file2 = onBoardingRawData?.addressProofFile2;
        console.log(file, file2, "FILES");
        // upload poi
        let imagesArr = [];
        let imgResObj = await uploadImageToSignzy(investorToken, file);
        let imageUrl = imgResObj?.file?.directURL;
        console.log(imageUrl, "FIRST IMAGE UPLOADED");
        if (imageUrl) {
          imagesArr.push(imageUrl);
        }
        if (file2) {
          let imgResObj2 = await uploadImageToSignzy(investorToken, file2);
          let imageUrl2 = imgResObj2?.file?.directURL;
          imagesArr.push(imageUrl2);
          console.log(imageUrl2, "SECOND IMAGE UPLOADED");
        }

        // if(onBoardingRawData?.selectionOfAddressProof ==)

        // process images

        let obj = {
          merchantId: investorLoginRes?.userId,
          inputData: {
            service: "identity",
            type: onBoardingRawData?.selectionOfAddressProof,
            task: "autoRecognition",
            data: {
              images: imagesArr,
              toVerifyData: {},
              searchParam: {},
              proofType: "address",
            },
          },
        };
        console.log("EXECUTING POA REQ", obj);
        let executePoaResponse = await executeSignzy(investorLoginRes.id, obj);
        console.log(executePoaResponse, "POA RES");
        if (executePoaResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executePoaResponse: executePoaResponse }).exec();
        }
        console.log(imgResObj);
      } catch (error) {
        console.error("ERROR EXECUTING POA REQ", error);
      }
    }

    //update poa
    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "addressProof",
          data: {},
        };
        if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.AADHAAR) {
          obj.data.type = "aadhaar";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.uid = onBoardingRawData?.aadhaarNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.PASSPORT) {
          obj.data.type = "passport";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.passportNumber = onBoardingRawData?.passportNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.birthDate = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
          obj.data.issueDate = moment(onBoardingRawData?.passportIssueDate).format("DD/MM/YYYY");
          obj.data.expiryDate = moment(onBoardingRawData?.passportExpiryDate).format("DD/MM/YYYY");
        } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.DRIVING_LICENCE) {
          obj.data.type = "drivingLicence";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.number = onBoardingRawData?.dlNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
          obj.data.issueDate = moment(onBoardingRawData?.dlIssueDate).format("DD/MM/YYYY");
          obj.data.expiryDate = moment(onBoardingRawData?.dlExpiryDate).format("DD/MM/YYYY");
        } else {
          obj.data.type = "drivingLicence";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.epicNumber = onBoardingRawData?.voterIdNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        }
        console.log("EXECUTING POI REQ", obj);
        let updatePoaResponse = await onBoardingUpdateForm(investorToken, obj);
        console.log(updatePoaResponse, "POI RES");
        if (updatePoaResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updatePoaResponse: updatePoaResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR POI", error);
      }
    }

    ///execute correspondance poa

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeCorrespondenceResponse) {
      try {
        let file = onBoardingRawData?.addressProofFile;
        let file2 = onBoardingRawData?.addressProofFile2;
        let imagesArr = [];
        let imgResObj = await uploadImageToSignzy(investorToken, file);
        let imageUrl = imgResObj?.file?.directURL;
        if (imageUrl) {
          imagesArr.push(imageUrl);
        }
        if (file2) {
          let imgResObj2 = await uploadImageToSignzy(investorToken, file2);
          let imageUrl2 = imgResObj2?.file?.directURL;
          imagesArr.push(imageUrl2);
        }

        // if(onBoardingRawData?.selectionOfAddressProof ==)

        // process images

        let obj = {
          merchantId: investorLoginRes?.userId,
          inputData: {
            service: "identity",
            type: onBoardingRawData?.selectionOfAddressProof,
            task: "autoRecognition",
            data: {
              images: imagesArr,
              toVerifyData: {},
              searchParam: {},
              proofType: "corrAddress",
            },
          },
        };
        console.log("EXECUTE CORR");
        let executeCorrespondenceResponse = await executeSignzy(investorLoginRes.id, obj);
        if (executeCorrespondenceResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeCorrespondenceResponse: executeCorrespondenceResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR IN CORR", error);
      }
    }

    //update poa
    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "corrAddressProof",
          data: {},
        };
        if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.AADHAAR) {
          obj.data.type = "aadhaar";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.uid = onBoardingRawData?.aadhaarNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.PASSPORT) {
          obj.data.type = "passport";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.passportNumber = onBoardingRawData?.passportNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.birthDate = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
          obj.data.issueDate = moment(onBoardingRawData?.passportIssueDate).format("DD/MM/YYYY");
          obj.data.expiryDate = moment(onBoardingRawData?.passportExpiryDate).format("DD/MM/YYYY");
        } else if (onBoardingRawData.selectionOfAddressProof == TYPE_OF_ADDRESS.DRIVING_LICENCE) {
          obj.data.type = "drivingLicence";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.number = onBoardingRawData?.dlNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
          obj.data.issueDate = moment(onBoardingRawData?.dlIssueDate).format("DD/MM/YYYY");
          obj.data.expiryDate = moment(onBoardingRawData?.dlExpiryDate).format("DD/MM/YYYY");
        } else {
          obj.data.type = "drivingLicence";
          obj.data.name = `${onBoardingRawData?.firstName} ${onBoardingRawData?.middleName} ${onBoardingRawData?.lastName}`;
          obj.data.epicNumber = onBoardingRawData?.voterIdNumber;
          obj.data.address = onBoardingRawData?.address;
          obj.data.city = onBoardingRawData?.city;
          obj.data.pincode = onBoardingRawData?.pincode;
          obj.data.state = onBoardingRawData?.state;
          obj.data.district = onBoardingRawData?.district;
          obj.data.dob = moment(onBoardingRawData?.dob).format("DD/MM/YYYY");
        }
        console.log("EXECUTING POI REQ", obj);
        let updateCorrespondenceResponse = await onBoardingUpdateForm(investorToken, obj);
        console.log(updateCorrespondenceResponse, "POI RES");
        if (updateCorrespondenceResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateCorrespondenceResponse: updateCorrespondenceResponse }).exec();
        }
      } catch (error) {
        console.error("Error POI UPDATE", error);
      }
    }

    //update poa userForensics
    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "userForensics",
          data: {
            type: "usersData",
            userData: {
              identity: {},
              address: {},
              bankaccount: {},
            },
          },
        };

        console.log("EXECUTING POI REQ", obj);
        let updateFormForUserForensicsResponse = await onBoardingUpdateForm(investorToken, obj);
        console.log(updateFormForUserForensicsResponse, "POI RES");
        if (updateFormForUserForensicsResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateFormForUserForensicsResponse: updateFormForUserForensicsResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR USER FORENSICS", error);
      }
    }

    /// cancelled cheque

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeCannceledChequeResponse) {
      try {
        console.log("SELECTING FILE");
        let file = onBoardingRawData?.cancelledCheckFile1;
        let file2 = onBoardingRawData?.cancelledCheckFile2;
        console.log(file, file2, "FILES");
        // upload poi
        let imagesArr = [];
        let imgResObj = await uploadImageToSignzy(investorToken, file);
        let imageUrl = imgResObj?.file?.directURL;
        console.log(imageUrl, "FIRST IMAGE UPLOADED");
        if (imageUrl) {
          imagesArr.push(imageUrl);
        }
        if (file2) {
          let imgResObj2 = await uploadImageToSignzy(investorToken, file2);
          let imageUrl2 = imgResObj2?.file?.directURL;
          imagesArr.push(imageUrl2);
          console.log(imageUrl2, "SECOND IMAGE UPLOADED");
        }

        // if(onBoardingRawData?.selectionOfAddressProof ==)

        // process images

        let obj = {
          merchantId: investorLoginRes?.userId,
          inputData: {
            service: "identity",
            type: "cheque",
            task: "autoRecognition",
            data: {
              images: imagesArr,
              toVerifyData: {},
              searchParam: {},
              proofType: "cheque",
            },
          },
        };
        console.log("EXECUTING CHECQUE REQ", obj);
        let executeCannceledChequeResponse = await executeSignzy(investorLoginRes.id, obj);
        console.log(executeCannceledChequeResponse, "CHECQUE RES");
        if (executeCannceledChequeResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeCannceledChequeResponse: executeCannceledChequeResponse }).exec();
        }
        console.log(imgResObj);
      } catch (error) {
        console.error("ERROR CHEQUE REQ", error);
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "bankAccount",
          data: {
            accountNumber: onBoardingRawData?.bankAccountNumber,
            name: onBoardingRawData?.bankAccountHolderName,
            ifsc: onBoardingRawData?.bankIFSC,
          },
        };

        let updateCancelledChequeResponse = await onBoardingUpdateForm(investorToken, obj);
        if (updateCancelledChequeResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateCancelledChequeResponse: updateCancelledChequeResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR BANK ACCOUNT", error);
      }
    }

    /// bankaccount penny transfer

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeBankAccountPennyTransferResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          inputData: {
            service: "nonRoc",
            type: "bankaccountverifications",
            task: "bankTransfer",
            data: {
              images: [],
              toVerifyData: {},
              searchParam: {
                beneficiaryAccount: onBoardingRawData?.bankAccountNumber,
                beneficiaryIFSC: onBoardingRawData?.bankIFSC,
                beneficiaryName: onBoardingRawData?.bankAccountHolderName,
                beneficiaryMobile: onBoardingRawData?.bankMobileNumber,
              },
            },
          },
        };
        console.log("EXECUTING bank transfer REQ", obj);
        let executeBankAccountPennyTransferResponse = await executeSignzy(investorLoginRes.id, obj);
        console.log(executeBankAccountPennyTransferResponse, "CHECQUE RES");
        if (executeBankAccountPennyTransferResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeBankAccountPennyTransferResponse: executeBankAccountPennyTransferResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR bank transfer REQ", error);
      }
    }

    ///execute bank verification
    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.executeVerifyBankAccountResponse) {
      try {
        let onBoardingSignZyDataObjGet = await onBoardingSignzyData.findById(onBoardingSignzyDataObj?._id).lean().exec();
        let obj = {
          merchantId: investorLoginRes?.userId,
          inputData: {
            service: "nonRoc",
            type: "bankaccountverifications",
            task: "verifyAmount",
            data: {
              images: [],
              toVerifyData: {},
              searchParam: {
                amount: 1,
                signzyId: onBoardingSignZyDataObjGet?.executeBankAccountPennyTransferResponse?.object?.result?.signzyReferenceId,
              },
            },
          },
        };
        console.log("EXECUTING CHECQUE REQ", obj);
        let executeVerifyBankAccountResponse = await executeSignzy(investorLoginRes.id, obj);
        console.log(executeVerifyBankAccountResponse, "CHECQUE RES");
        if (executeVerifyBankAccountResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeVerifyBankAccountResponse: executeVerifyBankAccountResponse }).exec();
        }
      } catch (error) {
        console.error("error nonRoc", error);
      }
    }

    ///update FORMS
    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "kycdata",
          data: {
            type: "kycdata",
            kycData: {
              gender: onBoardingRawData?.gender,
              maritalStatus: onBoardingRawData?.maritalStatus,
              nomineeRelationShip: onBoardingRawData?.nominee1Relation,
              fatherTitle: "Mr.",
              maidenTitle: onBoardingRawData?.maidenTitle,
              maidenName: onBoardingRawData?.maidenName,
              panNumber: onBoardingRawData?.panNumber,
              aadhaarNumber: onBoardingRawData?.aadhaarNumber,
              motherTitle: "Mrs.",
              residentialStatus: onBoardingRawData?.residentailStatus,
              occupationDescription: onBoardingRawData?.occupationDescription,
              occupationCode: onBoardingRawData?.occupationCode,
              kycAccountCode: onBoardingRawData?.kycAccountCode,
              kycAccountDescription: onBoardingRawData?.kycAccountDescription,
              communicationAddressCode: onBoardingRawData?.communicationAddressCode,
              communicationAddressType: onBoardingRawData?.communicationAddressType,
              permanentAddressCode: onBoardingRawData?.permanentAddressCode,
              permanentAddressType: onBoardingRawData?.permanentAddressType,
              citizenshipCountryCode: onBoardingRawData?.citizenshipCountryCode,
              citizenshipCountry: onBoardingRawData?.citizenshipCountry,
              applicationStatusCode: onBoardingRawData?.applicationStatusCode,
              applicationStatusDescription: onBoardingRawData?.applicationStatusDescription,
              mobileNumber: onBoardingRawData?.mobileNumber,
              countryCode: 91,
              emailId: onBoardingRawData?.emailId,
              fatherName: onBoardingRawData?.fatherName,
              motherName: onBoardingRawData?.motherName,
              placeOfBirth: onBoardingRawData?.placeOfBirth,
              annualIncome: onBoardingRawData?.signzyIncomeCode,
            },
          },
        };

        let updateFORMSResponse = await onBoardingUpdateForm(investorToken, obj);
        if (updateFORMSResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateFORMSResponse: updateFORMSResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR KYC", error);
      }
    }

    //update FATCA
    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "fatca",
          data: {
            type: "fatca",
            fatcaData: {
              pep: onBoardingRawData?.politicallyExposed,
              rpep: "NO",
              residentForTaxInIndia: "NO",
            },
          },
        };

        let updateFATCAResponse = await onBoardingUpdateForm(investorToken, obj);
        if (updateFATCAResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateFATCAResponse: updateFATCAResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR FACTA", error);
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse) {
      try {
        let file = onBoardingRawData?.userSignature;
        let imgResObj = await uploadImageToSignzy(investorToken, file);
        let imageUrl = imgResObj?.file?.directURL;
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "signature",
          data: {
            type: "signature",
            signatureImageUrl: imageUrl,
            consent: "true",
          },
        };

        let updateUserSignatureResponse = await onBoardingUpdateForm(investorToken, obj);
        if (updateUserSignatureResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateUserSignatureResponse: updateUserSignatureResponse }).exec();
        }
      } catch (error) {
        console.error("EROR SIGNATURE", error);
      }
    }

    if (onBoardingSignzyDataObj?.creationObjResponse && !onBoardingSignzyDataObj?.updateUserPhotoResponse) {
      try {
        let file = onBoardingRawData?.userPhoto;
        let imgResObj = await uploadImageToSignzy(investorToken, file);
        let imageUrl = imgResObj?.file?.directURL;
        let obj = {
          merchantId: investorLoginRes?.userId,
          save: "formData",
          type: "userPhoto",
          data: {
            photoUrl: imageUrl,
          },
        };

        let updateUserPhotoResponse = await onBoardingUpdateForm(investorToken, obj);
        if (updateUserPhotoResponse) {
          await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { updateUserPhotoResponse: updateUserPhotoResponse }).exec();
        }
      } catch (error) {
        console.error("ERROR IN PHOTO", error);
      }
    }

    // esign
    let obj = {
      merchantId: investorLoginRes?.userId,
      inputData: {
        service: "esign",
        type: "",
        task: "createPdf",
        data: {},
      },
    };

    let executeContractPdf = await executeSignzy(investorLoginRes.id, obj);
    console.log(executeContractPdf, "POI RES");
    if (executeContractPdf) {
      onBoardingSignzyDataObj = await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeContractPdf: executeContractPdf }, { new: true }).lean().exec();
    }

    let aadhaarObj = {
      merchantId: investorLoginRes?.userId,
      inputData: {
        service: "esign",
        type: "",
        task: "createEsignUrl",
        data: {
          inputFile: executeContractPdf?.object?.result?.combinedPdf,
          signatureType: "aadhaaresign",
        },
      },
    };

    let executeAadhaarEsignPdf = await executeSignzy(investorLoginRes.id, aadhaarObj);
    if (executeContractPdf) {
      onBoardingSignzyDataObj = await onBoardingSignzyData.findByIdAndUpdate(onBoardingSignzyDataObj?._id, { executeAadhaarEsignPdf: executeAadhaarEsignPdf }, { new: true }).lean().exec();
    }

    res.status(200).json({ message: "Signzy Aadhaar Url", success: true, data: executeAadhaarEsignPdf });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const processXMLFromResponse = (xmlData) => {
  let data = convert.xml2js(xmlData);
  console.log(JSON.stringify(data, null, 2));
  if (data) {
    let error = true;
    let errorStr = "";
    let obj = data.elements
      ?.find((el) => el.name == "DataSet")
      ?.elements?.find((el) => el.name == "diffgr:diffgram")
      ?.elements?.find((el) => el.name == "NMFIISERVICES")
      ?.elements?.find((el) => el.name == "service_status")
      ?.elements?.find((el) => el.name == "service_return_code")
      ?.elements?.find((el) => el.type == "text");

    if (obj?.text == 0) {
      error = false;
    }

    if (error) {
      let arr = data.elements
        ?.find((el) => el.name == "DataSet")
        ?.elements?.find((el) => el.name == "diffgr:diffgram")
        ?.elements?.find((el) => el.name == "NMFIISERVICES")
        ?.elements?.filter((el) => el.name == "service_response");

      console.log(JSON.stringify(arr, null, 2));
      errorStr = arr.reduce((acc, el) => {
        let returnObj = el?.elements?.find((elx) => elx.name == "return_msg")?.elements?.find((elx) => elx.type == "text");
        return acc + returnObj?.text + "; ";
      }, "");

      console.log(obj);
    }

    let text = data?.elements
      ?.find((el) => el.name == "DataSet")
      ?.elements?.find((el) => el.name == "diffgr:diffgram")
      ?.elements?.find((el) => el.name == "NMFIIService")
      ?.elements?.find((el) => el.name == "service_response")
      ?.elements?.find((el) => el.name == "return_msg")?.elements?.[0]?.text;

    let arr = text.split(" ").filter((el) => el);
    let iin = arr?.length ? arr[arr.length - 1] : "";

    return {
      error: error,
      errorStr: errorStr,
      iin,
    };
  }
};

export const nseOnboardingCreateCustomerRequest = async (req, res, next) => {
  try {
    console.log("NSE START 1");
    let onBoardingRawData = await onBoardingRawDataModel.findById(req.params.id).lean().exec();
    if (!onBoardingRawData) throw new Error("onBoarding Data Not Found");
    // console.log(onBoar)
    console.log("NSE START 2", onBoardingRawData?.nseTaxStatus);
    let re = await nseOnboardingCreateCustomer(onBoardingRawData);
    console.log("NSE START 3");

    let tempobj = await new onBoardingNSE({
      onBoardingDataUserId: onBoardingRawData._id,
      nseReqRes: re,
    }).save();
    let processedObj = processXMLFromResponse(re.responseBody);

    let iin = processedObj?.iin;
    console.log(processedObj);

    if (processedObj?.error) {
      res.status(400).json({ message: processedObj.errorStr });
      return;
    }

    console.log("NSE START 4", re.responseBody);
    if (re.errorResponse) {
      res.status(400).json({ message: "Error Submitting The Request" });
      return;
    }

    await onBoardingNSE.findByIdAndUpdate(tempobj._id, { iin });

    if (onBoardingRawData?.mandateType == "Electronic") {
      let re = await nseFacta(onBoardingRawData, { iin: iin });
      console.log("NSE START 3");

      await onBoardingNSE
        .findByIdAndUpdate(tempobj._id, {
          onBoardingDataUserId: onBoardingRawData._id,
          factaReqRes: re,
        })
        .save();
      let errorObj = processXMLFromResponse(re.responseBody);
      console.log(errorObj);

      if (errorObj?.error) {
        res.status(400).json({ message: errorObj.errorStr });
        return;
      }

      console.log("NSE START 4", re.responseBody);
      if (re.errorResponse) {
        res.status(400).json({ message: "Error Submitting The Request" });
        return;
      }
    }

    res.status(200).json({ message: "NSE Submitted" });
  } catch (error) {
    next(error);
  }
};

export const bseOnboardingCreateCustomerRequest = async (req, res, next) => {
  try {
    let onBoardingRawData = await onBoardingRawDataModel.findById(req.params.id).lean().exec();
    if (!onBoardingRawData) throw new Error("onBoarding Data Not Found");

    let re = await bseOnboardingCreateCustomer(onBoardingRawData);

    new onBoardingBSE({
      onBoardingDataUserId: onBoardingRawData._id,
      bseReqRes: re,
      bseId: re.bseId,
    }).save();

    if (re.responseBody?.Status != "0") {
      res.status(400).json({ message: re.responseBody.Remarks });
      return;
    }

    if (re.errorResponse) {
      res.status(400).json({ message: "Error Submitting The Request" });
      return;
    }
    res.status(200).json({ message: "BSE Submitted" });
  } catch (error) {
    next(error);
  }
};

export const AesEncryptAnyData = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = encryptAes(JSON.stringify(req.body));
    res.status(200).json({ message: "DATA", data: data, success: true });
  } catch (error) {
    next(error);
  }
};

export const AesDecryptAnyData = async (req, res, next) => {
  try {
    console.log(req.body);
    let data = decryptAes(Buffer.from(req.body.word, "base64"), "utf8");
    res.status(200).json({ message: "DATA", data: data, success: true });
  } catch (error) {
    next(error);
  }
};

export const verifyKycFromApi = async (req, res, next) => {
  try {
    let result;
    let encryptedStr = await encryptAes(JSON.stringify(req.body));
    //replace + with -

    encryptedStr = encryptedStr.replace("+", "-");

    // replace / with _

    encryptedStr = encryptedStr.replace("/", "_");

    let { data: responseFromApi } = await verifyKyc(encryptedStr);
    console.log(responseFromApi);

    let decryptedData = await decryptAes(Buffer.from(responseFromApi, "base64"), "utf8");

    let parsedData = JSON.parse(decryptedData);
    res.status(200).json({ message: "KYC", data: parsedData, success: true });
  } catch (error) {
    next(error);
  }
};
