const csv = require('csv-parser')
const fs = require('fs')

//parses through vehicles CSV
const vehiclesParser = (file) => {
  let mpg = {};
  let vehicles = {};
  return new Promise((resolve, reject) => {
  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => {
      if (vehicles[data.make] === undefined) {
        vehicles[data.make] = {};
      }
      vehicles[data.make][data.model] =
      {...vehicles[data.make][data.model], [data.year]: data.comb08}

      if (vehicles[data.make][data.model] !== undefined) {
        mpg[data.id] = data.comb08
      }
    })
    .on('end', () => {
      resolve([vehicles, mpg]);
  });
})
}

async function getVehicles() {
  try {
      const data = await vehiclesParser('vehicles.csv', {});
      let vehiclesObj = {
        vehicles: data[0],
        mpg: data[1]
      }
      return vehiclesObj;
  } catch (error) {
      console.error("getVehicles: An error occurred: ", error.message);
  }
}

module.exports = getVehicles;
