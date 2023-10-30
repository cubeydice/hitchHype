import { ReactComponent as Coal } from '../../assets/icons/CarbonEmissions/mining-cart.svg'
import { ReactComponent as Home } from '../../assets/icons/CarbonEmissions/home.svg'
import { ReactComponent as Phone } from '../../assets/icons/CarbonEmissions/mobile-phone.svg'
import { ReactComponent as Recycling } from '../../assets/icons/CarbonEmissions/recycling.svg'
import { ReactComponent as Sapling } from '../../assets/icons/CarbonEmissions/sapling.svg'
import { miles } from '../RouteShow/RouteShow'

const CarbonEmissions = () => {
  //fuel economy per the 2022 EPA Automotive Trends Report
  //https://www.epa.gov/system/files/documents/2022-12/420s22001.pdf
  const avgMpg = 25.4
  const gallons = miles * (1/avgMpg);
  const metricTonsCO2 = gasolineEmissions(gallons);

  const equivalencies = (metricTonsCO2) => ({
    poundsCoal: coalBurned(metricTonsCO2),
    homesPowered: homesEnergyUse(metricTonsCO2),
    phonesCharged: smartPhonesCharged(metricTonsCO2),
    trashBags: trashBagsRecycled(metricTonsCO2),
    treesSaved: treeSeedlingsSaved(metricTonsCO2)
  })

  return (
    <>
      By hitching a ride on this trip, you will save an estimated {metricTonsCO2}
      metric tons of CO<sub>2</sub> emissions.

      This is the equivalent of
      <Coal/>{equivalencies.poundsCoal} coals burned
      <Home/>{equivalencies.homesPowered} homes powered
      <Phone/>{equivalencies.phonesCharged} phones charged

      You'll be saving the equivalent of
      <Recycling/>{equivalencies.trashBags} trash bags recycled instead of landfilled
      <Sapling/>{equivalencies.treesSaved} tree saplings grown over 10 years
    </>
  )
}

export default CarbonEmissions;

//metric tons CO2 per gallon of gasoline consumed
const gasolineEmissions = (gallons) => {
  const metricTonsCO2 = gallons * (8.887 * Math.pow(10, -3));
  return metricTonsCO2;
}

/* EQUIVALENT CO2 EMISSIONS */
//Driving by yourself
//equivalent pounds of coal burned
const coalBurned = (metricTonsCO2) => {
  const poundsCoal = metricTonsCO2 / (8.93 * Math.pow(10, -4));
  return poundsCoal;
}

//equivalent homes' electricity use for one year
const homesEnergyUse = (metricTonsCO2) => {
  const homes = metricTonsCO2 / 7.93;
  return homes;
}
//equivalent number of smartphones charged
const smartPhonesCharged = (metricTonsCO2) => {
  const phones = metricTonsCO2 / (8.22 * Math.pow(10, -6));
  return phones;
}

/*GREENHOUSE EMISSIONS SAVED*/
//By hitching a ride on this trip, you'd be saving the equivalent of
//trash bags of waste recycled instead of landfilled
const trashBagsRecycled = (metricTonsCO2) => {
  const trashBags = metricTonsCO2 / (2.31 * Math.pow(10, -2))
  return trashBags;
}

//carbon sequestered by tree seedlings grown for 10 years
const treeSeedlingsSaved = (metricTonsCO2) => {
  const seedlings = metricTonsCO2 / (0.060)
  return seedlings;
}