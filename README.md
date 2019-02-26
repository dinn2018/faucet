# Faucet

```bash
git clone https://github.com/dinn2018/faucet.git
cd faucet

npm install
npm run start
```

## Config

```bash
enviroment variables:

export NODE_ENV="dev"         //server current env
export PRIV_KEY="private key" //private key of faucet 
export CHAIN_TAG="tag"       //chain tag of faucet
export FAUCET_PORT="port"    //faucet api port
export RECAPCHA_SECRET_KEY="RECAPCHA_SECRET_KEY" // recapcha secret key
export FAUCET_CORS="FAUCET_CORS"         		 // faucet cors

config.json

{
    "vet": 500,  // withdraw vet amount for each time
    "thor": 500, // withdraw thor amount for each time
    "vetLimit": 1000000000,  // minimum vet amount for faucet, request will be forbidden if balance of faucet is less than vetLimit
    "thorLimit": 10000,      // minimum thor amount for faucet, request will be forbidden if thor of faucet is less than thorLimit
    "networkAPIAddr": "http://127.0.0.1:8669",  // restful api addr of block chain  
    "maxAddressTimes": 5,			// max times of one address withdraws each day
    "maxIPTimes": 10, 		// max times of one ip withdraws each day
    "certificateExpiration": 600,   // certificate expirations default:600s
    "recapchaMinScore": 0.5			//minimum recapcha score
}
```

## API

| API       | Method | params name | params description                                           |
| --------- | ------ | :---------: | ------------------------------------------------------------ |
| /requests | POST   |    token    | recapcha token (string)                                      |
|           |        |    annex    | { domain: string, signer: address, timestamp: number}  (object ) |
|           |        |  signature  | certificate signature (string)                               |
|           |        |   purpose   | purpose for sign certificate (string)                        |
|           |        |   payload   | {type: string, content: string} (object)                     |

| Success | Result       |
| ------- | ------------ |
| 200     | {id: string} |

| Failed | Error type                  | Error code |
| ------ | --------------------------- | ---------- |
| 400    | Parameter_Address           | 200        |
| 404    | Recapcha_Verified_Failed    | 300        |
|        | Recapcha_Low_Score          | 301        |
|        | Certificate_Expired         | 400        |
|        | Certificate_Verified_Failed | 401        |
|        | Insufficient_Vet            | 402        |
|        | Insufficient_Eng            | 403        |
|        | Address_RateLimit_Exceed    | 404        |
|        | IP_RateLimit_Exceed         | 405        |
|        | Exist_Transaction           | 406        |

