exports.get_stack_questions = async (last_10_minutes) => {
    try {
        const axios = require('axios');
        //Get last 10 minutes time boundaries
        const now = new Date();
        const now_time = now.getTime();
        const from = new Date(now.getTime() - 10 * 60000);
        const from_time = from.getTime();

        //sort=votes&min=10&fromdate=1293840000&todate=1294444800

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.stackexchange.com/2.3/questions?site=stackoverflow&tagged=starknet`, //&fromdate=${from_time}&todate=${now_time}`,
        };

        const res = await axios(config);
        return res.data;
    } catch (err) {
        console.log(err);
    }

}