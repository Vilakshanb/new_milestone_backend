import axios from "axios";

let kycUrl = "https://cugapi.kotakmf.com/INVESTOR/api/Admin/VerifyPan";
// let kycUrl = "https://beta1.kotakmf.com/OnlineUATAPI/api/Admin/VerifyPan";

export const verifyKyc = async (encryptedStr) => {
  try {
    var config = {
      method: "post",
      url: kycUrl,
      headers: {
        "Content-Type": "text/plain",
        Cookie:
          "AWSALB=uujuHoB8/25z4ewj07v2NHZNd7Gqt1ZUSekRveCNxaQGPyelNfVbJMLJcYYQhJ9ZHKTYeK30E11v8c8oWrkRfxytoJx8/KdGoXWPQtxSUz2sFQ91r/XyCR2d8vS2; AWSALBCORS=uujuHoB8/25z4ewj07v2NHZNd7Gqt1ZUSekRveCNxaQGPyelNfVbJMLJcYYQhJ9ZHKTYeK30E11v8c8oWrkRfxytoJx8/KdGoXWPQtxSUz2sFQ91r/XyCR2d8vS2",
      },
      data: encryptedStr,
    };

    const res = await axios(config);
    if (res) {
      return res;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
