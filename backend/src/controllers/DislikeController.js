const Dev = require('../model/Dev');

module.exports = {
    async store(req, res) {
        const { devId } = req.params;
        const { user } = req.headers;
        
        if (devId == user) {
            return res.status(400).json({  error: "Do not dislike yourself, you're awesome!" });
        }

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if (!targetDev) {
            return res.status(400).json({  error: "Dev does not exist" });
        }
        
        if (!loggedDev.dislikes.includes(targetDev._id)) {
            loggedDev.dislikes.push(targetDev._id);
            await loggedDev.save();
        }

        return res.json(loggedDev);
    }
}