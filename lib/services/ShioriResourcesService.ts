import { Shiorif } from "shiorif";
import { ShioriResources, SiteMenu, Sites } from "../components/ShioriResources";

export class ShioriResourcesService {
  private shiorif: Shiorif;
  private shioriResources: ShioriResources;

  constructor(shiorif: Shiorif, shioriResources: ShioriResources) {
    this.shiorif = shiorif;
    this.shioriResources = shioriResources;
  }

  async getUsername() {
    this.shioriResources.username = (await this.shiorif.request3("GET", "username")).response.to("3.0").headers.Value;
  }

  async getSites(
    type: "sakura.recommendsites" | "sakura.portalsites" | "kero.recommendsites",
  ) {
    let sites: Sites;
    switch (type) {
      case "sakura.recommendsites": sites = this.shioriResources.sakura.recommendsites; break;
      case "sakura.portalsites": sites = this.shioriResources.sakura.portalsites; break;
      default: sites = this.shioriResources.kero.recommendsites;
    }
    sites.length = 0; // clear
    for (const site of (await this.shiorif.get3(type)).response.headers.ValueSeparated2()) {
      // tslint:disable-next-line no-magic-numbers
      sites.push(new SiteMenu(site[0], site[1], site[2], site[3]));
    }
  }
}
