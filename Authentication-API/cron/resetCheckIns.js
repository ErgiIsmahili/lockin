const cron = require('node-cron');
const Group = require('../model/Group');

const resetDailyCheckIns = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
  
      const groups = await Group.find({});
  
      await Promise.all(groups.map(async (group) => {
        const allCheckedIn = group.checkIns.every((checkIn) => {
          const checkInDate = checkIn.date instanceof Date ? checkIn.date.toISOString() : checkIn.date;
          return checkInDate.split('T')[0] === today && checkIn.confirmed;
        });
  
        if (allCheckedIn) {
          group.streak += 1;
          console.log(`Streak incremented for group ${group._id}`);
        } else {
          console.log(`Not all members checked in for group ${group._id}`);
        }
  
        group.checkIns.forEach((checkIn) => {
          checkIn.confirmed = false;
        });
  
        await group.save();
      }));
  
      console.log('Daily check-in reset completed');
    } catch (error) {
      console.error('Error resetting daily check-ins:', error);
    }
  };  

const scheduleDailyReset = () => {
    cron.schedule('0 0 * * *', () => {
      console.log('Running scheduled job at midnight');
      resetDailyCheckIns();
    });
  };
  
  module.exports = {
    scheduleDailyReset,
    resetDailyCheckIns
  };