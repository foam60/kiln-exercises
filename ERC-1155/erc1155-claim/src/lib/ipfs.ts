const DEFAULT_GATEWAY = 'https://ipfs.io/ipfs/'

export function resolveIpfsUrl(url: string | undefined, gateway: string = DEFAULT_GATEWAY): string | undefined {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url

  if (url.startsWith('ipfs://')) {
    // Support formats like ipfs://<cid>/<path> or ipfs://ipfs/<cid>/<path>
    const withoutScheme = url.replace('ipfs://', '')
    const parts = withoutScheme.split('/')
    const cid = parts[0] === 'ipfs' ? parts[1] : parts[0]
    const rest = parts[0] === 'ipfs' ? parts.slice(2).join('/') : parts.slice(1).join('/')
    return `${gateway}${cid}${rest ? `/${rest}` : ''}`
  }

  return url
}


