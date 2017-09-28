var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('watch', () => {
    gulp.watch('./index.html', ['reload']);
    gulp.watch('./js/**', ['reload']);
});

gulp.task('css', () => {
    return gulp.src('./sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.reload({
        stream:true
    }))
})

gulp.task('default', ['browser-sync', 'css', 'watch'], () => {
    gulp.watch('./sass/**/*.sass', ['css'])
})


