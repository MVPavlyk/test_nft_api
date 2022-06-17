const express = require('express');
const axios = require('axios');


const app = express();

app.use(express.json());

const id = 'there must be id';
const secretKey = 'there must be key';

const baseURL = 'https://api.blockchainapi.com/v1/solana/wallet/mainnet-beta';

const config = {
    headers: {
        APIKeyID: id,
        APISecretKey: secretKey
    }
};

app.get('/nft/:publicKey', async (req, res) => {
    const query = req.query;
    const {publicKey} = req.params;
    let nfts_obj = {};

    try {
        nfts_obj = await axios.get(`${baseURL}/${publicKey}/nfts`, config)
            .then(value => value.data);
    } catch (e) {
        console.error(e);
    }

    let nfts_arr = nfts_obj.nfts_metadata;

    if (query.sort_by) {

        nfts_arr.sort((prev, next) => {
            const name1 = next.data.name.split(' ')[0].toLowerCase();
            const name2 = prev.data.name.split(' ')[0].toLowerCase();
            if (query.sort_by === 'desc') {
                if (name1 < name2) {
                    return -1;
                }
                if (name1 > name2) {
                    return 1;
                }
                return 0;
            } else {
                if (name1 < name2) {
                    return 1;
                }
                if (name1 > name2) {
                    return -1;
                }
                return 0;
            }
        });
    }

    if (query.search) {
        const searchedNfts = nfts_arr.filter(nft => nft.data.name.includes(query.search));
        res.json(searchedNfts);
    }

    if (query.page_num && query.page_size) {
        const start = +query.page_size * (+query.page_num - 1);
        console.log(start);
        const end = +query.page_size * +query.page_num;
        console.log(end);
        nfts_arr = nfts_arr.slice(start, end);

    }

    res.json(nfts_arr);
});


app.listen(5000, () => {
    console.log('App run at localhost:5000');
});
