// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
async function GeneratePass(data) {
  const { Template, Pass } = require("@walletpass/pass-js");

  const template = await Template.load("./public/passport.pass");
  await template.loadCertificate("./public/keys/com.passport.passbook.pem", "125968");

  template.barcodes = [
    {
      message: data.url,
      format: "PKBarcodeFormatQR",
      messageEncoding: "iso-8859-1",
    },
  ];

  template.headerFields.add({
    label: "DIGITAL LICENSE",
    key: "header",
    value: "TYler Guyy",
  });

  // Insert full name as primary field
  template.primaryFields.add({
    key: "name",
    value: "Me silly",
  });
  template.secondaryFields.add({
    key: "category",
    label: "CATEGORY",
    value: "turds",
  });

  template.secondaryFields.add({
    key: "id",
    label: "IDENTIFICATION NUMBER",
    value: "123",
  });

  template.auxiliaryFields.add({
    key: "expiration",
    label: "EXPIRATION DATE",
    value: "exp 10",
  });

  template.auxiliaryFields.add({
    key: "authority",
    label: "AUTHORITY",
    value: "authority",
  });

  template.auxiliaryFields.add({
    key: "country",
    label: "COUNTRY",
    value: "USA",
  });

  template.backFields.add({
    label: "Country",
    key: "country_back",
    value: "USA 2",
  });

  template.backFields.add({
    label: "National Aviation Authority",
    key: "authority_back",
    value: "authority 2",
  });

  console.log(data.category);
  console.log("done");
  const pass = template.createPass();

  const file = await pass.asBuffer();
  return file;
}

export default async function handler(req, res) {
  const data = req.query;
  const file = await GeneratePass(await data);

  res.status(200).send(file);
}
