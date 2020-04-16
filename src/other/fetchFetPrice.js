const BINANCE_API = "https://api.binance.com/api/v3/ticker/24hr?symbol=FETUSDT";

export class RateLimitError extends Error {}

export const fetchFetPrice = async () => {

  let error = false;
  const response = await fetch(BINANCE_API).catch(() => error = true)

    if (error) throw new Error()
    if(response.status === 429)  throw new RateLimitError()
    if (typeof response === 'undefined' || 200 < response.status || response.status > 300) throw new Error()
    const json = await response.json().catch(() => error = true)
    if (error || typeof json.symbol === 'undefined') throw new Error()
    return {
      lastPrice: json.lastPrice,
      lowPrice:  json.lowPrice,
      highPrice: json.highPrice
    }
}


export const toDisplayString = (s) =>
{
  // if its greater than 50 cents we show in dollars ($)
  if(parseFloat(s) > .5)
  return parseFloat(s)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  else {
    // strip trainling zeros
    s = s.replace(/0+$/, '');
    return (parseFloat(s)*100).toString() + "c";
  }
}