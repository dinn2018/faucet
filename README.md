# Faucet

```bash
git clone https://github.com/dinn2018/faucet.git
cd faucet

npm install
npm run start
```

## Config

```bash
export NODE_ENV="dev"         //server current env
export PRIV_KEY="private key" //private key of faucet 
export CHAIN_TAG="tag"       //chain tag of faucet
export FAUCET_PORT="port"    //faucet port
export RECAPCHA_SECRET_KEY="RECAPCHA_SECRET_KEY" // recapcha secret key
export FAUCET_CORS="FAUCET_CORS"         		 // faucet cors

config.json

{
    "vet": 500,  // withdraw vet amount for each time
    "thor": 500, // withdraw thor amount for each time
    "vetLimit": 1000000000,  // minimum vet amount for faucet,request will be forbidden if balance of faucet is less than vetLimit
    "engLimit": 10000,      // minimum thor amount for faucet,request will be forbidden if balance of faucet is less than vetLimit
    "networkAPIAddr": "http://127.0.0.1:8669",  // restful api addr of block chain  
    "maxAddressTimes": 5,			// max times of one address withdraws each day
    "maxRemoteaddrTimes": 10, 		// max times of one ip withdraws each day
    "certificateExpiration": 600,   // certificate expirations default:600s
    "recapchaMinScore": 0.5			//minimum recapcha score
}
```

