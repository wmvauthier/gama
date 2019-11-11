module.exports.index = function (application, req, res) {
    res.render('index/login');
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
                        "cnpj":"${accessKey.substring(6, 20)}"}`;
        var obj = JSON.parse(extract);
        return obj;
    }

    function getAffiliates(res) {
        request('http://localhost:3000/affiliate', { json: true }, (err, resp, body) => {
            if (err) { return console.log(err); }

            body.forEach(affiliate => {
                Object.entries(affiliate).forEach(([key, value]) => {
                    if (affiliate.cnpj == data.cnpj) {
                        res.send("Saída Autorizada");
                    }
                    else {
                        res.send("Nota Fiscal Não Permitida");
                    }
                    //result = `{"cnpj":"${data.cnpj}", "check":"${check}"}`;
                    //console.log(`${data.cnpj} ${check}`);
                });
            });

        });
    }

    var qrcode = req.body;
    var url = qrcode.url;

    var data = getDataFromNFCe(url);
    var check = false;
    var result = false;

    const request = require('request');
    console.log(getAffiliates(res));
    res.send("result");

}