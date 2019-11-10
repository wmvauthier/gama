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

    function checkCNPJ(data) {
        if (data.cnpj == '06859452001343') {
            return "Saída Autorizada";
        } else {
            return "Nota Fiscal Não Permitida";
        }
    }

    var qrcode = req.body;
    var url = qrcode.url;

    var data = getDataFromNFCe(url);
    var check = checkCNPJ(data);
    var result = `{"cnpj":"${data.cnpj}", "check":"${check}"}`;
    res.send(result);

}
