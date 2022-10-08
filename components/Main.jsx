import React, { useState } from "react";

import useSWR from 'swr'
import { QRCode } from "react-qrcode-logo";
import styles from "../styles/components/main.module.scss";

const fetcher = (...args) => fetch(...args).then((res) => console.log(res))

const Main = () => {
  const { data, error } = useSWR('/api/passbook', fetcher)
  const [value, setValue] = useState("");
  // const [error, setError] = useState(null);
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

  const handleCreatePass = async () => {


    // const JSONdata = JSON.stringify({
    //   url: "http://google.com",
    // });

    const endpoint = "/api/passbook";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: "",
    };

    const response = await fetch(endpoint, options);
    // const result = await response.json();

    console.log(response);
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Passport</h1>

      <p className={styles.description}>
        Paste a link to generate a QR code you can easily share{" "}
        {data && JSON.stringify(data)}
      </p>
      <div className={styles.inputContainer}>
        <input onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => handleCreateQR()}>Create</button>
      </div>

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
      <button onClick={() => handleCreatePass()}>GET APPLE WALLET PASS</button>
    </div>
  );
};

export default Main;
