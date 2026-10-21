import axios, { AxiosInstance } from 'axios'

export class Github {
  private axios: AxiosInstance

  constructor() {
    this.axios = axios.create()
  }

  /**
   * Fetches the latest version from this fork's stable or nightly channel.
   */
  async getVersion(stable = true): Promise<string> {
    const release = stable ? 'latest' : 'tags/latest_nightly'
    const { data } = await this.axios.get(`https://api.github.com/repos/xchenya/VueTorrent/releases/${release}`)
    // The rolling tag stays fixed; the workflow puts the exact nightly version in its title.
    return stable ? data.tag_name : data.name
  }
}
