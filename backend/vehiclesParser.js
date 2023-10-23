const csv = require('csv-parser')
const fs = require('fs')
const vehicles = {};

fs.createReadStream('vehicles.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (vehicles[data.make] === undefined) {
      vehicles[data.make] = []
    }
    vehicles[data.make].push(data.model)
    vehicles[data.make] = [...new Set(vehicles[data.make])];
  })
  .on('end', () => {
console.log(vehicles)
  });