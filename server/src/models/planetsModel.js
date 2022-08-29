const path = require('path');
const fs = require('fs'); // only this module cannot read csv files
const { parse } = require('csv-parse'); // read csv file

const planets = require('./planetsMongo');

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    // koi_insol: Insolation Flux [Earth flux]
    // suggests from Exoplanet Project that an S9eff) value if about 0.36 for a Sun-Like start with coller starts hanving slightly lower values
    // lower limit value koi_insol
    planet['koi_insol'] > 0.36 &&
    // for an Earth-size planet orbiting a Sun-like start, this limit corresponds to an S(eff) of about 1.11
    // upper limit value koi_insol
    planet['koi_insol'] < 1.11 &&
    //koi_prad: Planetary Radius [Earth radii]
    // upper limit value koi_prad
    planet['koi_prad'] < 1.6
  );
}

/*
const promise = new Promise((resolve, reject) => {
  resolve()
}
promise.then((result) => {});

const result = await promise;
*/

// chainning event handlers
function loadPlanetsData() {
  return new Promise((resolve, rejects) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        // readable.pipe(writable)
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async data => {
        if (isHabitablePlanet(data)) {
          // habitablePlanets.push(data);

          savePlanet(data);
        }
      })
      .on('error', err => {
        console.log(err);
        rejects(err);
      })
      .on('end', async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  // return habitablePlanets;
  return await planets.find(
    {},
    {
      // projection allow to select specific fields
      // exclude _id and _v
      _id: 0,
      __v: 0,
    }
  );
}

async function savePlanet(planet) {
  try {
    // insert + update = upsert
    // Only update/added if this planet doesn't already exist
    await planets.updateOne(
      {
        // insert if it doesn't exist
        keplerName: planet.kepler_name,
      },
      {
        // update if it doesn already exist or insert if it doesn't exist
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`🚨 Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
