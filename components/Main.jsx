import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import download from "downloadjs";
import { QRCode } from "react-qrcode-logo";
import styles from "../styles/components/main.module.scss";

const Main = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const handleCreateQR = async () => {
    if (error) setError(null);
    if (metadata) setMetadata(null);

    const JSONdata = JSON.stringify({
      url: value,
    });

    const endpoint = "/api/metadata";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    console.log(result);
    if (response.ok) {
      setMetadata(result);
    } else {
      setError(result);
    }
  };

  const handleSaveToWallet = async () => {
    const endpoint = "/api/passbook.pkpass";

    // const options = {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   // body: JSONdata,
    // };

    const response = await fetch(endpoint);
    const result = await response.json();

    download(result.file.data, "passport.pkpass", "application/vnd.apple.pkpass");

    // if (response.ok) {
    //   console.log("Ok")
    // } else {
    //   console.log("Error: ", response);
    //   setError(response);
    // }
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Passport</h1>

      <p className={styles.description}>
        Paste a link to generate a QR code you can easily share{" "}
      </p>
      <div className={styles.inputContainer}>
        <input onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => handleCreateQR()}>Create</button>
      </div>

      <button onClick={() => handleSaveToWallet()}>
        <Image
          src="/img/wallet.svg"
          alt="Apple Wallet Button"
          className="h-16"
          width={200}
          height={50}
        />
      </button>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={`${styles.code} ${value !== "" && styles.visible}`}>
            <QRCode
              value={value}
              size={224}
              eyeRadius={4}
              bgColor={"#000000"}
              fgColor={"#f8f8f8"}
              logoImage={metadata?.icon}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
