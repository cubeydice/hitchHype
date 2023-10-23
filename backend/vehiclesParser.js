const csv = require('csv-parser')
const fs = require('fs')
const vehicles = {};

fs.createReadStream('vehicles.csv')
  .pipe(csv())
  .on('data', (data) => {
    vehicles[data.make] = {...vehicles[data.make], [data.model]: []}

    if (vehicles[data.make][data.model] !== undefined) {
      vehicles[data.make][data.model].push(data.year);
    }
  })
  .on('end', () => {
    console.log(vehicles)
  });