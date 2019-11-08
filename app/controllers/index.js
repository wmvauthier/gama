module.exports.index = function (application, req, res) {
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

    var str = "http://nfce.sefaz.pe.gov.br/nfce-web/consultarNFCe?p=26191008118879000182650010000693271005117969|2|1|1|1D435E4D8ACFE1058BBBA43127EBF0C6289C182C";
    var data = getDataFromNFCe(str);
    console.log(data);
    res.render('index/login', { data: data });
}
