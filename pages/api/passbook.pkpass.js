const { Template } = require("@walletpass/pass-js");

async function GeneratePass(data) {
  console.log("Starting pass generation");

  const template = await Template.load("./public/passport.pass", "125968");
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
  const data = req.query;
  const file = await GeneratePass(await data);

  console.log(data)
  console.log(file)

  res.status(200).send(file);
}