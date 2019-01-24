const webpack = require("webpack");
const path = require("path");

module.exports = {
  // webpack 이 실행 할 mode. production 과 development
  mode: "production",
  target: "node",
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
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
