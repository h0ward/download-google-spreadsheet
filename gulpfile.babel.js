import babel from 'gulp-babel';
import createSync from 'gulp-sync';
import gulp from 'gulp';
import {spawn} from 'child_process';

const {sync} = createSync(gulp);

gulp.task('chmod', (cb) => {
  spawn('chmod', ['--verbose', '+x', './bin/download-google-spreadsheet.js'], {stdio: 'inherit'})
    .on('close', cb);
});

gulp.task('compile', (cb) => {
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('.'))
    .on('end', cb);
});

gulp.task('default', sync([
  'compile',
  'chmod',
]));
