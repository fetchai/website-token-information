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
  return parseFloat(s)
    .toLocaleString('en-US', {
      maximumFractionDigits: '5',
      style: 'currency',
      currency: 'USD',
    });
}