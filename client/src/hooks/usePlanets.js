import { useCallback, useEffect, useState } from 'react';

import { httpGetPlanets } from './requests';

function usePlanets() {
  const [planets, savePlanets] = useState([]);

  const getPlanets = useCallback(async () => {
    const fetchedPlanets = await httpGetPlanets();

    savePlanets(fetchedPlanets);
  }, []);

  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  // planets.map((planet, i) => {
  //   console.log(planet + i);
  // newPlanets['keplerName'] = planet['kepler_name'];
  // return newPlanets;
  // });

  // console.log(newPlanets);

  return planets;
}

export default usePlanets;
