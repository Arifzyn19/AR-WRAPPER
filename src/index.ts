import axios from "axios";
import { BASE_URL } from "./Configs";
import { Feature } from "./Types";
import { API } from "./API";

export class ArifzynAPI {
  private api: API;
  private featuresByCategory: Record<string, Feature[]> = {}; // Organize features by category

  constructor(apikey: string) {
    this.api = new API(BASE_URL, { apikey });
  }

  private async initializeFeatures() {
    try {
      const response = await axios.get(`${BASE_URL}/endpoint`); // Adjust the endpoint as necessary
      const featureList: Feature[] = response.data.result;

      featureList.forEach((feature) => {
        const category = feature.category;

        if (!this.featuresByCategory[category]) {
          this.featuresByCategory[category] = [];
        }

        this.featuresByCategory[category].push(feature);
      });
    } catch (error) {
      console.error("Failed to initialize features:", error);
    }
  }

  public async call(path: string, params: Record<string, any> = {}) {
    await this.initializeFeatures();

    const feature = Object.values(this.featuresByCategory)
      .flat()
      .find((f: Feature) => f.path === path);

    if (!feature) {
      throw new Error(`Feature with path ${path} does not exist.`);
    }

    return this.request(feature, params);
  }

  private async request(feature: Feature, params: Record<string, any>) {
    const { method } = feature;

    if (method.toLowerCase() === "get") {
      return this.api.get(feature.path, params);
    } else if (method.toLowerCase() === "post") {
      return this.api.post(feature.path, params);
    } else {
      throw new Error(`Unsupported method: ${method}`);
    }
  }

  public async list(category: string) {
    await this.initializeFeatures();

    return this.featuresByCategory[category] || [];
  }
}
