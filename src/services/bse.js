import axios from "axios";
import request from "request";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import moment from "moment";
import { generateRandomId } from "../utils/onBoarding.util";
const BSE_BASE_URL = "https://bsestarmfdemo.bseindia.com";
const BSE_USER_ID = "1346401";
const BSE_MEMBER_CODE = "13464";
const BSE_PASSWORD = "Milestone@123";
export const bseOnboardingCreateCustomer = async (dataObj) => {
  let id = generateRandomId();

  let data = {
    UserId: "1346401",
    MemberCode: "13464",
    Password: "Milestone@123",
    RegnType: "NEW",
    Param: `${id}|${dataObj.firstName}||${dataObj.lastName}|${dataObj?.bseTaxStatus}|${dataObj.gender ? dataObj.gender.split("")[0]?.toUpperCase() : ""}|${moment(dataObj.DOB).format("DD/MM/YYYY")}|01|${
      dataObj?.bseHoldingNature
    }|||||||||||||N||||AFEPK2130F||||||||P||||||||SB|${dataObj.bankAccountNumber}||${dataObj.bankIFSC}|Y|||||||||||||||||||||${dataObj.firstName} ${dataObj.lastName}|01|${dataObj?.address}|||${dataObj.city}|${
      dataObj.bseStateCode ? dataObj.bseStateCode : "ND"
    }|${dataObj.pincode}|INDIA|${dataObj.mobileNumber}||||${dataObj.email}|P|||||||||||||||||||||||||||||||K||||||||||||N||P|||||`,
    Filler1: "",
    Filler2: "",
  };

  let config = {
    method: "post",
    url: `${BSE_BASE_URL}/StarMFCommonAPI/ClientMaster/Registration`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };

  try {
    let res = await axios(config);
    console.log(res.data);
    console.log(res.status);
    console.log(res.statusText);
    return {
      responseBody: res.data,
      axiosConfig: config,
      bseId: id,
    };
  } catch (error) {
    return {
      error: error,
      errorResponse: error?.response?.data,
      axiosConfig: config,
      bseId: id,
    };
  }
};
export const bseFactaUpload = async (dataObj, bseObj) => {
  let data = {
    UserId: BSE_USER_ID,
    MemberCode: BSE_MEMBER_CODE,
    Password: BSE_PASSWORD,
    Flag: "01",
    Param: `${dataObj.panNumber}||${dataObj?.firstName ? dataObj?.firstName + " " : ""}${dataObj?.middleName ? dataObj?.middleName + " " : ""}${
      dataObj?.lastName ? dataObj?.lastName : ""
    }|dob|||tax_status|data_src|addr_type|||TAX_RES1|TPIN1|ID1_TYPE||||||||||SRCE_WEALT|CORP_SERVS|INC_SLAB|||PEP_FLAG|OCC_CODE|OCC_TYPE|||||||||||||||||||||||||||||||||||||||||||||||`,
  };

  let config = {
    method: "post",
    url: `${BSE_BASE_URL}/StarMFCommonAPI/ClientMaster/MFAPI`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };

  try {
    let res = await axios(config);
    console.log(res.data);
    console.log(res.status);
    console.log(res.statusText);
    return {
      responseBody: res.data,
      axiosConfig: config,
    };
  } catch (error) {
    return {
      error: error,
      errorResponse: error?.response?.data,
      axiosConfig: config,
    };
  }
};
