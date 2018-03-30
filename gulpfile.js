const gulp=require('gulp');
const sass=require('gulp-sass');

gulp.task('scss', ()=>{
    return gulp.src('./public/css/build/*.scss')
        .pipe(sass({
            indentedSyntax: false,
            sourceMap: false,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch-css', ()=>{
    return gulp.watch('./public/css/build/*.scss', ['scss']);
});

gulp.task('css', ['scss', 'watch-css']);

gulp.task('default', ['css']);
