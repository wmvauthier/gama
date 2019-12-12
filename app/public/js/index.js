var video = $('#video')[0];
var source = $('#source')[0];

var waitingVideo = "js/files/video/waitingVideo.mp4";
var allowedVideo = "js/files/video/allowedVideo.mp4";
var notAllowedVideo = "js/files/video/notAllowedVideo.mp4";

var allowedAudio = new Audio('js/files/audio/allowedAudio.wav');
var waitingAudio = new Audio('js/files/audio/waitingAudio.wav');
var wrongAudio = new Audio('js/files/audio/wrongAudio.wav');
var usedAudio = new Audio('js/files/audio/usedAudio.wav');

$(document).click(function (e) {
    $("#nfce").focus();
});

$("#formURL").submit(function (e) {

    e.preventDefault();
    var nfce = $("#nfce").val();

    var dadosURL = httpPost(`http://localhost:5000/url`, `url=${nfce}`);
    var affiliates = httpGet(`http://${IP_DO_SERVIDOR}:3000/affiliate`);
    var usedDocuments = httpGet(`http://${IP_DO_SERVIDOR}:3000/document_Affiliates`);

    var NFCE = false;
    var checkCNPJ = false;
    var checkNFCE = false;

    affiliates.forEach(element => {
        if (dadosURL.cnpj == element.cnpj) {
            checkCNPJ = true;
            affiliate = element;
        }
    });

    usedDocuments.forEach(element => {
        if (dadosURL.nfce == element.nfce) {
            checkNFCE = true;
            NFCE = element;
        }
    });

    NFCE = dadosURL.nfce;

    if (checkCNPJ == false && checkNFCE == false) {
        cleanInputNFCE();
        changeSRCNotAllowed();
        wrongAudio.play();
    } else if (checkCNPJ == false && checkNFCE == true) {
        cleanInputNFCE();
        changeSRCNotAllowed();
        wrongAudio.play();
    } else if (checkCNPJ == true && checkNFCE == true) {
        cleanInputNFCE();
        changeSRCNotAllowed();
        usedAudio.play();
    } else if (checkCNPJ == true && checkNFCE == false) {

        var doc = httpGet(`http://${IP_DO_SERVIDOR}:3000/getRandomAFF`);
        var documentData = `id_document=${doc.id_document}&document_type=${doc.document_type}&nfce=${NFCE}&data_entrada=${doc.data_entrada}&terminal_entrada=${doc.terminal_entrada}&terminal_saida=${localStorage.getItem("terminal")}&patio=${localStorage.getItem("patio")}`;

        httpPost(`http://${IP_DO_SERVIDOR}:3000/exitDocument`, documentData);

        actCancel();
        cleanInputNFCE();
        changeSRCAllowed();
        allowedAudio.play();

    }

    setTimeout(function () {
        changeSRCWaiting();
    }, 6000);

});

function changeSRCWaiting() {
    source.setAttribute('src', waitingVideo);
    video.load();
    video.play();
}

function changeSRCAllowed() {
    source.setAttribute('src', allowedVideo);
    video.load();
    video.play();
}

function changeSRCNotAllowed() {
    source.setAttribute('src', notAllowedVideo);
    video.load();
    video.play();
}

function changeBKGnoServer() {
    $("body").css("backgroundImage", "url('../js/files/img/noServer.png')")
}

function changeBKGnoRegister() {
    $("body").css("backgroundImage", "url('../js/files/img/noRegister.png')")
}

function changeBKGtypeTerminal() {
    $("body").css("backgroundImage", "url('../js/files/img/typeTerminal.png')")
}

function checkTerminalGama() {

    var ipList = httpGet(`http://localhost:5000/ip`);
    var terminalList = httpGet(`http://${IP_DO_SERVIDOR}:3000/terminal`);
    var terminalResult = false;

    terminalList.forEach(terminal => {

        for (var key in ipList) {
            if (!ipList.hasOwnProperty(key)) { continue; }
            if (ipList[key] == terminal.ip) {
                terminalResult = terminal;
            }
        };

    });

    if (terminalResult == false) {
        changeBKGnoRegister();
    } else if (terminalResult.funcao !== "GAMA - SAÍDA") {
        changeBKGtypeTerminal();
    } else {
        localStorage.setItem('terminal', terminalResult.descricao);
        localStorage.setItem('patio', terminalResult.patio);
        localStorage.setItem('IP', terminalResult.ip_cancela);
        $("#nfce").focus();
        $("body").css("backgroundImage", "url('')")
        changeSRCWaiting();
    }

}

function cleanInputNFCE() {
    $("#nfce").val("");
    $("#nfce").focus();
}

function actCancel(ip) {
    var ip = localStorage.getItem("IP");
    httpGet2(`http://${ip}:2000/actCancel`);
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function httpGet2(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true); // false for synchronous request
    xmlHttp.send(null);
}

function httpPost(theUrl, data) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", theUrl, false); // false for synchronous request
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send(data);
    return JSON.parse(xmlHttp.responseText);
}

window.onload = function () {
    checkTerminalGama();
}