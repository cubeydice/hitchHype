import { ReactComponent as Coal } from '../../assets/icons/CarbonEmissions/mining-cart.svg'
import { ReactComponent as Home } from '../../assets/icons/CarbonEmissions/home.svg'
import { ReactComponent as Phone } from '../../assets/icons/CarbonEmissions/mobile-phone.svg'
import { ReactComponent as Recycling } from '../../assets/icons/CarbonEmissions/recycling.svg'
import { ReactComponent as Sapling } from '../../assets/icons/CarbonEmissions/sapling.svg'
import './CarbonEmissions.css'

const CarbonEmissions = ({trip, driver}) => {
  const distance = trip.distance
  //fuel economy per the 2022 EPA Automotive Trends Report
  //https://www.epa.gov/system/files/documents/2022-12/420s22001.pdf
  const avgMpg = 25.4
  const gallons = distance * (1/avgMpg);
  const metricTonsCO2 = gasolineEmissions(gallons).toFixed(3);

  const equivalenciesFn = (metricTonsCO2) => ({
    poundsCoal: coalBurned(metricTonsCO2).toFixed(3),
    homesPowered: homesEnergyUse(metricTonsCO2).toFixed(3),
    phonesCharged: smartPhonesCharged(metricTonsCO2).toFixed(3),
    trashBags: trashBagsRecycled(metricTonsCO2).toFixed(3),
    treesSaved: treeSeedlingsSaved(metricTonsCO2).toFixed(3)
  })

  const equivalencies = equivalenciesFn(metricTonsCO2)
  console.log(distance)

  const ceInfo = () => {
    if (!driver) {
      return (
        <>
          By hitching a ride on this trip, you can save an estimated total of <span>{metricTonsCO2} metric tons</span> of CO<sub id="co2-sub">2</sub> emissions.
        </>
      )
    } else {
      return (
      <>
        By hosting this trip, you can save up to estimated total of <span>{(metricTonsCO2 * trip.passengers.length).toFixed(3)} metric tons</span> of CO<sub id="co2-sub">2</sub> emissions.
      </>
      )
    }
  }

  return (
    <div className='ce-container'>
      <h2>your impact 🌱</h2>
      <p>
        {ceInfo()}
      </p>

      <div>
      This is the equivalent of
        <ul>
          <li>
            <Coal className='medium-icon'/> {equivalencies.poundsCoal} coals burned
          </li>
          <li>
            <Home className='medium-icon'/> {equivalencies.homesPowered} homes powered
          </li>
          <li>
            <Phone className='medium-icon'/> {equivalencies.phonesCharged} phones charged
          </li>
        </ul>
      </div>

      <div>
        You'll be saving the equivalent of
        <ul>
          <li>
            <Recycling className='medium-icon'/> {equivalencies.trashBags} trash bags recycled
          </li>
          <li>
            <Sapling className='medium-icon'/> {equivalencies.treesSaved} tree saplings grown
          </li>
        </ul>
      </div>
      <p>Thank you for making a change!</p>
      <div id='ce-credit'><sub>Calcultions are per the United States Environmental Protection Agency, 2023</sub></div>
    </div>
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