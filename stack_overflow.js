exports.get_stack_questions = async () => {
    try {
        const axios = require('axios');

        const now = new Date();
        const now_time = Math.floor(now.getTime() / 1000);
        
        const from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const from_time = Math.floor(from.getTime() / 1000);

        const query_url = `https://api.stackexchange.com/2.3/questions?order=asc&fromdate=${from_time}&todate=${now_time}&sort=creation&tagged=starknet;cairo;cairo-lang;zkp&site=stackoverflow`;;

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: query_url 
        };

        const res = await axios(config);
        for(let i = 0; i < res.data.items.length; i++) {
            console.log(res.data.items[i].question_id);
        }
        return res.data;
    } catch (err) {
        console.log(err);
    }

}