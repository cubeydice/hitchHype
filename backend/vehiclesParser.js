const csv = require('csv-parser')
const fs = require('fs')
const vehicles = {};
const mpg = {};

fs.createReadStream('vehicles.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (vehicles[data.make] === undefined) {
      vehicles[data.make] = {};
      vehicles[data.make] = {...vehicles[data.make], [data.model]: {}}
      vehicles[data.make][data.model] =
        {...vehicles[data.make][data.model], [data.year]: 0}
    }

    if (vehicles[data.make][data.model] !== undefined) {
      // vehicles[data.make][data.model].push(data.year);
      vehicles[data.make][data.model][data.year] = data.id;
      mpg[data.id] = data.comb08
    }
  })
  .on('end', () => {
    console.log(vehicles)
  });