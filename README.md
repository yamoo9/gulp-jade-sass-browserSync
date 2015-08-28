# Jade + Sass + Browser-sync ProjectKit `v0.0.2`

![Gulp :: Jade + Sass + Browser-sync ProjectKit v0.0.2](https://camo.githubusercontent.com/909d190d604c28645fc389a64f450b48d096224a/687474703a2f2f7777772e6b6f6c737a6577736b692e636f6d2f696d616765732f76656e646f72732e706e67)

`Gulp`, `Jade`, `Sass`, `Browser Sync` 등을 활용하는 <br> **모던 워크플로우 오토메이션 프로젝트 툴킷**입니다.

## 설치
본 프로젝트 키트는 `Node.js`, `Ruby` 환경에서 구동됩니다. <br>
아래 목록의 플랫폼을 각각 설치해야 정상 작동됩니다.

> **Platforms**

- [node.js](http://nodejs.org/)
- [ruby](http://rubyinstaller.org) `Windows 사용자일 경우, 설치`

-

프로젝트 키트 내부적으로는 `Gulp`, `Bower` 도구를 사용함으로 <br>
아래 `CLI` 명령으로 도구를 설치한 후, 개발 의존 모듈을 설치해야 합니다.

> **Tools**

- [Gulp](http://gulpjs.com/)
- [Bower](http://bower.io)

```sh
npm i -g gulp bower
npm i && bower i
```

## 사용법 (Gulp 명령어)
```sh
# Browser-sync 구동 및 Jade, Sass, Watch 업무 수행
gulp

# 생성된 dist 폴더 제거
gulp clean

# Jade, Sass 관찰 수행
gulp watch

# Jade → HTML 변경 수행 (1회)
gulp jade

# Sass → CSS 변경 수행 (1회)
# Node Sass 활용
gulp sass
# Ruby Sass 활용할 경우
gulp sass:ruby
# sass-convert 명령 수행
gulp convert:sass2scss
gulp convert:scss2sass
```

## 개발 의존 모듈 리스트
```sh
node_modules
├── browser-sync
├── gulp
├── gulp-combine-mq
├── gulp-filter
├── gulp-if
├── gulp-jade
├── gulp-ruby-sass
├── gulp-sass
├── gulp-shell
├── gulp-sourcemaps
└── sass-glob-importer
```