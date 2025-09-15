const DEFAULT_GATEWAY = 'https://ipfs.io/ipfs/'

export function resolveIpfsUrl(url: string | undefined, gateway: string = DEFAULT_GATEWAY): string | undefined {
  // If no URL, return the URL
  if (!url) return url
  // If the URL starts with http://, https://, or data:, return the URL
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url

  // If the URL starts with ipfs://
  if (url.startsWith('ipfs://')) {
    // Support formats like ipfs://<cid>/<path> or ipfs://ipfs/<cid>/<path>
    const withoutScheme = url.replace('ipfs://', '') // remove ipfs://
    const parts = withoutScheme.split('/') // split by '/'
    const cid = parts[0] === 'ipfs' ? parts[1] : parts[0] // get the CID
    const rest = parts[0] === 'ipfs' ? parts.slice(2).join('/') : parts.slice(1).join('/') // get the rest of the path
    return `${gateway}${cid}${rest ? `/${rest}` : ''}` // construct the URL
  }

  // Return the URL
  return url
}


