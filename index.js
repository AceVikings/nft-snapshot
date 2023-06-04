const ethers = require("ethers");
const multiABI = require("./multiABI.json");
const fs = require("fs");

const NFTAbi = ["function ownerOf(uint256 user) view returns(address)"];

async function main() {
  const provider = new ethers.JsonRpcProvider(
    "https://api.avax.network/ext/bc/C/rpc"
  );

  const contract = new ethers.Contract(
    "0xC581CC4582AbD5aA4aB5B6D1F27F71D13518c9dD",
    ["function ownerOf(uint256 user) view returns(address)"],
    provider
  );

  let iface = new ethers.Interface(NFTAbi);
  let calldata = [];
  for (let i = 1; i < 1001; i++) {
    calldata.push([
      "0xC581CC4582AbD5aA4aB5B6D1F27F71D13518c9dD",
      iface.encodeFunctionData("ownerOf", [i]),
    ]);
  }

  const multicontract = new ethers.Contract(
    "0xb14067B3C160E378DeEAFA8c0D03FF97Fbf0C408",
    multiABI,
    provider
  );

  data = await multicontract.aggregate(calldata);
  const AbiCoder = new ethers.AbiCoder();

  snapshot = new Map();

  data[1].map((val, _index) => {
    let address = AbiCoder.decode(["address"], val)[0];
    if (!snapshot.has(address)) {
      snapshot.set(address, [_index + 1]);
    } else {
      snapshot.set(address, [...snapshot.get(address), _index + 1]);
    }
  });

  let snapObject = [];
  snapshot.forEach((value, key) => {
    snapObject.push({
      [key]: value,
    });
  });

  var json = JSON.stringify(snapObject);
  fs.writeFile("snapshot.json", json, "utf8", function(err) {
    if (err) throw err;
    console.log("complete");
  });
}

main();
