var video = $('#video')[0];
var source = $('#source')[0];

var waitingVideo = "js/files/video/waitingVideo.mp4";
var allowedVideo = "js/files/video/allowedVideo.mp4";
var notAllowedVideo = "js/files/video/notAllowedVideo.mp4";

var allowedAudio = new Audio('js/files/audio/allowedAudio.wav');
var waitingAudio = new Audio('js/files/audio/waitingAudio.wav');
var wrongAudio = new Audio('js/files/audio/wrongAudio.wav');
var usedAudio = new Audio('js/files/audio/usedAudio.wav');

$(document).click( function (e) {
    $("#nfce").focus();
});

$("#formURL").submit( function (e) {

    e.preventDefault();
    var nfce = $("#nfce").val();

    var xhttp = new XMLHttpRequest();
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {

            var dadosURL = JSON.parse(this.responseText);

            var xhttp2 = new XMLHttpRequest();
            xhttp2 = new XMLHttpRequest();

            xhttp2.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var affiliates = JSON.parse(this.responseText);

                    var xhttp3 = new XMLHttpRequest();
                    xhttp3 = new XMLHttpRequest();

                    xhttp3.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var usedDocuments = JSON.parse(this.responseText);

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

                                var xhttp4 = new XMLHttpRequest();
                                xhttp4 = new XMLHttpRequest();
                                var document_type = "AFF";

                                xhttp4.onreadystatechange = function () {
                                    if (this.readyState == 4 && this.status == 200) {
                                        actCancel();
                                        cleanInputNFCE();
                                        changeSRCAllowed();
                                        allowedAudio.play();
                                    }
                                }

                                var url = `http://${IP_DO_SERVIDOR}:3000/document`;
                                xhttp4.open("POST", url, true);
                                xhttp4.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                xhttp4.send(`document_type=${document_type}&nfce=${NFCE}`);

                            }

                            setTimeout(function () {
                                changeSRCWaiting();
                            }, 6000);

                        }

                    }

                    var url = `http://${IP_DO_SERVIDOR}:3000/document_Affiliates`;
                    xhttp3.open("GET", url, true);
                    xhttp3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp3.send();

                };
            }

            var url = `http://${IP_DO_SERVIDOR}:3000/affiliate`;
            xhttp2.open("GET", url, true);
            xhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp2.send();

        };

    }

    var url = `http://localhost:5000/url`;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`url=${nfce}`);

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
    $("body").css("backgroundImage","url('../js/files/img/noServer.png')")
}

function changeBKGnoRegister() {
    $("body").css("backgroundImage","url('../js/files/img/noRegister.png')")
}

function changeBKGtypeTerminal() {
    $("body").css("backgroundImage","url('../js/files/img/typeTerminal.png')")
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
        localStorage.setItem('IP', terminalResult.ip_cancela);
        $("#nfce").focus();
        $("body").css("backgroundImage","url('')")
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

window.onload = function () {
    checkTerminalGama();
}