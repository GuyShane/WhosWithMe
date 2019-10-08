const gulp=require('gulp');
const sass=require('gulp-sass');

function scss(){
    return gulp.src('./public/css/build/*.scss')
        .pipe(sass({
            indentedSyntax: false,
            sourceMap: false,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
}

function watchCss(){
    return gulp.watch('./public/css/build/*.scss', scss);
}

module.exports={
    scss,
    default: gulp.series(scss, watchCss),
};
