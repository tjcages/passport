const request = require('request');
var fs = require('fs');
var path = require('path');
const { Template } = require("@walletpass/pass-js");

async function GeneratePass(data) {
  console.log("Starting pass generation");

  request('https://passport-nyc.vercel.app/passport.pass/pass.json').pipe(fs.createWriteStream('passport.pass/pass.json'));
  request('https://passport-nyc.vercel.app/keys/sign.pem').pipe(fs.createWriteStream('sign.pem'))

  console.log("set")

  const filePath = path.join(process.cwd(), './public/passport.pass');
  const template = await Template.load(filePath, "125968");
  await template.loadCertificate("./public/keys/sign.pem", "125968", {
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

    res.send(file);
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data", message: err });
  }
}
