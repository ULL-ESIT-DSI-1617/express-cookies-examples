
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('build', shell.task([
  'cd gbookexample'
]));

