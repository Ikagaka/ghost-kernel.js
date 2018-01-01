# [ghost-kernel](https://github.com/Ikagaka/ghost-kernel.js)

[![npm](https://img.shields.io/npm/v/ghost-kernel.svg)](https://www.npmjs.com/package/ghost-kernel)
[![npm license](https://img.shields.io/npm/l/ghost-kernel.svg)](https://www.npmjs.com/package/ghost-kernel)
[![npm download total](https://img.shields.io/npm/dt/ghost-kernel.svg)](https://www.npmjs.com/package/ghost-kernel)
[![npm download by month](https://img.shields.io/npm/dm/ghost-kernel.svg)](https://www.npmjs.com/package/ghost-kernel)

[![Dependency Status](https://david-dm.org/Ikagaka/ghost-kernel.js.svg)](https://david-dm.org/Ikagaka/ghost-kernel.js)
[![devDependency Status](https://david-dm.org/Ikagaka/ghost-kernel.js/dev-status.svg)](https://david-dm.org/Ikagaka/ghost-kernel.js#info=devDependencies)
[![Travis Build Status](https://travis-ci.org/Ikagaka/ghost-kernel.js.svg)](https://travis-ci.org/Ikagaka/ghost-kernel.js)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/Ikagaka/ghost-kernel.js?svg=true)](https://ci.appveyor.com/project/Narazaka/ghost-kernel-js)
[![codecov.io](https://codecov.io/github/Ikagaka/ghost-kernel.js/coverage.svg?branch=master)](https://codecov.io/github/Ikagaka/ghost-kernel.js?branch=master)
[![Code Climate](https://codeclimate.com/github/Ikagaka/ghost-kernel.js/badges/gpa.svg)](https://codeclimate.com/github/Ikagaka/ghost-kernel.js)

イカガカの単一ゴーストに対するベースウェア処理を司るカーネル

## Install

```
npm install ghost-kernel
```

## Usage

node.js(ES2015):
```javascript
import {Ghostkernel} from 'ghost-kernel';
```

node.js(ES5):
```javascript
var ghostKernel = require('ghost-kernel');
var Ghostkernel = ghostKernel.Ghostkernel;
```

browser:
```html
<script src="ghost-kernel.js"></script>
var Ghostkernel = ghostKernel.Ghostkernel;
```

## 設計方針

伺かゴーストの動作は以下のように多くのイベント入力ソースを持ちます。

- ユーザーのシェルに対するマウス操作
- ユーザーのキーボード操作
- 時間経過
- 他ゴーストからのコミュニケート通信やSSTP通信
- OSの起動や終了・その他通知など

またそれらに対しての反応を返す色々な出力先を持ちます。

- SHIORIに情報を伝えたりトーク等を引き出す
- シェルを描画する
- インストール・アンインストールなどをする
- 他ゴーストやその他のものにコミュニケートやSSTP等の通信を送る
- OSの壁紙などを操作する

この入力と出力の様々な組み合わせでゴーストの機能が実現されています。

個別の機能ごとにこれら組み合わせの処理を独自に管理するととても収拾が付かないことになるため、
 [lazy-event-router](https://github.com/Narazaka/lazy-event-router.js) という「イベントルーター」を開発し、イベント駆動な設計となっています。

イベントルーターは「入力イベント」と、入力イベントを受け取り出力操作を行う「アクション」とを結びつける（「ルーティング」する）ものです。

入力イベントを発生させ、あるいは出力操作を受け付ける（イベント入力ソースあるいは出力先となる）外部のステートを持つオブジェクトを「コンポーネント」と呼びます。

「アクション」はステートレスな操作であり、アクションをまとめたものを「コントローラー」といいます。

任意のコンポーネントが発生させたイベントからアクションが実行され、そのアクションがまた任意のコンポーネントを操作するというループになります。

これは入力イベントのみを管理していてで出力操作はアクションの実装任せです。
出力操作までコントロールしていれば雰囲気cycle.jsを感じますが、ステートを持つ外部イベントと決定的に決別することはあまり便利でないと判断し、
中途半端があんばいが良いのではないかというところで落ち着いています。

構成としては

- index パッケージのエントリポイント
- GhostKernel 各処理をまとめるカーネルオブジェクト
- routings ルーティングまとめ
- components コンポーネント群
- controllers コントローラー群
- services コントローラーから使う一連の処理

となっています。

## API

[API Document](https://ikagaka.github.io/ghost-kernel.js/)

## License

This is released under [MIT License](https://narazaka.net/license/MIT?2016).
