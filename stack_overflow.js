exports.get_stack_questions = async (last_10_minutes) => {
    try {
        const axios = require('axios');
        //Get last 10 minutes time boundaries
        const now = new Date();
        const now_time = Math.floor(now.getTime() / 1000);
        console.log("Now time", now_time);
        const from = new Date(now.getTime() - 10 * 60000);
        console.log("From time", from);
        const from_time = Math.floor(from.getTime() / 1000);

        const query_url = `https://api.stackexchange.com/2.3/questions?fromdate=${from_time}&todate=${now_time}&sort=creation&tagged=starknet&site=stackoverflow`;;

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: query_url // `https://api.stackexchange.com/2.3/questions?fromdate=1681084800&order=desc&tagged=starknet&site=stackoverflow`,
        };

        const res = await axios(config);
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log(err);
    }

}