# NODE ES6 + webpack 적용기

일반 노드로 생성된 프로젝트에 es6 를 적용해보자

나는

```javascript
const var = require('module...');

// to

import var from 'module';
```

난 이게 하고싶었는데 babel 도 7버전이 나와있고, webpack 자료도 거의 webpack 3 버전 밖에 자료를 찾을 수 없어서 정리했다.

개발환경

- node -v v10.14.2
- npm -v 6.4.1

## step1. 프로젝트 생성하기

적당한 폴더를 생성하고 찾아 프로젝트를 생성하자

```cli
$ mkdir babel-test
$ cd babel-test
$ npm init -y
```

> -y 옵션은 이후에 나오는 모든 질문들을 yes 로 처리한다는 옵션이다

## setp2. 기본적인 프로젝트 구성하기

프로젝트 루트 경로에 기본적으로 실행 할 프로젝트를 만들자

```
$ index.js
```

```javascript
// /index.js
class Home {
  init() {
    console.log("hello world!");
  }
}

const home = new Home();

home.init();
```

그 다음 파일을 실행 해보자

```
$ node index.js
hello world!
```

## step3. 다른 모듈 import 하기

```javascript
// /index.js
const path = require("path"); // #

class Home {
  init() {
    console.log("hello world!");
  }
}

const home = new Home();

home.init();
```

이제 다시 실행 해보자

```
$ node index.js
hello world!
```

일단 잘 된다. 이제 import 를 사용해서 불러 와 보자

```javascript
// /index.js
import path from "path";

class Home {
  init() {
    console.log("hello world!");
  }
}

const home = new Home();

home.init();
```

이제 다시 실행 해보자

```
$ node index.js
(function (exports, require, module, __filename, __dirname) { import path from "path";
                                                                     ^^^^

SyntaxError: Unexpected identifier
    at new Script (vm.js:79:7)
    at createScript (vm.js:251:10)
    at Object.runInThisContext (vm.js:303:10)
    at Module._compile (internal/modules/cjs/loader.js:657:28)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:282:19)
```

위와 같이 나오면 정상이다.

## step.4 babel 설치하기

es6 의 import 시스템을 이용하기 위해 디펜던시를 설치하자

```
$ npm install -g npx
$ npm install -D @babel/cli @babel/core
```

> npx 모듈은 devDependencies 의 있는 모듈을 글로벌로 설치하지 않더라도 사용 할 수 있도록 해준다

> @babel/cli 과 @babel/core 는 babel 을 cli 로 사용 할 수 있도록 해준다.

이제 babel 로 파일을 트랜스파일링 해보자

```
$ npx babel index.js
import path from "path";

class Home {
  init() {
    console.log("hello world!");
  }

}

const home = new Home();
home.init();
```

일단 잘 나온다. 근데 달라진 건 없다. 어떻게 트랜스파일링 할 껀지 지정 해 주지 않았기 때문이다.

그럼 여기서 @babel/preset-env 라는 플러그인을 사용해서 트랜스 파일링 해보자

## step.5 babel 프리셋 설정하기

디펜던시를 추가하자

```
$ npm install -D @babel/preset-env
```

프리셋을 설치했으니, 이제 커맨드라인에서 --preset 옵션으로 설정 할 수가 있다.

```
$ npx babel --presets @babel/env index.js
"use strict";

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Home =
/*#__PURE__*/
function () {
  function Home() {
    _classCallCheck(this, Home);
  }

  _createClass(Home, [{
    key: "init",
    value: function init() {
      console.log("hello world!");
    }
  }]);

  return Home;
}();

var home = new Home();
home.init();
```

정상적으로 트랜드파일링 된 것을 확인 할 수 있다. 이것을 실행 하려면 커맨드라인에서 `|` 파이프라인을 주어서 node 로 실행하면 된다.

```
$ npx babel --presets @babel/env index.js | node
hello world!
```

## step6. npm 스크립트 설정 설정

매번 커맨드라인에서 실행 하기가 번거롭다. 스크립트를 등록해서 사용하면된다.

package.json 에서 scripts 항목을 찾아 수정하자

```json
...
"scripts": {
    "start": "npx babel --presets @babel/env index.js | node"
  },
...

```

이렇게 등록하면 커맨드라인으로 간편하게 다음과 같이 불러 올 수 있다.

```
$ npm start
> babel-test@1.0.0 start C:\workspace\babel-test
> npx babel --presets @babel/env index.js | node

hello world!
```

그래도 커맨드 라인이 좀 거슬린다 --presets 항목을 제거 하고싶다.

그럼 프로젝트 루트 에 `.babelrc` 파일을 생성하고 preset 항목을 지정 해 주자.

```json
// /.babelrc
{
  "presets": ["@babel/preset-env"]
}
```

package.json 에서 커맨드라인에 --presets 를 제거하자

```json
...
"scripts": {
    "start": "npx babel index.js | node"
  },
...

```

이제 커맨드 라인으로 실행 해보자

```
$ npm start
> babel-test@1.0.0 start C:\workspace\babel-test
> npx babel index.js | node

hello world!
```

# step6-1 아웃풋 파일 지정하기

babel 을 매번 트랜스파일링 할 수는 없다. 그렇기 때문에 우리는 아웃풋으로 나온 데이터를 어딘가 저장하고, 그 파일을 실행해야 한다.

커맨드라인에 다음과 같이 실행 해보자

```
$ npx babel index.js --out-dir dist
```

그럼 dist 폴더에 (없으면 생성된다.) 트랜스 파일링 된 파일이 있다. 그 파일을 실행 하면 된다.

```
$ node dist/index.js
hello world!
```

이 과정을 스크립트로 등록하자

package.json 의 scripts 로 이전과 같이 등록 하면 된다.

```json
...
"scripts": {
    "dev": "npx babel index.js | node",
    "build": "npx babel index.js --out-dir dist",
    "start": "node dist/index.js"
  },
...
```

이제 build 를 실행 해보자 성공적으로 실행 된 것을 볼 수 있을것이다.

```
$ npm run build
```

> package.json 의 start 는 web 으로 따지면 index.html 같은 것이다. 그래서 run 옵션을 주지 않아도 되지만, build 는 run 옵션을 주고 실행 하여야 한다.

## step7. webpack 으로 컴파일 준비하기 (건너 뛰어도 됨)

이제 여기에 webpack 을 끼얹여 보자

일단 webpack 관련 디펜던시를 등록한다.

```
$ npm install -D webpack webpack-cli babel-loader
```

그런 다음 webpack.config.js 파일을 생성하고 설정을 준비하면 된다.

```javascript
// webpack.config.js
const webpack = require("webpack");
const path = require("path");

module.exports = {
  // 시작점이 될 엔트리 파일
  entry: "./index.js",
  // webpack 으로 번들링 후 아웃풋으로 나올 파일 설정
  output: {
    // 경로
    path: path.resolve(__dirname, "dist"),
    filename: "start.js"
  },
  // 설정 옵션들을 등록한다.
  module: {
    rules: [
      {
        // js 로 끝나는 파일들을 트랜스파일링 한다.
        test: /\.js$/,
        // 적용 시킬 path
        include: path.join(__dirname),
        // node_modules 폴더는 번들링에서 제외시킨다.
        exclude: /node_modules/,
        // 사용 할 플러그인
        use: {
          // babel loader 를 통해서 트랜스파일링 한다.
          loader: "babel-loader",
          options: {
            // preset 을 등록한다.
            preset: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
```

이제 webpack-dev-server 를 통해서 실행시켜보자.

```
$ npx webpack --config webpack.config.js
```

> 위 명령어만 실행 하면 _npx webpack --config webpack.config.js_ 과 동일한 기능을 한다. 프로젝트 루트 경로에 webpack.config.js 를 찾아서 실행한다.

## 부록 간단한 웹 서버 만들기

koaJS 를 사용한 간단한 웹서버를 지금까지 해본 babel 을 참고하여 es6 형식으로 작성 해보겠다.

먼저 koajs 디펜던시를 추가한다.

```
$ npm install --save koa
$ npm install --save-dev @babel/node nodemon
```

> `@babel/node` 는 커맨드라인에서 babel-node 형식으로 사용 할 수 있도록 한다.

> `nodemon` 은 실시간으로 파일 변경이 생기면 자동 실행하도록 해준다.

그 다음 src 폴더를 만들고 index.js 를 이동시키자.

```
$ mkdir src
$ mv index.js src/
```

koa 서버를 돌릴 수 있는 서버를 작성하자.

```javascript
// src/index.js
import Koa from "koa";

const app = new Koa();
const PORT = process.env.PORT || 3001;

app.use(ctx => (ctx.body = "hello world"));

app.listen(PORT, () => console.log(`Server Running At PORT: ${PORT}`));
```

마지막으로 서버를 돌릴 수 있는 스크립트를 작성하면 되겠다.

```json
"scripts": {
    "start": "node dist/index.js",
    "build": "npx babel src --out-dir dist",
    "dev": "npx nodemon --exec babel-node index.js"
  },
```

`npm run dev` 는 babel 을 통하여 빌드 된 dist/index.js 를 실행한다.

`npm run build` 바벨을 이용하여 빌드한다.

`npm run dev` nodemon 을 이용하여 개발 할 수 있도록 해준다.

이제 다음과 같이 실행하면 웹 서버가 실행 되는 걸 볼 수 있다.

_개발시_

```
$ npm run dev
```

_배포시_

```
$ npm run build
$ npm start
```
