cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/mobi.monaca.plugins.Monaca/www/monaca.js",
        "id": "mobi.monaca.plugins.Monaca.monaca"
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "mobi.monaca.plugins.Monaca": "2.0.0",
    "org.apache.cordova.splashscreen": "0.3.5",
    "mobi.monaca.plugins.MonacaBackend": "1.0.1"
}
// BOTTOM OF METADATA
});