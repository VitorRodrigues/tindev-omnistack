const axios = require('axios');
const Dev = require('../model/Dev');
module.exports = {

    async store(req, res) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });
        if (userExists) {
            res.json(userExists);
            return;
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);
        const {name, bio, avatar_url: avatar } = response.data;
        

        const dev = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(dev);
    },
    async list(req, res) {
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);
        if (!loggedDev) {
            return res.status(400).json({ error: "You were not found" });
        }
        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } }, // ne = not equals
                { _id:  { $nin: loggedDev.likes } }, // nin = not in
                { _id:  { $nin: loggedDev.dislikes } }
            ]
        })
        return res.json(users);
    }
}