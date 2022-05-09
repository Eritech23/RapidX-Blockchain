require("@nomiclabs/hardhat-waffle");

// https://eth-ropsten.alchemyapi.io/v2/wBhxRXBf-wCf710gw6lrzx1RKVZI813n


require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.3',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/wBhxRXBf-wCf710gw6lrzx1RKVZI813n',
      accounts: ['4291c601e2fa355547138bb83733eeafa63e06aa254b0525415587d0e1162cb9'],
    },
  },
};