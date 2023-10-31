const apiKey = process.env.REACT_APP_GAS_API_KEY;
const apiUrl = process.env.REACT_APP_GAS_API_URL;

const GasPrices = (longitude, latitude) => {
  var options = {
    method: "GET",
    hostname: "api.collectapi.com",
    port: null,
    path: `/gasPrice/fromCoordinates?lng=${longitude}&lat=${latitude}`,
    headers: {
      "content-type": "application/json",
      "authorization": `${apiKey}`
    }
  };

  let url = `${apiUrl}lng=${longitude}&lat=${latitude}`

  const fetchGasPrice = async (url) => {
    const res = await fetch(url)
    return res.json();
  }

  return (fetchGasPrice(url).then(res => console.log(res.result.gasoline)))
}

export default GasPrices;