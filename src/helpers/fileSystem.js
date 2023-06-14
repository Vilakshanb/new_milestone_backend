import fs from "fs";

export const storeFileAndReturnNameBase64 = async (base64) => {
  let tempBase64 = base64.split(",");
  let extension = tempBase64[0].split("/")[1];
  let filename = new Date().getTime() + `.${extension.split(";")[0]}`;
  let tryBase64;
  //   tryBase64 = base64.replace(/data:video/webm;codecs=vp8,opus;base64/ ""); // <--- make it any type
  //   tryBase64 = base64.replace(/ /g, "+"); // <--- this is important
  // console.log("START2", base64);
  tryBase64 = base64.split("base64,")[1];
  console.log("TRYBASE START");
  console.log(tryBase64, "TRYBASE");

  return new Promise((resolve, reject) => {
    fs.writeFile(`./src/public/uploads/${filename}`, tryBase64, "base64", (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log();
      resolve(filename);
    });
  });
};
