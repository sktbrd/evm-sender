import {
  keyframes,
  Stack,
  CardBody,
  Card,
  Select,
  Heading,
  Avatar,
  Box,
  Text,
  VStack,
  Grid,
  Spinner,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState} from "react";
import { Logo } from "./components/Logo";
import { NFT_ABI } from "./components/NFTAbi";
// @ts-ignore
import { usePioneer } from "@pioneer-platform/pioneer-react";
import Web3 from "web3";
import { CopyToClipboard } from "react-copy-to-clipboard"; // Import the library for copying to clipboard
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
// @ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
// @ts-ignore
import PIONEER_ICON from "lib/assets/png/pioneer.png";

const ALL_CHAINS = [
  {
    name: "Ethereum",
    chain_id: 1,
    symbol: "ETH",
    image: "https://pioneers.dev/coins/ethereum.png",
  },
  {
    name: "Polygon",
    chain_id: 137,
    symbol: "MATIC",
    image: "https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png",
  },
  {
    name: "Pulsechain",
    chain_id: 369,
    symbol: "PLS",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a6/HEX_Logo.png",
  },
  {
    name: "Optimism",
    chain_id: 10,
    symbol: "ETH",
    image: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  },
  {
    name: "Gnosis",
    chain_id: 100,
    symbol: "xDAI",
    image: "https://cdn.sanity.io/images/r2mka0oi/production/bf37b9c7fb36c7d3c96d3d05b45c76d89072b777-1800x1800.png",
  },
  {
    name: "Binance Smart Chain",
    chain_id: 56,
    symbol: "BNB",
    image: "https://i.ibb.co/BBRMFTd/image.png",
  },
  {
    name: "Smart BCH",
    chain_id: 10000,
    symbol: "BCH",
    image: "https://oss-us-cdn.maiziqianbao.net/Chain_logo/PU1641783052.jpg",
  },
  {
    name: "Doge Chain EVM",
    chain_id: 2000,
    symbol: "DOGE",
    image: "https://media.tenor.com/7wA-N7uaDVcAAAAj/zan-rui-zhanrui.gif",
  },
  // { name: "arbitrum", chain_id: 42161, symbol: "ARB", image: "https://pioneers.dev/coins/arbitrum.png" }, //TODO push node
  {
    name: "Fuse",
    chain_id: 122,
    symbol: "FUSE",
    image: "https://avatars.githubusercontent.com/u/53186165?s=280&v=4",
  },
  // { name: "bittorrent", chain_id: 199, symbol: "BTT", image: "https://pioneers.dev/coins/bittorrent.png" },//TODO push node
  {
    name: "Celo",
    chain_id: 42220,
    symbol: "CELO",
    image: "https://cryptologos.cc/logos/celo-celo-logo.png",
  },
  {
    name: "Avalanche",
    chain_id: 43114,
    symbol: "AVAX",
    image: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  },
  // { name: "görli", chain_id: 5, symbol: "GOR", image: "https://pioneers.dev/coins/görli.png" },
  {
    name: "Eos",
    chain_id: 59,
    symbol: "EOS",
    image: "https://cryptologos.cc/logos/eos-eos-logo.png",
  },
  // { name: "ethereum-classic", chain_id: 61, symbol: "ETC", image: "https://pioneers.dev/coins/ethereum-classic.png" }, //TODO push node
  {
    name: "Evmos",
    chain_id: 9001,
    symbol: "EVMOS",
    image: "https://s101-recruiting.cdn.greenhouse.io/external_greenhouse_job_boards/logos/400/114/810/original/Evmos_Token_Orange_RGB.jpeg?1657101087",
  },
  // { name: "poa-core", chain_id: 99, symbol: "POA", image: "https://pioneers.dev/coins/poa-core.png" }, //TODO push node
];

interface WalletOption {
  context: string;
  icon: any;
}

const Home = () => {
  const { state } = usePioneer();
  const { api, app, context, assetContext, blockchainContext, pubkeyContext } =
    state;
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState([]);
  const [walletOptions, setWalletOptions] = useState([]);
  const [balance, setBalance] = useState("0.000");
  const [tokenBalance, setTokenBalance] = useState("0.000");
  const [amount, setAmount] = useState("0.00000000");
  const [contract, setContract] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [block, setBlock] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [icon, setIcon] = useState("https://pioneers.dev/coins/ethereum.png");
  const [service, setService] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [prescision, setPrescision] = useState("");
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [chainId, setChainId] = useState(1);
  const [web3, setWeb3] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [txid, setTxid] = useState(null);
  const [signedTx, setSignedTx] = useState(null);
  const [loading, setLoading] = useState(null);
  const [isTokenSelected, setIsTokenSelected] = useState(null);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(() => []);
  const [query, setQuery] = useState("bitcoin...");
  const [timeOut, setTimeOut] = useState(null);

  useEffect(() => {
    console.log("pubkeyContext: ", pubkeyContext);
    setAddress(pubkeyContext.master || pubkeyContext.pubkey || "");
  }, [pubkeyContext]);

  const onSend = async function () {
    try {
      console.log("onSend");
      //get current context
      console.log("prescision: ", prescision);
      //build transaction
      //web3 get nonce
      // @ts-ignore
      let nonce = await web3.eth.getTransactionCount(address);
      // @ts-ignore
      nonce = web3.utils.toHex(nonce);
      app.sendToAddress();
      //get gas price
      // @ts-ignore
      let gasPrice = await web3.eth.getGasPrice();
      // @ts-ignore
      gasPrice = web3.utils.toHex(gasPrice);
      console.log("gasPrice: ", gasPrice);
      let gasLimit;
      let input;
      //get balance
      if (contract && !isNFT) {
        console.log("THIS IS A TOKEN SEND!");
        if (!contract) throw Error("Invalid token contract address");
        // @ts-ignore
        console.log("valuePRE: ", amount);
        //"0.01"
        // Use BigNumber to handle the large value and perform calculations
        // @ts-ignore
        const amountSat = parseInt(
          // @ts-ignore
          amount * Math.pow(10, prescision)
        ).toString();

        console.log("amountSat: ", amountSat.toString());
        //"10000000000"
        //"1"
        console.log("amountSat: ", amountSat);
        console.log("valamountSatue: ", amountSat.toString());
        //get token data
        // @ts-ignore
        const tokenData = await web3.eth.abi.encodeFunctionCall(
          {
            name: "transfer",
            type: "function",
            inputs: [
              {
                type: "address",
                name: "_to",
              },
              {
                type: "uint256",
                name: "_value",
              },
            ],
          },
          [toAddress, amountSat]
        );
        console.log("tokenData: ", tokenData);
        //get gas limit
        try {
          // @ts-ignore
          gasLimit = await web3.eth.estimateGas({
            to: address,
            value: amountSat,
            data: tokenData,
          });
          // @ts-ignore
          gasLimit = web3.utils.toHex(gasLimit + 941000); // Add 21000 gas to cover the size of the data payload
        } catch (e) {
          console.error("failed to get ESTIMATE GAS: ", e);
          // @ts-ignore
          gasLimit = web3.utils.toHex(30000 + 41000);
        }

        //sign
        input = {
          addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          nonce,
          gasPrice,
          gas: gasLimit,
          gasLimit,
          maxFeePerGas: gasPrice,
          maxPriorityFeePerGas: gasPrice,
          value: "0x0",
          from: address,
          to: contract,
          data: tokenData,
          chainId,
        };
        //console.log("input: ",input)
      } else if (contract && isNFT) {
        // @ts-ignore
        console.log("NFT send: ", contract);
        // console.log("NFT_ABI: ", NFT_ABI);
        // Create a contract instance
        // @ts-ignore
        const contractAbi = new web3.eth.Contract(NFT_ABI, contract);

        // Call the function to get the balance of the NFT owner
        const balance = await contractAbi.methods.balanceOf(address).call();
        console.log("balance: ", balance);

        if (balance == 0) {
          throw new Error("You do not own this NFT");
        }

        // Define the function selector for the transfer function
        // @ts-ignore
        const transferFunctionSelector = web3.eth.abi.encodeFunctionSignature({
          name: "transferFrom",
          type: "function",
          inputs: [
            { type: "address", name: "_from" },
            { type: "address", name: "_to" },
            { type: "uint256", name: "_tokenId" },
          ],
        });

        // Encode the parameters for the "transferFrom" function
        // @ts-ignore
        const transferParameters = web3.eth.abi.encodeParameters(
          ["address", "address", "uint256"],
          [address, toAddress, tokenId]
        );

        // Combine the function selector and encoded parameters to create the full data for the transaction
        const tokenData =
          transferFunctionSelector + transferParameters.slice(2); // Remove the first 2 characters ("0x") from the encoded parameters

        console.log("tokenData: ", tokenData);
        try {
          // @ts-ignore
          gasLimit = await web3.eth.estimateGas({
            to: address,
            value: "0x0",
            data: tokenData,
          });
          // @ts-ignore
          gasLimit = web3.utils.toHex(gasLimit + 941000); // Add 21000 gas to cover the size of the data payload
        } catch (e) {
          console.error("failed to get ESTIMATE GAS: ", e);
          // @ts-ignore
          gasLimit = web3.utils.toHex(30000 + 41000);
        }

        input = {
          addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          nonce,
          gasLimit,
          gasPrice,
          gas: gasLimit,
          value: "0x0",
          from: address,
          to: contract,
          data: tokenData,
          chainId,
        };
        //@ts-ignore
        console.log("input: ", input);
      } else {
        console.log("THIS IS A NATIVE SEND!");
        //get value in hex
        console.log("amount: ", amount);
        // @ts-ignore
        const valueInWei = amount * Math.pow(10, 18); // Keep it as a number without converting to string
        console.log("valueInWei: ", valueInWei);
        // @ts-ignore
        const valueInWeiHex = "0x" + valueInWei.toString(16);
        console.log("valueInWeiHex: ", valueInWeiHex);

        //get gas limit
        const gasLimitCall = {
          to: address,
          value: valueInWeiHex, // Use the hexadecimal value
          data: "0x",
        };
        let gasLimit;
        try {
          // @ts-ignore
          gasLimit = await web3.eth.estimateGas(gasLimitCall);
          console.log("gasLimit: ", gasLimit);
          // @ts-ignore
          gasLimit = web3.utils.toHex(gasLimit);
        } catch (e) {
          // @ts-ignore
          gasLimit = web3.utils.toHex(300000);
        }

        //sign
        input = {
          addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          nonce,
          gasLimit,
          // maxFeePerGas:gasPrice,
          // maxPriorityFeePerGas:gasPrice,
          gasPrice,
          gas: gasLimit,
          value: valueInWeiHex, // Use the hexadecimal value
          from: address,
          to: toAddress,
          data: "0x",
          chainId,
        };
        //@ts-ignore
        console.log("input: ", input);
      }
      //@ts-ignore
      console.log("input: ", input);
      //get gas limit
      console.log("wallet: ", wallet);
      //@ts-ignore @TODO detect context
      // const isMetaMask = await wallet?._isMetaMask;
      let isMetaMask = false
      // @ts-ignore
      if (wallet[0].type === "metamask") isMetaMask = true;
      console.log("wallet: ", wallet);
      console.log("isMetaMask: ", isMetaMask);
      let responseSign;
      if (isMetaMask) {
        // @ts-ignore
        responseSign = await wallet[0].wallet.ethSendTx(input);
        console.log("responseSign: ", responseSign);
        setTxid(responseSign.hash);
      } else {
        // @ts-ignore
        responseSign = await wallet[0].wallet.ethSignTx(input);
        console.log("responseSign: ", responseSign);
      }
      console.log("responseSign: ", responseSign);
      setSignedTx(responseSign.serialized);
    } catch (e) {
      console.error("Error on send!", e);
    }
  };

  const onBroadcast = async function () {
    const tag = " | onBroadcast | ";
    try {
      // console.log("onBroadcast: ",signedTx)
      // @ts-ignore
      setLoading(true);
      // @ts-ignore
      const txHash = await web3.eth.sendSignedTransaction(signedTx);
      // console.log(tag,"txHash: ",txHash)
      setTxid(txHash.transactionHash);
      setBlock(txHash.blockNumber);
      // @ts-ignore
      setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(tag, e);
    }
  };

  const handleInputChangeAmount = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    setAmount(inputValue);
  };

  const onStart = async function () {
    try {
      if (address) {
        console.log(app);
        setWallet(
          app.wallets.filter((wallet: any) => wallet.context === app.context)
        );
        console.log(wallet);
        //get wallets
        console.log("app: ", app);
        console.log("onStart context: ", app.context);
        console.log("onStart wallets: ", app.wallets);
        console.log("onStart walletDescriptions: ", app);
        console.log("onStart walletDescriptions: ", app.user);
        // console.log("walletDescriptions: ", app.walletDescriptions.length);

        const info = await api.SearchByNetworkId({ chainId: 1 });
        console.log("onStart: info: ", info.data[0]);
        if (!info.data[0]) {
          console.error("No network found!");
        }
        setService(info.data[0].service);
        setChainId(info.data[0].chainId);
        setBlockchain(info.data[0].name);
        // @ts-ignore
        const web3 = new Web3(
          // @ts-ignore
          new Web3.providers.HttpProvider(info.data[0].service)
        );
        // @ts-ignore
        setWeb3(web3);
        //Get the current block number
        const blockNumber = await web3.eth.getBlockNumber();
        console.log("blockNumber: ", blockNumber);
        const balanceResult = await web3.eth.getBalance(address, blockNumber);
        console.log("balanceResult: ", balanceResult);
        const balanceInEther = web3.utils.fromWei(balanceResult, "ether");
        setBalance(balanceInEther);
        // Now you can use the balanceInEther and blockNumber as needed
        console.log("Balance in Ether: ", balanceInEther);
        console.log("Block Number: ", blockNumber);

        //TODO get tokens for chain
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [api, app, app?.walletDescriptions, address]);

  const handleClose = async function () {
    try {
      // @ts-ignore
      setLoading(false);
      setTxid(null);
      setSignedTx(null);
      // @ts-ignore
      setToken(null);
      // @ts-ignore
      setBlock(null);
      // @ts-ignore
      setContract(null);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickTabs = async function (type: any) {
    try {
      if (type === "NFT") {
        setIsNFT(true);
      } else {
        setIsNFT(false);
      }
      console.log("Tab Clicked!");
      //get tokens for chain

      let assets = await api.SearchAssetsListByChainId({
        chainId,
        limit: 100,
        skip: 0,
      });
      assets = assets.data;
      //console.log("assets: ",assets.length)
      const assetsFormated = [];
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        asset.value = asset.name;
        asset.label = asset.name;
        assetsFormated.push(asset);
      }
      console.log("handleSelect: assetsFormated: ", assetsFormated.length);
      // @ts-ignore
      setAssets(assetsFormated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChangeAddress = (e: any) => {
    const inputValue = e.target.value;
    setToAddress(inputValue);
  };
  const handleAddressClick = () => {
    // Handle the address click event here
    alert("Address copied to clipboard");
  };
  const handleInputChangeContract = async function (input: any) {
    try {
      const inputValue = input.target.value;
      console.log("handleInputChangeContract: ", inputValue);
      setContract(inputValue);
      if (inputValue.length > 16 && inputValue.indexOf("0x") >= 0) {
        const minABI = [
          // balanceOf
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
          },
          // decimals
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [{ name: "", type: "uint8" }],
            type: "function",
          },
        ];
        console.log("inputValue: ", inputValue);
        // @ts-ignore
        const newContract = new web3.eth.Contract(minABI, inputValue);
        console.log("newContract: ", newContract);
        console.log("newContract: ", newContract.methods);
        const decimals = await newContract.methods.decimals().call();
        console.log("decimals: ", decimals);
        setPrescision(decimals);
        console.log("address: ", address);
        const balanceBN = await newContract.methods.balanceOf(address).call();
        console.log("input: balanceBN: ",balanceBN)
        // @ts-ignore
        const tokenBalance = parseInt(balanceBN / Math.pow(10, decimals));
        if (tokenBalance > 0) {
          setError(null);
          console.log("input: tokenBalance: ", tokenBalance);

          // @ts-ignore
          setTokenBalance(tokenBalance);
        } else {
          // @ts-ignore
          setError(
            // @ts-ignore
            `no balance on this token! chainId: ${chainId} contract: ${contract}`
          );
        }
      } else {
        // @ts-ignore
        setError("Invalid contract! must start with 0x");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChangeTokenId = async function (input: any) {
    try {
      const inputValue = input.target.value;
      console.log("handleInputChangeTokenId: ", inputValue);
      setTokenId(inputValue);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelect = async function (input: any) {
    try {
      console.log("handleSelect input: ", input.target.value);
      let selection: any = ALL_CHAINS.filter(
        (chain) => chain.name === input.target.value
      );
      console.log("handleSelect: ", selection);
      selection = selection[0];
      //get provider info
      const caip = "eip155:" + selection.chain_id + "/slip44:60";
      console.log("caip: ", caip);
      const info = await api.NodesByCaip({ caip });
      console.log("info: ", info);
      console.log("handleSelect: chainId: ", info.data[0].chainId);
      setIcon(selection.image);
      setService(info.data[0].service);
      setChainId(info.data[0].chainId);
      setBlockchain(info.data[0].name);
      // @ts-ignore
      console.log("web3 service provder: ", info.data[0].service);
      const web3New = new Web3(
        new Web3.providers.HttpProvider(info.data[0].service)
      );
      // @ts-ignore
      setWeb3(web3New);
      if (web3New) {
        //Get the current block number
        const blockNumber = await web3New.eth.getBlockNumber();
        console.log("blockNumber: ", blockNumber);
        const balanceResult = await web3New.eth.getBalance(
          address,
          blockNumber
        );
        console.log("balanceResult: ", balanceResult);
        const balanceInEther = web3New.utils.fromWei(balanceResult, "ether");
        setBalance(balanceInEther);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectWallet = (event: any) => {
    const selectedContext = event.target.value;
    console.log("selectedContext: ", selectedContext);
    setSelectedWallet(selectedContext);
  };
  const growShrinkAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;
  // @ts-ignore
  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => handleClose()} size="xl">
        <ModalOverlay />
        <ModalContent
  style={{
    border: "1px solid black",
    background: "linear-gradient(to bottom, black, white)",
  }}
>          <ModalHeader>Broadcasting to {blockchain}</ModalHeader>
          <ModalCloseButton />
          {loading ? (
            <div>
              <div>
                <h2>Broadcasted! waiting on confirmation!</h2>
              </div>
              <Spinner size="xl" color="green.500" > Click Connect Button</Spinner>
            </div>
          ) : (
            <div>
              <ModalBody>
                <Tabs >
                  <TabList >
                    <Tab>Native</Tab>
                    <Tab onClick={() => handleClickTabs("Token")}>Token</Tab>
                    <Tab onClick={() => handleClickTabs("NFT")}>NFT</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <div>Balance: {balance}</div>
                      <br />
                      <div>
                        Amount:{" "}
                        <Input border="1px solid black"
                          
                          type="text"
                          name="amount"
                          value={amount}
                          onChange={handleInputChangeAmount}
                        />
                      </div>
                      <br />
                      <div>
                        Address:{" "}
                        <Input border="1px solid black"
                          
                          type="text"
                          name="address"
                          value={toAddress}
                          placeholder="0x651982e85D5E43db682cD6153488083e1b810798"
                          onChange={handleInputChangeAddress}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        Contract:{" "}
<Input border="1px solid black"
                          type="text"
                          name="contract"
                          value={contract}
                          onChange={handleInputChangeContract}
                        />
                      </div>
                      {tokenBalance ? (
                        <div>Token Balance: {tokenBalance}</div>
                      ) : (
                        <div>No token balance</div>
                      )}
                      {prescision ? (
                        <div>Precision: {prescision}</div>
                      ) : (
                        <div />
                      )}
                      <Text color="red.500">{error}</Text>
                      <br />

                      <div>
                        Amount:{" "}
                      <Input border="1px solid black"

                          type="text"
                          name="amount"
                          value={amount}
                          onChange={handleInputChangeAmount}
                        />
                      </div>
                      <br />
                      <div>
                        Address:{" "}
                        <Input border="1px solid black"
                        
                          type="text"
                          name="address"
                          value={toAddress}
                          placeholder="0x6519....."
                          onChange={handleInputChangeAddress}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        isNFT: {isNFT.toString()}
                        <br />
                        {tokenBalance ? (
                          <div>tokenBalance: {tokenBalance}</div>
                        ) : (
                          <div>no token balance</div>
                        )}
                        <br />
                        contract:{" "}
<Input border="1px solid black"
                          type="text"
                          name="contract"
                          value={contract}
                          onChange={handleInputChangeContract}
                        />
                        <br />
                        <br />
                        tokenId:{" "}
<Input border="1px solid black"
                          type="text"
                          name="tokenId"
                          value={tokenId}
                          onChange={handleInputChangeTokenId}
                        />
                        <br />
                        <br />
                        <div>
                          address:{" "}
  <Input border="1px solid black"
                            type="text"
                            name="address"
                            value={toAddress}
                            placeholder="0x6519....."
                            onChange={handleInputChangeAddress}
                          />
                        </div>
                      </div>
                    </TabPanel>
                  </TabPanels>
                  <br />
                  {error ? <div>error: {error}</div> : <div />}
                  {txid ? <div>txid: {txid}</div> : <div />}
                  {block ? <div>confirmed in block: {block}</div> : <div />}
                  {txid ? (
                    <div />
                  ) : (
                    <div>
                      {signedTx ? <div>signedTx: {signedTx}</div> : <div />}
                    </div>
                  )}
                </Tabs>
              </ModalBody>

              <ModalFooter>
                {!signedTx ? (
                  <div>
                    <Button colorScheme="green" mr={3} onClick={onSend}>
                      Send
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
                {!txid ? (
                  <div>
                    {signedTx ? (
                      <div>
                        <Button
                          colorScheme="green"
                          mr={3}
                          onClick={onBroadcast}
                        >
                          broadcast
                        </Button>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                ) : (
                  <div />
                )}
                <Button colorScheme="red" mr={3} onClick={handleClose}>
                  close
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
      {address ? (
        <Box textAlign="center" fontSize="xl">
          <Grid minH="10vh" p={1}>
            <VStack spacing={2}>
              <Grid templateRows="1fr 1fr 0fr" gap="0rem" alignItems="center">
              <Box
        borderRadius="10px"
        border="1px"
        borderColor="black"

        display="flex"
        alignItems="center"
      >
        {/* Logo */}
        <Logo padding="20px" h="20vmin" pointerEvents="none" logo={icon} />

        {/* Centered Box for the first selection box */}
        <Box flex="1">


          <Select
            placeholder={`Choose Blockchain`}
            defaultValue="ethereum"
            onChange={handleSelect}
            maxWidth="80%"
            marginLeft="40px"
            borderColor="black"
          >
            {ALL_CHAINS.map((blockchain) => (
              <option key={blockchain.name} value={blockchain.name}>
                {blockchain.name} ({blockchain.symbol})
              </option>
            ))}
          </Select>
        </Box>
      </Box>
                  <Box borderRadius="10px" p="1rem" border="1px" borderColor="black">
                    <Text fontWeight="bold" color="black"> Address </Text>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CopyToClipboard text={address}>
                        <span onClick={handleAddressClick} style={{ cursor: 'pointer' }}>{address}</span>
                      </CopyToClipboard>
                      <FontAwesomeIcon icon={faCopy} onClick={handleAddressClick} style={{ cursor: 'pointer', marginLeft: '0.5rem' }} />
                    </div>
                  </Box>
                <Box borderRadius="10px"  border="1px" borderColor="black">
                  <Text fontWeight="bold" color="black">Balance: </Text>
                  <Text>{parseFloat(balance).toFixed(6)}</Text>
                </Box>
                <Box margin="10px" borderRadius="10px">
  <Button
    border="2px solid black"
    color="black"
    onClick={onOpen}
    size="lg"
  >
    Send
  </Button>
</Box>

              </Grid>
            </VStack>
          </Grid>
        </Box>
      ) : (
      <center>
        <Image         animation={`${growShrinkAnimation} 1s infinite`}
 boxSize="48px" src="https://hackernoon.com/images/PrB8ElNwFUY9FJD7Kw2aUJtm1UW2-qul02i16.gif" ></Image>
      <Text
        fontSize="xl"
        fontWeight="bold"
        color="black"
        animation={`${growShrinkAnimation} 1s infinite`}
      >
        Connect your wallet
      </Text>
        </center>
      )}
    </div>
  );
};

export default Home;
