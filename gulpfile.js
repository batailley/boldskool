var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var concat = require('gulp-concat');
var transform = require('vinyl-transform');
var glob = require('glob');
var webpack_stream = require('webpack-stream');
var webpack2 = require('webpack');
var named = require('vinyl-named');


var vendors = [
    'node_modules/proptypes/index.js',
    'node_modules/react/dist/react-with-addons.min.js',
    'node_modules/react-dom/dist/react-dom.min.js'
];



var compile = function(entry, dest) {
    return gulp.src(entry)
        .pipe(named())
        .pipe(webpack_stream({
            cache: true,
            module: {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        exclude: /node_modules/,
                        use: [
                            'babel-loader'
                        ]
                    }
                ]
            },
            resolve: {
              unsafeCache:true
            },
            plugins: [
                new webpack2.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),
                new webpack2.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                        screw_ie8: true,
                        conditionals: true,
                        unused: true,
                        comparisons: true,
                        sequences: true,
                        dead_code: true,
                        evaluate: true,
                        if_return: true,
                        join_vars: true,
                    },
                    output: {
                        comments: false,
                    },
                })
            ],
        }, webpack2))
        .pipe(gulp.dest(dest));
};


//combined and concat main js in
gulp.task('combine:vendors', [], function () {
    return gulp.src(vendors)
        .pipe(concat('vendors-combined.js'))
        .pipe(gulp.dest('./dist/'))
        .on('end', function() {
            console.log('Concat main javascripts done.');
        });
});

gulp.task('build:app', function () {
    return compile('./src/js/app.js', './dist/');
});
