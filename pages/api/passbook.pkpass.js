import fs from 'fs'
import path from 'path'

async function GeneratePass(data) {
  const { Template } = require("@walletpass/pass-js");

  console.log("Starting pass generation");

  const template = await Template.load("./passport.pass", "125968");
  await template.loadCertificate("./keys/sign.pem", "125968", {
    allowHttp: true,
  });

  console.log("Loaded template");
  template.passTypeIdentifier = "pass.passport.wallet";
  template.teamIdentifier = "HE452HL4WS";

  template.barcodes = [
    {
      message: "https://tylerj.me",
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    },
  ];

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

    res.send(file)
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data", message: err });
  }
}
