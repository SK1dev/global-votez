const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    rinkeyby: {
      provider: function() {
        return new HDWalletProvider("minute flame smooth awake juice park power hair scale arena gospel second", "https://rinkeby.infura.io/v3/11efde83b7684163b6d7afaa57820669")
      },
      network_id: 4
    },
    development: { 
      network_id: "*", 
      host: 'localhost', 
      port: 8545,
      gas: 6721975,
      gasPrice: 20000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.17",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
 },
//  rinkeyby: {
//    provider: new HDWalletProvider(secrets.mnemonic, secrets.infuraApiKey),
//    network_id: '4'
//  }
};
