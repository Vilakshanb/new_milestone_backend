import axios from "axios";
import request from "request";
import path from "path";
import fs from "fs";
import FormData from "form-data";
let signzyurl = "https://multi-channel-preproduction.signzy.tech";

const Request = request.defaults({ encoding: null });

export const handlesignzyError = (error) => {
  if (error?.response?.data?.error) {
    if (error?.response?.data?.error?.statusCode == 422 || error?.response?.data?.error?.status == 422) {
      let err = null;
      try {
        err = JSON.parse(error?.response?.data?.error?.message);
      } catch (error) {}
      if (err?.error) {
        throw err.error;
      } else if (err) {
        throw err;
      }
    }

    if (error?.response?.data?.error?.statusCode == 401 || error?.response?.data?.error?.status == 401) {
      throw { ...error?.response?.data?.error, statusCode: 500, status: 500 };
    }

    throw error?.response?.data?.error;
  }
  throw error;
};

export const captchaCreate = async (id) => {
  try {
    let obj = {
      url: `${signzyurl}/api/captchas/get`,
      headers: { id: id },
    };
    let response = await new Promise((resolve, reject) => {
      Request.get(obj, (error, response, body) => {
        if (error) {
          reject(error);
        }
        if (!error && response.statusCode == 200) {
          // console.log("response headers", response.headers);
          let imagedata = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString("base64");
          resolve({ imagedata, id: response?.headers?.id });
        }
      });
    });
    // const res = await axios.get(`${signzyurl}/api/captchas/get`, { headers: { id: id } });
    // // console.log(new Buffer(res).toString("base64"));
    // console.log(res);
    return response;
  } catch (error) {
    handlesignzyError(error);
  }
};

export const verifyCaptcha = async (text, id) => {
  /// obj includes text and captcha id
  try {
    const { data: res } = await axios.post(`${signzyurl}/api/captchas/verify`, { text, id });
    return res;
  } catch (error) {
    handlesignzyError(error);
  }
};

export const loginChannel = async (obj) => {
  try {
    const { data: res } = await axios.post(`${signzyurl}/api/channels/login`, obj);
    return res;
  } catch (error) {
    handlesignzyError(error);
  }
};

export const onBoardingObjectCreation = async (channelId, authToken, obj) => {
  try {
    const { data: res } = await axios.post(`${signzyurl}/api/channels/${channelId}/onboardings`, obj, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return res;
  } catch (error) {
    handlesignzyError(error);
  }
};

export const onBoardingUpdateForm = async (authToken, obj) => {
  try {
    const { data: res } = await axios.post(`${signzyurl}/api/onboardings/updateForm`, obj, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return res;
  } catch (error) {
    handlesignzyError(error);
  }
};

export const uploadImageToSignzy = async (authToken, filename) => {
  // investor login token
  console.log("INUPLOAD FUNCTION");
  console.log(__dirname);
  let filePath = path.join(__dirname, "..", "public", "uploads", filename);
  // let filePath = `/public/uploads/${filename}`;
  // console.log(filePath, "FILEPATH", fs.createReadStream(filePath), "READSTREAM", filename);
  let form = new FormData();
  form.append("ttl", "7 days");
  form.append("file", fs.createReadStream(filePath));
  const { data: res } = await axios.post(`${signzyurl}/api/onboardings/upload`, form, {
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
  });
  console.log(res, "IMAGE UPLOAD");
  return res;
};

export const investorLogin = async (authToken, channelUsername, username, password, captchaId, captchaText) => {
  try {
    let obj = {
      username,
      password,
      platform: 1,
      signzyCaptchaResponse: {
        text: captchaText,
        id: captchaId,
      },
    };
    console.log(obj, `${signzyurl}/api/onboardings/login?ns=${channelUsername}`, "\n@@@@@@@@@@@@@@@@@@@", obj, authToken);
    const { data: res } = await axios.post(`${signzyurl}/api/onboardings/login?ns=${channelUsername}`, obj, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    return res;
  } catch (error) {
    handlesignzyError(error);
  }
};

export const executeSignzy = async (authToken, obj) => {
  try {
    console.log("authToekn", authToken, obj);
    const { data: res } = await axios.post(`${signzyurl}/api/onboardings/execute`, obj, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken,
      },
    });
    console.log("objres signzy", obj, res);
    return res;
  } catch (error) {
    handlesignzyError(error);
  }
};
