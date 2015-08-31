var gulp        = require('gulp'),

	/* 컴파일 엔진 -------------------------------- */
	// Node.js 템플릿 엔젠
	// HTML 프리프로세서(컴파일러)
	jade         = require('gulp-jade'),

	// CSS 프리프로세서
	sass         = require('gulp-sass'),
	rubySass     = require('gulp-ruby-sass'),
	globImporter = require('sass-glob-importer'),

	/* 유틸리티 ---------------------------------- */
	gulpif       = require('gulp-if'),
	filter       = require('gulp-filter'),
	sourcemaps   = require('gulp-sourcemaps'),
	shell        = require('gulp-shell'),
	mq           = require('gulp-combine-mq'),

	/* Browser 서버/싱크 ------------------------- */
	browserSync  = require('browser-sync'),
	reload       = browserSync.reload;


/**
 * ----------------------------------------------------------------
 * 환경설정
 * ----------------------------------------------------------------
 */
var config = {
	// Jade
	'jade': {
		'pretty': true
	},
	// Sass
	'sass_engine': process.env.sass || 'node', // 'node' or 'ruby'
	'sass': {
		// compact, compressed, nested, expanded
		'outputStyle' : 'expanded',
		'importer'    : globImporter(),
	},
	'ruby_sass': { // 옵션: Git Bash or Terminal ⇒ sass -h
		'default-encoding' : 'utf-8',    // Windows 환경에서 CP949 오류 발생 시
		'style'            : 'expanded', // compact, compressed, nested, expanded
		'sourcemap'        : true,
		// 'no-cache'         : true
	},
	'ruby_sass_sourcemaps': {
		'dir': 'maps',
		'options': {
			'includeContent' : false,
			'sourceRoot'     : 'source',
			'require'        : ['sass-globbing'],
		},
	},
	// Browser-sync
	'browserSync': { // 옵션: http://www.browsersync.io/docs/options/
		'server'  : ['dist'],
		'port'    : 8800,
		'notify'  : false,
	}
};





/**
 * ----------------------------------------------------------------
 * Gulp 업무
 * ----------------------------------------------------------------
 */
// 기본 업무
gulp.task('default', [
	'jade',
	config.sass_engine === 'ruby' ? 'sass:ruby' : 'sass'
], function() {
	browserSync(config.browserSync)
	gulp.start('watch');
});

// 관찰 업무
gulp.task('watch', function() {
	gulp.watch(['src/**/*.jade'], ['watch:jade']);
	config.sass_engine === 'ruby' ?
		gulp.watch(['src/sass/**/*'], ['sass:ruby']) :
		gulp.watch(['src/sass/**/*.scss'], ['sass']);
});

gulp.task('watch:jade', ['jade'], reload);




// 변경 업무: Jade → HTML
gulp.task('jade', function() {
	return gulp.src('src/jade/**/!(_)*.jade')
		.pipe( jade( config.jade ) )
		.on('error', errorLog)
		.pipe( gulp.dest('dist') );
});

// 변경 업무: [node-sass] scss → CSS
gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe( sourcemaps.init() )
		.pipe( sass( config.sass ).on('error', sass.logError) )
		.pipe( mq() )
		.pipe( sourcemaps.write('./maps') )
		.pipe( gulp.dest('dist/css') )
		.pipe( reload({stream: true}) );
});

// 변경 업무: [ruby-sass] (sass|scss) → CSS
gulp.task('sass:ruby', function() {
	// gulp-ruby-sass 사용 시에는 디렉토리 명만 입력할 것!
	return rubySass('src/sass/', config.ruby_sass)
		.on('error', rubySass.logError)
		.pipe( sourcemaps.write(config.ruby_sass_sourcemaps.dir, config.ruby_sass_sourcemaps.options) )
		.pipe( mq() )
		.pipe( gulp.dest('dist/css') )
		.pipe( filter('**/*.css') )
		.pipe( reload({stream: true}) );
});



// 명령어 환경의 코드를 Gulp에서 수행할 수 있도록 조치
gulp.task('clean', shell.task('rm -rf dist src/output'));

// 필히 Ruby, Sass 설치되어 있어야 사용 가능!
var from   = process.env.from || 'scss';
var to     = process.env.to || 'sass';
var input  = process.env.input || 'src/sass';
var output = process.env.output || 'src/output';

gulp.task(
	'convert',
	shell.task('sass-convert -E utf-8 -F '+from+' -T '+to+' -R --indent t '+input + ' ' + output)
);

gulp.task(
	'convert:scss2sass',
	shell.task('sass-convert -E utf-8 -F scss -T sass -R --indent t '+input + ' ' + output)
);
gulp.task(
	'convert:sass2scss',
	shell.task('sass-convert -E utf-8 -F sass -T scss -R --indent t '+input + ' ' + output)
);
gulp.task(
	'convert:css2scss',
	shell.task('sass-convert -E utf-8 -F css -T scss -R --indent t '+input + ' ' + output)
);
gulp.task(
	'convert:css2sass',
	shell.task('sass-convert -E utf-8 -F css -T sass -R --indent t '+input + ' ' + output)
);




/**
 * ----------------------------------------------------------------
 * 유틸리티
 * ----------------------------------------------------------------
 */
// 오류 출력을 위한 errorLog 함수
// 오류 발생 시에도 watch 업무 중단하지 않음.
function errorLog(error) {
	console.error(error.message);
	this.emit('end');
}