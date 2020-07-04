addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const request = event.request
  const url = new URL(request.url)
  const paths = url.pathname.split('/')
  if (paths.length < 2) {
    return new Response('Unknown project id.')
  }
  const projectId = `token_${paths[1]}`.toUpperCase()
  if (!this || !this[projectId]) {
    return new Response('Unknown project id.')
  }
  const token = this[projectId]
  let cache = caches.default
  
  const time = Math.floor((new Date()).getTime() / (1000*10*60))
  const cacheUrl = new URL(request.url)
  cacheUrl.pathname = `/${paths[1]}/${time}`
  const cacheKey = new Request(cacheUrl.toString(), request)
  let response = await cache.match(cacheKey)
  if (!response) {
    const instagramUrl = `https://graph.instagram.com/me/media?fields=id,username,media_url,timestamp,media_type,thumbnail_url,caption,permalink&access_token=${token}&limit=100`
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
    await fetch(refreshUrl)
    const instagramData = await fetch(instagramUrl)
    const instagramJson = await instagramData.json()
    delete instagramJson.paging
    instagramJson.fetch_time = (new Date()).getTime()
    instagramJson.cache_key = cacheUrl.pathname
    response = new Response(JSON.stringify(instagramJson))
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Content-Type', 'application/json')
    event.waitUntil(cache.put(cacheKey, response.clone()))
  }
  return response
}