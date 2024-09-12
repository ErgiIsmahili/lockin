const Group = require("../model/Group");
const User = require("../model/User");

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Assuming you're using an authentication middleware

  try {
    const group = new Group({ name, members: [userId] });
    await group.save();

    const user = await User.findById(userId);
    user.groups.push(group._id);
    await user.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Group creation failed" });
  }
};

exports.addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (group && user) {
      group.members.push(userId);
      await group.save();

      user.groups.push(groupId);
      await user.save();

      res.status(200).json({ message: "User added to group" });
    } else {
      res.status(404).json({ message: "Group or user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding user to group" });
  }
};