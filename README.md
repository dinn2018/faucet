# Faucet

```bash
git clone https://github.com/dinn2018/faucet.git
cd faucet

npm install
npm run start
```

## Config

enviroment variables:

| ENV name            | description           |
| ------------------- | --------------------- |
| NODE_ENV            | server current env    |
| PRIV_KEY            | private key of faucet |
| CHAIN_TAG           | chain tag of faucet   |
| FAUCET_PORT         | faucet api port       |
| RECAPCHA_SECRET_KEY | recapcha secret key   |
| FAUCET_CORS         | faucet cors           |

 config.json

| Prop                  | type   | description                                                  |
| --------------------- | ------ | ------------------------------------------------------------ |
| vet                   | Number | withdraw vet amount for each time                            |
| thor                  | Number | withdraw thor amount for each time                           |
| vetLimit              | Number | minimum vet amount for faucet, request will be forbidden if balance of faucet address is less than vetLimit |
| thorLimit             | Number | minimum thor amount for faucet, request will be forbidden if thor of faucet  address is less than thorLimit |
| networkAPIAddr        | String | restful api addr of block chain                              |
| maxAddressTimes       | Number | max times of one address withdraws each day                  |
| maxIPTimes            | Number | max times of one ip withdraws each day                       |
| certificateExpiration | Number | certificate expirations default:600s                         |
| recapchaMinScore      | Number | minimum recapcha score                                       |

------

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

