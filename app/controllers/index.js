module.exports.index = function (application, req, res) {
    res.render('index/login');
}

module.exports.ip = function (application, req, res) {

    function getIPAddress() {

        var os = require('os');
        var ifaces = os.networkInterfaces();
        var ip = `{`;

        Object.keys(ifaces).forEach(function (ifname) {

            var alias = 0;

            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    return;
                }

                if (alias >= 1) {
                    ip = ip + (`"${alias}" : "${iface.address}",`);
                } else {
                    ip = ip + (`"${alias}" : "${iface.address}",`);
                }
                ++alias;
            });
        });

        ip = ip.slice(0, -1);

        ip = ip + "}";
        return ip;

    }

    var extract = getIPAddress();

    var obj = JSON.parse(extract);

    res.send(obj);

}

module.exports.url = function (application, req, res) {

    function getAccessKey(str) {
        var accessKey = (str.substring(str.search("=") + 1)).substring(0, 44);
        return accessKey;
    }

    function getDataFromNFCe(str) {
        var accessKey = getAccessKey(str);
        var extract = `{"uf":"${accessKey.substring(0, 2)}",
                        "year":"20${accessKey.substring(2, 4)}",
                        "month":"${accessKey.substring(4, 6)}",
                        "number":"${accessKey.substring(25, 34)}",
                        "nfce":"${accessKey}",
                        "cnpj":"${accessKey.substring(6, 20).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}"}`;
        var obj = JSON.parse(extract);
        return obj;
    }

    var qrcode = req.body;
    var url = qrcode.url;

    var data = getDataFromNFCe(url);

    res.send(data);

}