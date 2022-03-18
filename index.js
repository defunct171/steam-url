const qs = require('querystring')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))
const chalk = require('chalk')

const Status = {
	SUCCESS: 1,
	NO_MATCH: 42
}

const checked = []

const randomChars = (length = 3) => {
  let result = ''
  const chars = 'abcdefghijklmnopqrstuvwxyz-_1234567890'

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  if (!checked.includes(result)) {
    checked.push(result)
  } else if (Math.pow(chars.length, length) !== checked.length) {
    result = randomChars()
  } else {
    // Send available for Discord
    process.exit(1)
  }

  return result
}

setTimeout(async function nested() {
  let chars = randomChars()

  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1?${qs.stringify(
        { key: process.env.STEAM_API_KEY, vanityurl: chars }
      )}`
    )
		const { response: data } = await (
			response.ok
				? response.json()
				: Promise.reject(response.statusText)
			)

		switch (data.success) {
			case Status.SUCCESS:
				console.log(`${checked.length} :: ${chalk.black.bgWhite(chars)} used by ${chalk.bgRed(data.steamid)}`)
				break
			case Status.NO_MATCH:
				console.log(`${checked.length} :: ${chalk.bgGreen(chars)} ${chalk.green('is available!')}`)
				break
			default:
				throw new Error(data.message)
			}
  } catch (error) {
		console.error(error.message)
  }

  setTimeout(nested, 3 * 1e3)
}, 1e3)