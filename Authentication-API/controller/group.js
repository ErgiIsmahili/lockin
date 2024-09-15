const Group = require("../model/Group");
const User = require("../model/User");

exports.createGroup = async (req, res) => {
  const { name, image, frequency, howManyDaysPerWeek, weeksPerMonth } = req.body;
  const userId = req.user.id;

  try {
    if (!name || !frequency) {
      return res.status(400).json({ message: "Name and frequency are required" });
    }

    const group = new Group({
      name,
      image,
      frequency,
      howManyDaysPerWeek,
      weeksPerMonth,
      members: [userId],
      checkIns: [
        {
          user: userId,
          date: new Date(),
          confirmed: false,
        },
      ],
    });

    await group.save();

    const user = await User.findById(userId);
    user.groups.push(group._id);
    await user.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Group creation failed", error: error.message });
  }
};


exports.addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    const user = await User.findById(userId);

    if (group && user) {
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        group.checkIns.push({
          user: userId,
          date: new Date(),
          confirmed: false,
        });
        await group.save();
      }

      if (!user.groups.includes(groupId)) {
        user.groups.push(groupId);
        await user.save();
      }

      res.status(200).json({ message: "User added to group" });
    } else {
      res.status(404).json({ message: "Group or user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding user to group", error: error.message });
  }
};

exports.checkIn = async (req, res) => {
  const { id: groupId } = req.params;
  const userId = req.user.id;
  const today = new Date().setHours(0, 0, 0, 0);

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const checkInIndex = group.checkIns.findIndex(
      (checkIn) =>
        checkIn.user.toString() === userId &&
        new Date(checkIn.date).setHours(0, 0, 0, 0) === today
    );

    if (checkInIndex !== -1) {
      group.checkIns[checkInIndex].confirmed = true;
    } else {
      group.checkIns.push({
        user: userId,
        date: new Date(),
        confirmed: true,
      });
    }

    await group.save();

    res.status(200).json({ message: "Check-in confirmed" });
  } catch (error) {
    res.status(500).json({ message: "Error confirming check-in", error: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id)
      .populate('members', 'username')
      .populate('checkIns.user', 'username')
      .exec();

    if (group) {
      res.status(200).json(group);
    } else {
      res.status(404).json({ message: "Group not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching group", error: error.message });
  }
};
