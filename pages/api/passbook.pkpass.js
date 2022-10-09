import fs from 'fs'
import path from 'path'

async function GeneratePass(data) {
  const { Template } = require("@walletpass/pass-js");

  console.log("Starting pass generation");

  // const template = await Template.load("./public/passport.pass", "125968");
  const template = new Template("generic", {
    passTypeIdentifier: "pass.passport.wallet",
    teamIdentifier: "HE452HL4WS",
    backgroundColor: "red",
    sharingProhibited: true
  });
  await template.loadCertificate("./public/keys/sign.pem", "125968");

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
    res.json({ file });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data", message: err });
  }
}
