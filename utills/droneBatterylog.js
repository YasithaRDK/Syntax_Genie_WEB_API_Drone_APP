import Drone from "../models/drone.model.js";
import BatteryLog from "../models/batteryLog.model.js";

/**to check drones battery levels and create history */
//set checking interval
const BATTERY_CHECK_INTERVAL = 360000;

const checkBatteryLevelsAndLog = async () => {
  try {
    //get all drones
    const drones = await Drone.find();

    //check drone details separately
    for (const drone of drones) {
      if (drone.batteryCapacity < 25) {
        const batteryLog = new BatteryLog({
          drone_id: drone._id,
          eventType: "BATTERY_LOW",
          description: `Battery level low for drone with serial number ${drone.serialNumber}.`,
        });
        await batteryLog.save();
      }
    }
    console.log("Battery levels checked and logged successfully.");
  } catch (error) {
    console.error("Error while checking battery levels:", error);
  }
};

// Start the periodic task
const startBatteryCheckInterval = () => {
  console.log("Starting battery check interval...");
  setInterval(checkBatteryLevelsAndLog, BATTERY_CHECK_INTERVAL);
};

export default startBatteryCheckInterval;
