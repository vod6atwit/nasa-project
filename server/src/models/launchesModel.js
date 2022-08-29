const axios = require('axios');
const launchesDatabase = require('./launchesMongo');
const planets = require('./planetsMongo');

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();
// let latestFlightNumber = 100;

// const launch = {
//   flightNumber: 100, // existing at flight_number
//   mission: 'Kepler Exploration X', // existing at name
//   rocket: 'Explorer IS1', // existing at rocket.name
//   launchDate: new Date('December 27, 2030'), // existing at date_local
//   target: 'Kepler-442 b', // not applicable
//   customers: ['ZTM', 'NASA'], // existing at payload.customers for each payload
//   upcoming: true, // existing at upcoming
//   success: true, // existing at success
// };

// saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;

  launchDocs.forEach(async launchDoc => {
    const payloads = launchDoc['payloads'];
    // flatmap used to flat multiple arrays into a single array
    const customers = payloads.flatMap(payload => {
      // multiple list of customers flat into a single list of customers
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    // save the launch
    await saveLaunch(launch);
  });
}

async function loadLaunchData() {
  try {
    const firstLaunce = await findLaunch({
      flightNumber: 1,
      rocket: 'Falcon 1',
      mission: 'FalconSat',
    });
    if (firstLaunce) {
      console.log('Launch Data already loaded!');
    } else {
      await populateLaunches();
    }
  } catch (err) {
    console.error(`🚨 ${err}`);
  }
}

async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await launchesDatabase.findOneAndUpdate(
    {
      // validate if the launch is already exist or not by using flightNumber
      flightNumber: launch.flightNumber,
    },
    // update if it is not exist
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduledNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching was found');
  }

  const newFlightNumber = (await getLastestFlightNumeber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    // flightNumber: latestFlightNumber,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

async function getLastestFlightNumeber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    // sort launch based on flightNumber descending order (highest to lowest)
    .sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

module.exports = {
  getAllLaunches,
  // addNewLaunch,
  scheduledNewLaunch,
  loadLaunchData,
  existsLaunchWithId,
  abortLaunchById,
};
