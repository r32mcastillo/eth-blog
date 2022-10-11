
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const chainId = hre.network.config.chainId;
  //const chainId = 31337; // 31337 = localhost hardhat
  const networkName = hre.network.name
  const Lock = await hre.ethers.getContractFactory("Blog");
  const lock = await Lock.deploy();
  await lock.deployed();

 
  console.log("networkName: ", networkName);
  console.log("chainId: ", chainId);
  console.log(`Deployed to ${lock.address}`);

  //let data = JSON.stringify(config);
  let raddress = {};
  await fs.readFile('../web/src/config/artifacts/smartContratArtifact.js', 'utf8', function (err, data) {
    try {
      raddress = JSON.parse(data.split("export")[1].split("=")[1].split(";")[0]  );
      raddress[chainId]=lock.address;
    } catch (error) {
      address = `{"${chainId}":"${lock.address}"}`;
    }
  });
  await fs.readFile('./artifacts/contracts/Blog.sol/Blog.json', 'utf8', function (err, data) {
    const obj = JSON.parse(data);
    let config = `
    export const address = ${JSON.stringify(raddress)};
    export const abi = ${JSON.stringify(  obj.abi)};
    `;
    let output = JSON.stringify(config);
    fs.writeFileSync("../web/src/config/artifacts/smartContratArtifact.js", JSON.parse(output));

    //console.log(config);
  });

  /*
  fs.copyFile(
    "./artifacts/contracts/Blog.sol/Blog.json",
    "../web/config/artifacts/Blog.json",
    (err) => {
      if (err) {
        console.log("Error Occurred:", err);
      }
    }
  );//*/
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
