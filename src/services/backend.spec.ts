import axios from 'axios'

describe('optional backend availability', () => {
  beforeEach(() => vi.resetModules())

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('does not probe or synchronize with a backend in a static demo', async () => {
    vi.stubEnv('MODE', 'demo')
    const client = axios.create()
    const get = vi.spyOn(client, 'get').mockResolvedValue({ data: 'pong' })
    const put = vi.spyOn(client, 'put')
    const del = vi.spyOn(client, 'delete')
    vi.spyOn(axios, 'create').mockReturnValue(client)
    const { backend } = await import('./backend')

    expect(await backend.ping()).toBe(false)
    expect(backend.isUp).toBe(false)
    expect(await backend.getAll()).toBeNull()
    expect(await backend.get('demo')).toBeNull()
    expect(await backend.set('demo', 'value')).toBe(false)
    expect(await backend.del('demo')).toBe(false)
    expect(get).not.toHaveBeenCalled()
    expect(put).not.toHaveBeenCalled()
    expect(del).not.toHaveBeenCalled()
  })

  it('still detects an available backend in production', async () => {
    vi.stubEnv('MODE', 'production')
    const client = axios.create()
    const get = vi.spyOn(client, 'get').mockResolvedValue({ data: 'pong' })
    vi.spyOn(axios, 'create').mockReturnValue(client)
    const { backend } = await import('./backend')

    expect(await backend.ping()).toBe(true)
    expect(backend.isUp).toBe(true)
    expect(get).toHaveBeenCalledWith('/ping')
  })
})
