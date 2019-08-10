const Dev = require('../model/Dev');

module.exports = {
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;
        
        if (devId == user) {
            return res.status(400).json({  error: "Can't like yourself, you egocentric!" });
        }

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({  error: "Dev does not exist" });
        }

        if (targetDev.likes.includes(loggedDev._id)) {
            console.log("It's a match!")
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);
    }
}