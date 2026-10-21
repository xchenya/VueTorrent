import axios from 'axios'
import { Github } from './Github'

describe('fork release channels', () => {
  afterEach(() => vi.restoreAllMocks())

  it('checks stable versions in this fork', async () => {
    const client = axios.create()
    const get = vi.spyOn(client, 'get').mockResolvedValue({ data: { tag_name: 'v2.36.1', name: 'Stable release' } })
    vi.spyOn(axios, 'create').mockReturnValue(client)

    expect(await new Github().getVersion()).toBe('v2.36.1')
    expect(get).toHaveBeenCalledWith('https://api.github.com/repos/xchenya/VueTorrent/releases/latest')
  })

  it('checks the exact nightly version instead of comparing against the rolling tag', async () => {
    const client = axios.create()
    const get = vi.spyOn(client, 'get').mockResolvedValue({ data: { tag_name: 'latest_nightly', name: 'v2.36.1-12-g1234abcd' } })
    vi.spyOn(axios, 'create').mockReturnValue(client)

    expect(await new Github().getVersion(false)).toBe('v2.36.1-12-g1234abcd')
    expect(get).toHaveBeenCalledWith('https://api.github.com/repos/xchenya/VueTorrent/releases/tags/latest_nightly')
  })
})
