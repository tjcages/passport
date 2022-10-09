import fs from "fs";
import path from "path";
import getConfig from "next/config";

async function GeneratePass(data) {
  const { Template } = require("@walletpass/pass-js");

  console.log("Starting pass generation");

  const { serverRuntimeConfig } = getConfig();

  path.join(serverRuntimeConfig.PROJECT_ROOT, "./public")

  const template = await Template.load("https://passport-nyc.vercel.app/passport.pass", "125968");
  await template.loadCertificate("./public/keys/sign.pem", "125968", {
    allowHttp: true,
  });

  console.log("Loaded template");
  // template.passTypeIdentifier = "pass.passport.wallet";
  // template.teamIdentifier = "HE452HL4WS";

  template.barcodes = [
    {
      message: "https://tylerj.me",
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    },
  ];

  console.log("Added barcodes");

  const pass = template.createPass();
  const file = await pass.asBuffer();

  console.log("Generated pass");

  return file;
}

export default async function handler(req, res) {
  try {
    const data = req.query;
    const file = await GeneratePass(await data);

    console.log(data);
    console.log(file);

    res.send(file);
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data", message: err });
  }
}
