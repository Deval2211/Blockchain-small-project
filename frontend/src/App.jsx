import { useState } from "react";
import { ethers } from "ethers";
import abi from "/home/deval/Projects/Blockchain/abis/abi.json";

const contractAddress = "0xCE1D8e2de9f8D53819b61Ae14297e14A4121a4b7";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [value, setValue] = useState("");
  const [storedValue, setStoredValue] = useState("");

  let provider;
  let signer;
  let contract;

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();

    const address = await signer.getAddress();

    setAccount(address);

    // Get Wallet Balance
    const bal = await provider.getBalance(address);

    const ethBalance = ethers.formatEther(bal);

    setBalance(parseFloat(ethBalance).toFixed(4));

    contract = new ethers.Contract(contractAddress, abi, signer);
  }

  async function readValue() {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const contract = new ethers.Contract(contractAddress, abi, provider);

    const data = await contract.value();

    setStoredValue(data.toString());
  }

  async function writeValue() {
    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await provider.getSigner();

    contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.setValue(value);

    await tx.wait();

    console.log("Transaction Confirmed");
  }

  return (
    <div
      style={{
        fontFamily: "Arial",
        background: "#f4f6f8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "420px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
          Simple Storage DApp
        </h2>

        <button
          onClick={connectWallet}
          style={{
            width: "100%",
            padding: "12px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          Connect Wallet
        </button>

        <p
          style={{
            background: "#f1f5f9",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "14px",
            wordBreak: "break-all"
          }}
        >
          <strong>Wallet:</strong> {account || "Not Connected"}
        </p>

        <p
          style={{
            background: "#f0fdf4",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "14px",
            marginTop: "10px"
          }}
        >
          <strong>Balance:</strong> {balance ? `${balance} ETH` : "--"}
        </p>

        <hr style={{ margin: "25px 0" }} />

        <h3 style={{ marginBottom: "10px" }}>Read Value</h3>

        <button
          onClick={readValue}
          style={{
            width: "100%",
            padding: "10px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Get Stored Value
        </button>

        <p
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "#ecfeff",
            borderRadius: "6px",
            fontWeight: "bold"
          }}
        >
          Stored Value: {storedValue}
        </p>

        <hr style={{ margin: "25px 0" }} />

        <h3 style={{ marginBottom: "10px" }}>Update Value</h3>

        <input
          type="number"
          placeholder="Enter number"
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "12px"
          }}
        />

        <button
          onClick={writeValue}
          style={{
            width: "100%",
            padding: "12px",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Set Value
        </button>
      </div>
    </div>
  );
}

export default App;
