export class ShioriResources {
  /** ユーザー名 */
  username?: string;

  /** さくら側 */
  sakura: {
    /** おすすめサイト */
    recommendsites: Sites,
    /** ポータルサイト */
    portalsites: Sites,
  } = {
    recommendsites: new Sites(),
    portalsites: new Sites(),
  };

  /** うにゅう側 */
  kero: {
    /** おすすめサイト */
    recommendsites: Sites,
  } = {
    recommendsites: new Sites(),
  };

  /** さくら側おすすめサイト */
  get ["sakura.recommendsites"]() { return this.sakura.recommendsites; }

  /** さくら側ポータルサイト */
  get ["sakura.portalsites"]() { return this.sakura.portalsites; }

  /** うにゅう側おすすめサイト */
  get ["kero.recommendsites"]() { return this.kero.recommendsites; }
}

/** サイトリスト */
export class Sites extends Array<SiteMenu> {
}

/** サイト情報 */
export class SiteMenu {
  private _name: string;
  private _url: string;
  private _banner: string;
  private _script: string;

  /**
   * @param name 項目名
   * @param url URL
   * @param banner バナー画像パス
   * @param script 選択時トークスクリプト
   */
  constructor(name: string, url: string, banner: string, script: string) {
    this._name = name;
    this._url = url;
    this._banner = banner;
    this._script = script;
  }

  /** 項目名 */
  get name() { return this._name; }

  /** URL */
  get url() { return this._url; }

  /** バナー画像パス */
  get banner() { return this._banner; }

  /** 選択時トークスクリプト */
  get script() { return this._script; }
}
