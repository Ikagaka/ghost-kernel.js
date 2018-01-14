/** 交代時情報 */
export interface ChangeTransactionInfo {
  /** ID */
  id: string;
  /** 交代時スクリプト */
  script: string;
  /** ゴースト名 */
  name: string;
  /** さくら側名 */
  sakuraName: string;
  /** 交代時シェル名 */
  shellName: string;
  /** ゴーストディレクトリパス */
  path: string;
}
