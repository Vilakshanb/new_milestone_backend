import axios from "axios";
import request from "request";
import path from "path";
import fs, { stat } from "fs";
import FormData from "form-data";
import moment from "moment";
import { BSE_COUNTRY_CODE, BSE_HOLDING_NATURE, BSE_STATE_CODES, BSE_TAX_STATUS } from "../helpers/bseConstants";
import nseBseStateModel from "../models/nseBseState.model";
import cityModel from "../models/city.model";
import countryModel from "../models/country.model";
import nseBseHoldingModel from "../models/nseBseHolding.model";
import nseBseTaxStatusModel from "../models/nseBseTaxStatus.model";
import { ADDRESS_TYPES_CODE, POLITICALLY_EXPOSED, TYPE_OF_ADDRESS } from "../helpers/constant";
const convert = require("xml-js");

const NSE_BASE_URL = "https://uat.nsenmf.com";
const NSE_APP_ID = "MFS37138";
const NSE_PASSWORD = "JKBDVIFB";
const NSE_BROKER_CODE = "ARN-37138";

export const nseOnboardingCreateCustomer = async (dataObj) => {
  console.log("DOB", `${moment(dataObj.DOB).format("DD-MMM-yyyy")}`);

  let nomineeCount = 0;

  if (dataObj.nominee1Type && dataObj.nominee1Name && dataObj.nominee1DOB && dataObj.nominee1Relationship && dataObj.nominee1Percentage) {
    nomineeCount++;

    if (dataObj.nominee2Type && dataObj.nominee2Name && dataObj.nominee2DOB && dataObj.nominee2Relationship && dataObj.nominee2Percentage) {
      nomineeCount++;

      if (dataObj.nominee3Type && dataObj.nominee3Name && dataObj.nominee3DOB && dataObj.nominee3Relationship && dataObj.nominee3Percentage) {
        nomineeCount++;
      }
    }
  }

  let xmlFormData =
    `<?xml version="1.0" encoding="utf-8"?>
<NMFIIService xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <service_request>
        <appln_id>${NSE_APP_ID}</appln_id>
        <password>${NSE_PASSWORD}</password>
        <broker_code>${NSE_BROKER_CODE}</broker_code>
        <process_mode>P</process_mode>
        <title>Mr.</title>
        <inv_name>${dataObj?.firstName ? dataObj?.firstName + " " : ""}${dataObj?.middleName ? dataObj?.middleName + " " : ""}${dataObj?.lastName ? dataObj?.lastName : ""}</inv_name>
        <pan>${dataObj.panNumber}</pan>
        <valid_pan>Y</valid_pan>
        <exemption>N</exemption>
        <exempt_category></exempt_category>
        <exempt_ref_no></exempt_ref_no>
        <dob>${moment(dataObj.DOB).format("DD-MMM-yyyy")}</dob>
        <hold_nature>${dataObj?.nseHoldingNature ? dataObj?.nseHoldingNature : "SI"}</hold_nature>
        <tax_status>${dataObj?.nseTaxStatus ? dataObj?.nseTaxStatus : "06"}</tax_status>
        <kyc>Y</kyc>
        <fh_ckyc>N</fh_ckyc>
        <fh_ckyc_refno></fh_ckyc_refno>
        <occupation>2B</occupation>
        <mfu_can></mfu_can>
        <dp_id></dp_id>
        <father_name></father_name>
        <mother_name></mother_name>
        <trxn_acceptance></trxn_acceptance>
        <addr1>${dataObj.address}</addr1>
        <addr2>${dataObj.district ? dataObj.district : ""}</addr2>
        <addr3></addr3>
        <city>${dataObj.city}</city>
        <state>${dataObj.nseCityCode ? dataObj.nseCityCode : "ND"}</state>
        <pincode>${dataObj.pincode}</pincode>
        <country>${dataObj.nseCountryCode ? dataObj.nseCountryCode : "IND"}</country>
        <mobile_no>${dataObj.mobileNumber}</mobile_no>
        <res_phone></res_phone>
        <off_phone></off_phone>
        <res_fax></res_fax>
        <off_fax></off_fax>
        <email>${dataObj.email}</email>
        <nri_addr1></nri_addr1>
        <nri_addr2></nri_addr2>
        <nri_addr3></nri_addr3>
        <nri_city></nri_city>
        <nri_state></nri_state>
        <nri_pincode></nri_pincode>
        <nri_country></nri_country>
        <bank_name>${dataObj.bankName}</bank_name>
        <acc_no>${dataObj.bankAccountNumber}</acc_no>
        <acc_type>SB</acc_type>
        <ifsc_code>${dataObj.bankIFSC}</ifsc_code>
        <branch_name>${dataObj.bankBranchName}</branch_name>
        <branch_addr1>${dataObj.bankAddress}</branch_addr1>
        <branch_addr2></branch_addr2>
        <branch_addr3></branch_addr3>
        <branch_city>${dataObj.bankCity ? dataObj.bankCity : dataObj.city}</branch_city>
        <branch_pincode>${dataObj.bankBranchPincode}</branch_pincode>
        <branch_country>IND</branch_country>
        <jh1_name></jh1_name>
        <jh1_pan></jh1_pan>
        <jh1_valid_pan></jh1_valid_pan>
        <jh1_exemption></jh1_exemption>
        <jh1_exempt_category></jh1_exempt_category>
        <jh1_exempt_ref_no></jh1_exempt_ref_no>
        <jh1_dob></jh1_dob>
        <jh1_kyc></jh1_kyc>
        <jh1_ckyc></jh1_ckyc>
        <jh1_ckyc_refno></jh1_ckyc_refno>
        <jh1_email></jh1_email>
        <jh1_mobile_no></jh1_mobile_no>
        <jh2_name></jh2_name>
        <jh2_pan></jh2_pan>
        <jh2_valid_pan></jh2_valid_pan>
        <jh2_exemption></jh2_exemption>
        <jh2_exempt_category></jh2_exempt_category>
        <jh2_exempt_ref_no></jh2_exempt_ref_no>
        <jh2_dob></jh2_dob>
        <jh2_kyc></jh2_kyc>
        <jh2_ckyc></jh2_ckyc>
        <jh2_ckyc_refno></jh2_ckyc_refno>
        <jh2_email></jh2_email>
        <jh2_mobile_no></jh2_mobile_no>
        <no_of_nominee>${nomineeCount}</no_of_nominee>
        <nominee1_type>${dataObj.nominee1Type == "minor" ? "Y" : "N"}</nominee1_type>
        <nominee1_name>${dataObj.nominee1Name}</nominee1_name>
        <nominee1_dob>${moment(dataObj.nominee1DOB).format("DD-MMM-yyyy")}</nominee1_dob>
        <nominee1_addr1>${dataObj.address}</nominee1_addr1>
        <nominee1_addr2>${dataObj.district ? dataObj.district : ""}</nominee1_addr2>
        <nominee1_addr3></nominee1_addr3>
        <nominee1_city>${dataObj.city}</nominee1_city>
        <nominee1_state>${dataObj.nseCityCode ? dataObj.nseCityCode : "ND"}</nominee1_state>
        <nominee1_pincode>${dataObj.pincode}</nominee1_pincode>
        <nominee1_relation>${dataObj.nominee1Relationship}</nominee1_relation>
        <nominee1_percent>${dataObj.nominee1Percentage}</nominee1_percent>
        <nominee1_guard_name></nominee1_guard_name>
        <nominee1_guard_pan></nominee1_guard_pan>
        ` +
    (nomineeCount >= 2
      ? `<nominee2_type>${dataObj.nominee2Type == "minor" ? "Y" : "N"}</nominee2_type>
        <nominee2_name>${dataObj.nominee2Name}</nominee2_name>
        <nominee2_dob>${moment(dataObj.nominee2DOB).format("DD-MMM-yyyy")}</nominee2_dob>
        <nominee2_relation>${dataObj.nominee2Relationship}</nominee2_relation>
        <nominee2_percent>${dataObj.nominee2Percentage}</nominee2_percent>
        <nominee2_guard_name></nominee2_guard_name>
        <nominee2_guard_pan></nominee2_guard_pan>
          `
      : "") +
    (nomineeCount >= 3
      ? `<nominee3_type>${dataObj.nominee3Type == "minor" ? "Y" : "N"}</nominee3_type>
        <nominee3_Name>${dataObj.nominee3Name}</nominee3_Name>
        <nominee3_dob>${moment(dataObj.nominee3DOB).format("DD-MMM-yyyy")}</nominee3_dob>
        <nominee3_relation>${dataObj.nominee3Relationship}</nominee3_relation>
        <nominee3_percent>${dataObj.nominee3Percentage}</nominee3_percent>
        <nominee3_guard_name></nominee3_guard_name>
        <nominee3_guard_pan></nominee3_guard_pan>
          `
      : "") +
    `<micr_no>123456789</micr_no>
        <guard_name></guard_name>
        <guard_pan></guard_pan>
        <guard_valid_pan></guard_valid_pan>
        <guard_exemption></guard_exemption>
        <guard_exempt_category></guard_exempt_category>
        <guard_pan_ref_no></guard_pan_ref_no>
        <guard_dob></guard_dob>
        <guard_kyc></guard_kyc>
        <guard_ckyc></guard_ckyc>
        <guard_ckyc_refno></guard_ckyc_refno>
        <micr_no>123456789</micr_no>
        <FD_Flag>Y</FD_Flag>
        <App_Key>123456789</App_Key>
        <mobile_relation>SE</mobile_relation>
        <email_relation>SE</email_relation>
    </service_request>
</NMFIIService>`;

  console.log(xmlFormData);
  let config = {
    method: "post",
    url: `${NSE_BASE_URL}/NMFIITrxnService/NMFTrxnService/CREATECUSTOMER`,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Cookie: "ASP.NET_SessionId=tuijbw0iiw5ns1f2szcjfumy",
    },
    data: xmlFormData,
  };

  try {
    let res = await axios(config);
    console.log(res.data);
    res.st;
    return {
      responseBody: res.data,
      axiosConfig: config,
      statusCode: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    console.error(error);
    return {
      errorResponse: error?.response?.data,
      errorResponseHeader: error?.response?.headers,
      // errorResponseConfig: error?.response?.,
      statusCode: error?.response?.status,
      statusText: error?.response?.statusText,
      axiosConfig: config,
    };
  }
};

export const nseFacta = async (dataObj, nseSubmitObj) => {
  try {
    let xmlFormData = `
          <NMFIIService>
           <service_request>
             <appln_id>${NSE_APP_ID}</appln_id>
             <password>${NSE_PASSWORD}</password>
             <broker_code>${NSE_BROKER_CODE}</broker_code>
             <pan>${dataObj?.panNumber}</pan>
             <tax_status>01</tax_status>
             <investor_name>${dataObj?.firstName ? dataObj?.firstName + " " : ""}${dataObj?.middleName ? dataObj?.middleName + " " : ""}${dataObj?.lastName ? dataObj?.lastName : ""}</investor_name>
             <chkExempIndValid>N</chkExempIndValid>
             <editor_id>${dataObj.username}</editor_id>
             <ubo_applicable_count>0</ubo_applicable_count>
             <iin>${nseSubmitObj.iin}</iin>
             <KYC>
               <app_income_code>34</app_income_code>
               <net_worth_sign>+</net_worth_sign>
               <net_worth></net_worth>
               <net_worth_date></net_worth_date>
               <pep>${dataObj.politicallyExposed == POLITICALLY_EXPOSED.PEP ? "Y" : dataObj.politicallyExposed == POLITICALLY_EXPOSED.RPEP ? "R" : "N"}</pep>
               <occ_code>1</occ_code>
               <source_wealth></source_wealth>
               <corp_servs></corp_servs>
             </KYC>
             <Fatca>
               <dob>${moment(dataObj.DOB).format("DD-MMM-yyyy")}</dob> 
               <addr_type>${getNseAddressType(dataObj.addressType)}</addr_type>
               <data_src>E</data_src>
               <log_name>${dataObj?.email}</log_name>
               <country_of_birth>${dataObj?.citizenshipCountryNseCode ? dataObj?.citizenshipCountryNseCode : "IND"}</country_of_birth>
               <place_birth>${dataObj?.cityBirth ? dataObj?.cityBirth : ""}${dataObj?.stateOfBirth ? dataObj?.stateOfBirth : ""}</place_birth>
               <tax_residency>${dataObj?.citizenshipCountryBseCode == "101" ? "Y" : "N"}</tax_residency>
               <country_tax_residency1>${dataObj?.citizenshipCountryBseCode == "101" ? dataObj?.citizenshipCountryNseCode : ""}</country_tax_residency1>
               <tax_payer_identityno1>${dataObj?.citizenshipCountryBseCode == "101" ? dataObj?.otherThanIndiaTaxPayerIndentification : ""}</tax_payer_identityno1>
               <id1_type>${dataObj?.citizenshipCountryBseCode == "101" ? dataObj?.otherThanIndiaTaxPayerIndentificationTypeNseCode : ""}</id1_type>
               <country_tax_residency2></country_tax_residency2>
               <tax_payer_identityno2></tax_payer_identityno2>
               <id2_type></id2_type>
               <country_tax_residency3></country_tax_residency3>
               <tax_payer_identityno3></tax_payer_identityno3>
               <id3_type></id3_type>
               <country_tax_residency4></country_tax_residency4>
               <tax_payer_identityno4></tax_payer_identityno4>
               <id4_type></id4_type>
               <ffi_drnfe></ffi_drnfe>
               <nffe_catg></nffe_catg>
               <nature_bus></nature_bus>
               <act_nfe_subcat></act_nfe_subcat>
               <stock_exchange></stock_exchange>
               <listed_company></listed_company>
               <us_person>N</us_person>
               <exemp_code></exemp_code>
               <giin_applicable></giin_applicable>
               <giin></giin>
               <giin_exem_cat></giin_exem_cat>
               <sponcer_availability></sponcer_availability>
               <sponcer_entity></sponcer_entity>
               <giin_not_app></giin_not_app>
             </Fatca>
             <ubo>
               <ubo_add1></ubo_add1>
               <ubo_add2></ubo_add2>
               <ubo_add3></ubo_add3>
               <ubo_master_codes></ubo_master_codes>
               <ubo_pan_no></ubo_pan_no>
               <ubo_name></ubo_name>
               <ubo_country_tax_residency></ubo_country_tax_residency>
               <ubo_cob></ubo_cob>
               <ubo_cocn></ubo_cocn>
               <ubo_country></ubo_country>
               <ubo_dob></ubo_dob>
               <ubo_father_nam></ubo_father_nam>
               <ubo_gender></ubo_gender>
               <ubo_holding_perc></ubo_holding_perc>
               <ubo_occ_code></ubo_occ_code>
               <ubo_tel_no></ubo_tel_no>
               <ubo_mobile></ubo_mobile>
               <ubo_pincode></ubo_pincode>
               <ubo_city></ubo_city>
               <ubo_state></ubo_state>
               <ubo_add_type></ubo_add_type>
               <ubo_id_type></ubo_id_type>
               <ubo_tin_no></ubo_tin_no>
             </ubo>
           </service_request>
          </NMFIIService>   

    `;

    console.log(xmlFormData);
    let config = {
      method: "post",
      url: `${NSE_BASE_URL}/NMFIITrxnService/NMFTrxnService/FATCAKYCUBOREG`,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cookie: "ASP.NET_SessionId=tuijbw0iiw5ns1f2szcjfumy",
      },
      data: xmlFormData,
    };

    try {
      let res = await axios(config);
      console.log(res.data);
      res.st;
      return {
        responseBody: res.data,
        axiosConfig: config,
        statusCode: res.status,
        statusText: res.statusText,
      };
    } catch (error) {
      console.error(error);
      return {
        errorResponse: error?.response?.data,
        errorResponseHeader: error?.response?.headers,
        // errorResponseConfig: error?.response?.,
        statusCode: error?.response?.status,
        statusText: error?.response?.statusText,
        axiosConfig: config,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const xmlStateHelper = (xml) => {
  try {
    let data = convert.xml2js(xml);
    // console.log(JSON.stringify(data, null, 2));
    let finalArr = [];
    data?.elements
      ?.find((el) => el.name == "DataSet")
      ?.elements?.find((el) => el.name == "diffgr:diffgram")
      ?.elements?.find((el) => el.name == "NewDataSet")
      ?.elements?.filter((el) => el.name == "state_master")
      .forEach((el) => {
        let stateCodeObj = el.elements.find((el) => el.name == "STATE_CODE");
        let stateNameObj = el.elements.find((el) => el.name == "STATE_NAME");
        if (stateCodeObj && stateNameObj) {
          let codeObj = stateCodeObj.elements.find((el) => el.type == "text");
          let nameObj = stateNameObj.elements.find((el) => el.type == "text");
          let finalObj = {
            stateCode: codeObj.text,
            stateName: nameObj.text,
          };
          finalArr.push(finalObj);
        }
      });
    // console.log(finalArr);
    finalArr = finalArr.map((el) => {
      let obj = {
        nseStateCode: el.stateCode,
        nseStateName: el.stateName,
        bseStateName: "",
        bseStateCode: "",
      };

      let searchTerm = "";
      if (el.stateName.toLowerCase() == "orissa" || el.stateName.toLowerCase() == "odisha") {
        searchTerm = "orissa";
      } else if (el.stateName.toLowerCase() == "uttarakhand" || el.stateName.toLowerCase() == "uttaranchal") {
        searchTerm = "uttaranchal";
      } else if (el.stateName.toLowerCase() == "telangana" || el.stateName.toLowerCase() == "telengana") {
        searchTerm = "telengana";
      } else if (el.stateName.toLowerCase() == "puducherry" || el.stateName.toLowerCase() == "pondicherry") {
        searchTerm = "pondicherry";
      } else {
        let names = el.stateName.split(" ");
        searchTerm = names[0]?.toLowerCase();
        if (names.length > 2) {
          searchTerm = searchTerm + " ";
        }
      }
      let tempObj = BSE_STATE_CODES.find((elx) => {
        let names = elx.stateName.toLowerCase().split(" ");
        let compareTerm = names[0]?.toLowerCase();
        if (names.length > 2) {
          compareTerm = compareTerm + " ";
        }
        return compareTerm == searchTerm;
      });
      obj.bseStateCode = tempObj?.stateCode;
      obj.bseStateName = tempObj?.stateName;
      return obj;
    });
    finalArr = finalArr.filter((el) => el.bseStateCode && el.bseStateName && el.nseStateCode && el.nseStateName);
    return finalArr;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const xmlCityHelper = (xml) => {
  let data = convert.xml2js(xml);
  // console.log(JSON.stringify(data, null, 2));
  let finalArr = [];

  data?.elements
    ?.find((el) => el.name == "DataSet")
    ?.elements?.find((el) => el.name == "diffgr:diffgram")
    ?.elements?.find((el) => el.name == "NewDataSet")
    ?.elements?.filter((el) => el.name == "city_master")
    .forEach((el) => {
      // let cityCodeObj = el.elements.find((el) => el.name == "CITY_CODE");
      let cityNameObj = el.elements.find((el) => el.name == "CITY");
      let pincodeObj = el.elements.find((el) => el.name == "PINCODE");
      let stateObj = el.elements.find((el) => el.name == "STATE_CODE");
      let countryObj = el.elements.find((el) => el.name == "COUNTRY_CODE");
      if (cityNameObj && pincodeObj && stateObj && countryObj) {
        // let codeObj = cityCodeObj.elements.find((el) => el.type == "text");
        let nameObj = cityNameObj.elements.find((el) => el.type == "text");
        let pinObj = pincodeObj.elements.find((el) => el.type == "text");
        let stObj = stateObj.elements.find((el) => el.type == "text");
        let cnObj = countryObj.elements.find((el) => el.type == "text");
        let finalObj = {
          // cityCode: codeObj.text,
          name: nameObj.text,
          pincodeArr: [{ pincode: pinObj.text }],
          nseStateCode: stObj.text,
          nseCountryCode: cnObj.text,
        };
        finalArr.push(finalObj);
      }
    });

  finalArr = finalArr.reduce((acc, el, i) => {
    // find name
    let exists = acc.find((ele) => ele.name == el.name);
    // console.log("EXISTS", exists, i);
    if (exists) {
      return acc.map((ele) => {
        if (ele.name == el.name) {
          return { ...ele, pincodeArr: [...ele.pincodeArr, ...el.pincodeArr] };
        } else {
          return ele;
        }
      });
    } else {
      return [...acc, el];
    }
  }, []);

  return finalArr;
};

const setStatesInDB = async (finalArr) => {
  try {
    await nseBseStateModel.deleteMany({});
    await nseBseStateModel.insertMany(finalArr);
    console.log("NSE BSE States set");
  } catch (error) {
    console.error(error);
  }
};

const setCitiesInDB = async (finalArr, stateCode) => {
  try {
    await cityModel.deleteMany({ nseStateCode: stateCode });
    if (finalArr?.length) {
      await cityModel.insertMany(finalArr);
    }

    // console.log("Setting Cities for", stateCode, finalArr.length);
  } catch (error) {
    console.error(error);
  }
};

export const nseStateGet = async () => {
  try {
    let config = {
      method: "get",
      url: `${NSE_BASE_URL}/NMFIIService/NMFService/State?BrokerCode=${NSE_BROKER_CODE}&Appln_Id=${NSE_APP_ID}&Password=${NSE_PASSWORD}`,
      // headers: {
      //   Cookie: "SameSite=lax; ASP.NET_SessionId=zv4ffa5pl14ssv0qpehtgyyn",
      // },
    };

    let res = await axios(config);
    let data = xmlStateHelper(res.data);
    if (data) {
      await setStatesInDB(data);
    }
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
};

export const nseCityGet = async () => {
  try {
    let states = await nseBseStateModel.find().lean().exec();

    for (let obj of states) {
      try {
        let config = {
          method: "get",
          url: `${NSE_BASE_URL}/NMFIIService/NMFService/City?BrokerCode=${NSE_BROKER_CODE}&Appln_Id=${NSE_APP_ID}&Password=${NSE_PASSWORD}&StateCode=${obj.nseStateCode}`,
        };

        let res = await axios(config);
        let data = xmlCityHelper(res.data);
        await setCitiesInDB(data, obj.nseStateCode);
        // break;
      } catch (error) {
        console.error("error in " + obj.nseStateName, error);
      }
    }

    console.log("NSE BSE Citites set");
  } catch (error) {
    console.error(error);
  }
};

const xmlCountryHelper = (xml) => {
  let data = convert.xml2js(xml);
  // console.log(JSON.stringify(data, null, 2));
  let finalArr = [];

  data?.elements
    ?.find((el) => el.name == "DataSet")
    ?.elements?.find((el) => el.name == "diffgr:diffgram")
    ?.elements?.find((el) => el.name == "NewDataSet")
    ?.elements?.filter((el) => el.name == "country_master")
    .forEach((el) => {
      let countryCodeObj = el.elements.find((el) => el.name == "COUNTRY_CODE");
      let countryNameObj = el.elements.find((el) => el.name == "COUNTRY_NAME");
      if (countryCodeObj && countryNameObj) {
        let codeObj = countryCodeObj.elements.find((el) => el.type == "text");
        let nameObj = countryNameObj.elements.find((el) => el.type == "text");
        let finalObj = {
          countryCode: codeObj.text,
          name: nameObj.text,
        };
        finalArr.push(finalObj);
      }
    });
  // console.log(finalArr);
  finalArr = finalArr.map((el) => {
    let obj = {
      nseCountryCode: el.countryCode,
      nseCountryName: el.name,
      bseCountryName: "",
      bseCountryCode: "",
    };

    let searchTerm = el.name.trim().toLowerCase();
    let tempObj = BSE_COUNTRY_CODE.find((elx) => {
      let compareTerm = elx.countryName.trim().toLowerCase();
      return compareTerm == searchTerm;
    });

    obj.bseCountryCode = tempObj?.countryCode;
    obj.bseCountryName = tempObj?.countryName;

    return obj;
  });
  // console.log(finalArr);

  return finalArr;
};

const setCountriesInDB = async (finalArr) => {
  try {
    await countryModel.deleteMany({});
    await countryModel.insertMany(finalArr);
    console.log("NSE BSE Country set");
  } catch (error) {
    console.error(error);
  }
};

export const nseCountryGet = async () => {
  try {
    let config = {
      method: "get",
      url: `${NSE_BASE_URL}/NMFIIService/NMFService/Country?BrokerCode=${NSE_BROKER_CODE}&Appln_Id=${NSE_APP_ID}&Password=${NSE_PASSWORD}`,
      // headers: {
      //   Cookie: "SameSite=lax; ASP.NET_SessionId=zv4ffa5pl14ssv0qpehtgyyn",
      // },
    };

    let res = await axios(config);
    let data = xmlCountryHelper(res.data);
    if (data) {
      await setCountriesInDB(data);
    }
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const xmlTaxHelper = (xml) => {
  let data = convert.xml2js(xml);
  // console.log(JSON.stringify(data, null, 2));

  let finalArr = [];

  // tax code is ssame in both nse and bse
  data?.elements
    ?.find((el) => el.name == "DataSet")
    ?.elements?.find((el) => el.name == "diffgr:diffgram")
    ?.elements?.find((el) => el.name == "NewDataSet")
    ?.elements?.filter((el) => el.name == "tax_master")
    .forEach((el) => {
      let taxCodeObj = el.elements.find((el) => el.name == "TAX_STATUS_CODE");
      let taxNameObj = el.elements.find((el) => el.name == "TAX_STATUS_DESC");
      if (taxCodeObj && taxNameObj) {
        let codeObj = taxCodeObj.elements.find((el) => el.type == "text");
        let nameObj = taxNameObj.elements.find((el) => el.type == "text");
        let finalObj = {
          nseTaxCode: codeObj.text,
          nseTaxName: nameObj.text,
          bseTaxCode: codeObj.text,
          bseTaxName: nameObj.text,
        };
        finalArr.push(finalObj);
      }
    });
  // console.log(finalArr);
  // finalArr = finalArr
  //   .map((el) => {
  //     let obj = {
  //       nseTaxCode: el.taxCode,
  //       nseTaxName: el.name,
  //       bseTaxName: "",
  //       bseTaxCode: "",
  //     };

  //     let searchTerm = "";

  //     if (el.name.toLowerCase() == "mutual fund fof scheme") {
  //       searchTerm = "mutual funds fof schemes";
  //     } else if (el.name.toLowerCase() == "mutual fund") {
  //       searchTerm = "mutual funds";
  //     } else if (el.name.toLowerCase().includes("qfi")) {
  //       searchTerm = el.name.toLowerCase();
  //     } else {
  //       let names = el.name.split(" ");
  //       searchTerm = names[0]?.toLowerCase();
  //     }
  //     // if (names.length > 2) {
  //     //   searchTerm = searchTerm + " ";
  //     // }

  //     let tempObj = BSE_TAX_STATUS.find((elx) => {
  //       let compareTerm = "";

  //       if (elx.name.toLowerCase() == "mutual funds") {
  //         compareTerm = "mutual funds";
  //       } else if (elx.name.toLowerCase() == "mutual funds fof schemes") {
  //         compareTerm = "mutual funds fof schemes";
  //       } else if (elx.name.toLowerCase().includes("qfi")) {
  //         compareTerm = elx.name.toLowerCase();
  //       } else {
  //         let names = elx.name.toLowerCase().split(" ");
  //         compareTerm = names[0]?.toLowerCase();
  //       }

  //       // if (names.length > 2) {
  //       //   compareTerm = compareTerm + " ";
  //       // }
  //       console.log(`${compareTerm}, ${searchTerm}`);
  //       return compareTerm == searchTerm;
  //     });
  //     obj.bseTaxCode = tempObj?.code;
  //     obj.bseTaxName = tempObj?.name;
  //     return obj;
  //   })
  //   .filter((el) => el.bseTaxCode && el.bseTaxName && el.nseTaxCode && el.nseTaxName);

  return finalArr;
};
const setTaxInDb = async (finalArr) => {
  try {
    await nseBseTaxStatusModel.deleteMany({});
    await nseBseTaxStatusModel.insertMany(finalArr);
    console.log("NSE BSE Tax Status set");
  } catch (error) {
    console.error(error);
  }
};
const nseTaxGet = async () => {
  try {
    let config = {
      method: "get",
      url: `${NSE_BASE_URL}/NMFIIService/NMFService/Tax?BrokerCode=${NSE_BROKER_CODE}&Appln_Id=${NSE_APP_ID}&Password=${NSE_PASSWORD}`,
    };

    let res = await axios(config);
    let data = xmlTaxHelper(res.data);
    if (data) {
      await setTaxInDb(data);
    }
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const xmlHoldingHelper = (xml) => {
  let data = convert.xml2js(xml);
  // console.log(JSON.stringify(data, null, 2));

  let finalArr = [];

  data?.elements
    ?.find((el) => el.name == "DataSet")
    ?.elements?.find((el) => el.name == "diffgr:diffgram")
    ?.elements?.find((el) => el.name == "NewDataSet")
    ?.elements?.filter((el) => el.name == "holding_nature")
    .forEach((el) => {
      let holdingCodeObj = el.elements.find((el) => el.name == "HOLD_NATURE_CODE");
      let holdingNameObj = el.elements.find((el) => el.name == "HOLD_NATURE_DESC");
      if (holdingCodeObj && holdingNameObj) {
        let codeObj = holdingCodeObj.elements.find((el) => el.type == "text");
        let nameObj = holdingNameObj.elements.find((el) => el.type == "text");
        let finalObj = {
          holdingCode: codeObj.text,
          name: nameObj.text,
        };
        finalArr.push(finalObj);
      }
    });
  // console.log(finalArr);
  finalArr = finalArr
    .map((el) => {
      let obj = {
        nseHoldingCode: el.holdingCode,
        nseHoldingName: el.name,
        bseHoldingName: "",
        bseHoldingCode: "",
      };

      let searchTerm = "";
      let names = el.name.split(" ");
      searchTerm = names[0]?.toLowerCase();
      // if (names.length > 2) {
      //   searchTerm = searchTerm + " ";
      // }

      let tempObj = BSE_HOLDING_NATURE.find((elx) => {
        let names = elx.name.toLowerCase().split(" ");
        let compareTerm = names[0]?.toLowerCase();
        // if (names.length > 2) {
        //   compareTerm = compareTerm + " ";
        // }
        return compareTerm == searchTerm;
      });
      obj.bseHoldingCode = tempObj?.code;
      obj.bseHoldingName = tempObj?.name;
      return obj;
    })
    .filter((el) => el.bseHoldingCode && el.bseHoldingName && el.nseHoldingCode && el.nseHoldingName);

  return finalArr;
};
const setHoldingInDb = async (finalArr) => {
  try {
    await nseBseHoldingModel.deleteMany({});
    await nseBseHoldingModel.insertMany(finalArr);
    console.log("NSE BSE Holding set");
  } catch (error) {
    console.error(error);
  }
};

const nseHoldingGet = async () => {
  try {
    let config = {
      method: "get",
      url: `${NSE_BASE_URL}/NMFIIService/NMFService/HoldingNature?BrokerCode=${NSE_BROKER_CODE}&Appln_Id=${NSE_APP_ID}&Password=${NSE_PASSWORD}`,
    };

    let res = await axios(config);
    // console.log("res", res.data, "asdf");
    let data = xmlHoldingHelper(res.data);
    if (data) {
      await setHoldingInDb(data);
    }
    // console.log(data);
  } catch (error) {
    console.error(error);
  }
};

const setNseLocationData = async () => {
  try {
    await nseCountryGet();
    await nseStateGet();
    await nseCityGet();
  } catch (error) {
    console.error(error);
  }
};

export const setNseBseData = async () => {
  try {
    setNseLocationData();
    nseHoldingGet();
    nseTaxGet();
  } catch (error) {
    console.error(error);
  }
};

export const getNseAddressType = (addressType) => {
  try {
    let addressObj = ADDRESS_TYPES_CODE.find((el) => el.type == addressType);
    if (addressObj?.code) return parseInt(addressObj?.code);
    return 2;
  } catch (error) {
    console.error(error);
  }
};
