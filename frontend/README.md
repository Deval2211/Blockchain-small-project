# Simple Storage DApp (React + Ethers v6)

This project is a minimal Web3 DApp example that demonstrates how to
interact with an Ethereum smart contract using React and Ethers.js v6.

The application allows users to:

-   Connect their wallet
-   Read data from a smart contract
-   Write data to a smart contract

This example is commonly used to teach the basic architecture of
decentralized applications (DApps).

------------------------------------------------------------------------

# Project Flow

1.  Deploy the Solidity smart contract
2.  Copy the contract address and ABI
3.  Connect the wallet from the React UI
4.  Read and write values using Ethers.js

------------------------------------------------------------------------

# 1. Smart Contract

Deploy the following contract using Remix IDE.

``` solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {

    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }

    function getValue() public view returns(uint256){
        return value;
    }
}
```

After deployment you will receive:

-   Contract Address
-   ABI

Example:

Contract Address: 0x1234...

------------------------------------------------------------------------

# 2. React Project Setup

Create a React project using Vite.

``` bash
npx create-vite@latest storage-dapp
```

Select:

React\
JavaScript

Move into the project directory:

``` bash
cd storage-dapp
```

Install ethers v6

``` bash
npm install ethers
```

Start the development server:

``` bash
npm run dev
```

------------------------------------------------------------------------

# 3. React Frontend (Ethers v6)

Create the main UI in:

src/App.jsx

``` javascript
import { useState } from "react";
import { ethers } from "ethers";
import abi from "./abis/abi.json";

const contractAddress = "0xc77E9E6ba2BA79a0613e727eCBA15f3BDf7a6FB9";

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
```

------------------------------------------------------------------------

# 4. How It Works

## Connect Wallet

window.ethereum\
↓\
ethers BrowserProvider\
↓\
Signer

The signer represents the user's wallet and is used to sign
transactions.

------------------------------------------------------------------------

## Read Data (No Gas Required)

contract.getValue()\
↓\
view call\
↓\
no gas

View functions only read blockchain data.

------------------------------------------------------------------------

## Write Data (Gas Required)

contract.setValue(10)\
↓\
transaction\
↓\
MetaMask approval\
↓\
gas fee

Transactions modify blockchain state and require gas fees.

------------------------------------------------------------------------

# 5. DApp Architecture

React UI\
↓\
Ethers.js\
↓\
MetaMask (Signer)\
↓\
Ethereum Network\
↓\
Smart Contract

------------------------------------------------------------------------

# Tech Stack

-   Solidity
-   React
-   Ethers.js v6
-   MetaMask
-   Vite

------------------------------------------------------------------------
