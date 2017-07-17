$(document).ready(function () {
    //Variables
    var currentUser = {
        user: null,
        elementOne: 0,
        elementTwo: 0,
        elementThree: 0,
        elementFour: 0,
        elementFive: 0,
        elementSix: 0
    };

    var currentPiece = {
        title: "None Selected",
        difficultyNotes: [],
        instrumentationNotes: []
    };

    var pieceList;
    var activePieceList = [];
    var listOfUsers;
    var numberOfPieces;
    var piecesLoaded = false;
    var searchFor;
    var searchTitle;
    var searchComposer;
    var searchArranger;
    var cookiesExist;
    var newBandCreated = false;
    var numberOfUsers;

    //Animate Ellipsis on Disabled "Load Choir" Button
    $('#loginButton').attr('disabled', 'disabled');

    var loadAnimCount = 1;
    var loadAnimate = setInterval(function () {
        switch (loadAnimCount) {
            case 0:
                document.getElementById('loginButton').value = 'Loading.';
                loadAnimCount = 1;
                break;

            case 1:
                document.getElementById('loginButton').value = 'Loading..';
                loadAnimCount = 2;
                break;

            default:
                document.getElementById('loginButton').value = 'Loading...';
                loadAnimCount = 0;
        };
    }, 500);


    //Startup
    function getUserList() {
        Tabletop.init({ key: '1XU227N5VXHO6vWvA5BU9hVz7wsEop0wQkCYOLiHeQj8',
            callback: function (data, tabletop) {
                listOfUsers = data;
                $('#loginButton').removeAttr('disabled');
                document.getElementById('loginButton').value = 'Load Choir';
                clearInterval(loadAnimate);
            },
            simpleSheet: true
        });
    };

    getUserList();


    if (getCookie("band") !== "" && getCookie("email") !== "") {
        cookiesExist = true;
        document.getElementById('userEmail').value = getCookie('email');
        document.getElementById('userBand').value = getCookie('band');
    };

    //Functions
    function addGraphCanvas() {
        $('#dataPane').empty();
        $('#dataPane').append(
                '<div id="canvasContainer">' +
                    '<canvas id="myBand" width="300" height="300"></canvas>' +
                '</div>' +
                    '<table id="instrumentationPane">' +
                        '<tr>' +
                            '<td id="sopranos" class="instrument">S</td>' +
                            '<td id="altos" class="instrument">A</td>' +
                            '<td id="tenors" class="instrument">T</td>' +
                            '<td id="basses" class="instrument">B</td>' +
                            '<td id="piano" class="instrument">P</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td colspan="4" id="voicing" class="instrument"></td>' +
                        '</tr>' +
                    '</table>' +
                    '<div id="help" class="on">?</div>'
                );
    };

    function openOverlay(url, external, callback) {
        $('body').append('<div id="pageCover"></div>');
        $('body').append('<div id="overlayPane"></div>');
        $('#overlayPane').html('<iframe id="pageContent" type="text/html" src="' + url + '" width="100%" height="100%"></iframe>');

        if (external) {
            $('#pageContent').css({ height: '0%', width: '0%' });
            $('#pageContent').css('width', '0%');
            $('#overlayPane').prepend('<div class="loaderExternal"></div>');

            numberOfUsers = listOfUsers.length;

            document.getElementById('pageContent').onload = (function () {
                $('.loaderExternal').remove();
                $('#pageContent').css({ height: '100%', width: '100%' });

                callback();
            });
        };
    };

    function closeOverlay() {
        $('#pageCover').remove();
        $('#overlayPane').remove();
    };

    function clearCommentsAndInstrumentation() {
        $('#notesPane').empty();
        $('#numberOfPercussion').empty();
        $('#databasePane').empty();
        $('.trueBasic').removeClass('trueBasic');
        $('.trueAdvanced').removeClass('trueAdvanced');
    };

    //Link Buttons
    function openWindow(url) {
        var win = window.open(url, '_blank');
        if (win) {
            win.focus();
        } else {
            alert('Please allow popups for this website');
        };
    };

    //Mobile
    function detectmob() {
        if (navigator.userAgent.match(/Android/i)
                         || navigator.userAgent.match(/webOS/i)
                         || navigator.userAgent.match(/iPhone/i)
                         || navigator.userAgent.match(/iPad/i)
                         || navigator.userAgent.match(/iPod/i)
                         || navigator.userAgent.match(/BlackBerry/i)
                         || navigator.userAgent.match(/Windows Phone/i)
                         ) {
            return true;
        }
        else {
            return false;
        };
    };

    if (detectmob()) {
        alert('This site is not optimized for mobile. For best results, use your desktop or laptop.')
    };

    //Cookies
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    };

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    //Math
    function findMean(array) {
        var mean = 0;

        for (var p = 0; p < array.length; p++) {
            mean += array[p];
        };

        mean = mean / array.length;

        return mean;
    };

    function findMode(array, ifNoMode) {
        var largestValueCount = 0;
        var largestValue;
        var noLargestValue = false;

        for (var z = 0; z < array.length; z++) {
            var currentValue = array[z];
            var currentValueCount = 1;

            for (var y = 0; y < array.length; y++) {
                if (z !== y && array[z] == array[y]) {
                    currentValueCount++;
                };
            };

            if (currentValueCount > largestValueCount) {
                largestValueCount = currentValueCount;
                largestValue = array[z];
                noLargestValue = false;
            };
            if (currentValueCount == largestValueCount && currentValue !== largestValue) {
                noLargestValue = true;
            };
        };

        if (noLargestValue) {
            return ifNoMode;
        }
        else {
            return largestValue;
        };
    };

    function unique(array) {
        newArray = [];

        for (var ar = 0; ar < array.length; ar++) {
            if ($.inArray(array[ar], newArray) == -1) {
                newArray.push(array[ar]);
            };
        };

        return newArray;
    };

    function uniqueCount(array) {
        newArray = [];
        uniqueArray = [];
        countArray = [];

        for (var ar = 0; ar < array.length; ar++) {
            if ($.inArray(array[ar], uniqueArray) == -1) {
                uniqueArray.push(array[ar]);
                countArray.push(1);
            }
            else {
                countArray[$.inArray(array[ar], uniqueArray)]++;
            }
        };

        for (var ar = 0; ar < uniqueArray.length; ar++) {
            newArray[ar] = [uniqueArray[ar], countArray[ar]];
        };

        return newArray;
    };

    function changeInstrumentation(piece) {
        $('#voicing').empty();

        $('.instrument').removeClass('red');
        $('.instrument').removeClass('orage');
        $('.instrument').removeClass('yellow');
        $('.instrument').removeClass('green');

        var soprano;
        var alto;
        var tenor;
        var bass;

        if (piece['Soprano'] == '4+') {
            soprano = 4;
        }
        else {
            soprano = piece['Soprano'] / 1;
        }

        if (piece['Alto'] == '4+') {
            alto = 4;
        }
        else {
            alto = piece['Alto'] / 1;
        }

        if (piece['Tenor'] == '4+') {
            tenor = 4;
        }
        else {
            tenor = piece['Tenor'] / 1;
        }

        if (piece['Bass'] == '4+') {
            bass = 4;
        }
        else {
            bass = piece['Bass'] / 1;
        }

        for (var p = 0; p < soprano; p++) {
            $('#voicing').append('S');
        };

        for (var p = 0; p < alto; p++) {
            $('#voicing').append('A');
        };

        for (var p = 0; p < tenor; p++) {
            $('#voicing').append('T');
        };

        for (var p = 0; p < bass; p++) {
            $('#voicing').append('B');
        };

        switch (soprano) {
            case 0:
                break;
            case 1:
                $('#sopranos').addClass('green');
                break;
            case 2:
                $('#sopranos').addClass('yellow');
                break;
            case 3:
                $('#sopranos').addClass('orange');
                break;
            case 4:
                $('#sopranos').addClass('red');
                break;
            default:
        };

        switch (alto) {
            case 0:
                break;
            case 1:
                $('#altos').addClass('green');
                break;
            case 2:
                $('#altos').addClass('yellow');
                break;
            case 3:
                $('#altos').addClass('orange');
                break;
            case 4:
                $('#altos').addClass('red');
                break;
            default:
        };

        switch (tenor) {
            case 0:
                break;
            case 1:
                $('#tenors').addClass('green');
                break;
            case 2:
                $('#tenors').addClass('yellow');
                break;
            case 3:
                $('#tenors').addClass('orange');
                break;
            case 4:
                $('#tenors').addClass('red');
                break;
            default:
        };

        switch (bass) {
            case 0:
                break;
            case 1:
                $('#basses').addClass('green');
                break;
            case 2:
                $('#basses').addClass('yellow');
                break;
            case 3:
                $('#basses').addClass('orange');
                break;
            case 4:
                $('#basses').addClass('red');
                break;
            default:
        };

        switch (piece['Piano']) {
            case 'None':
                break;
            case 'Optional':
                $('#piano').addClass('yellow');
                break;
            case 'Required':
                $('#piano').addClass('red');
                break;
            default:
        };
    };

    function addNotes(piece) {
        $('#notesPane').empty();

        if (piece['Difficulty Notes'].length == 0 && piece['Instrumentation Notes'].length == 0) {
            $('#notesPane').append('<div class="noNotes">No Notes Yet</div>');
        };

        for (var g = 0; g < piece['Difficulty Notes'].length; g++) {
            $('#notesPane').append('<div class="difficultyNote">' + piece['Difficulty Notes'][g] + '</div>');
        };

        for (var g = 0; g < piece['Instrumentation Notes'].length; g++) {
            $('#notesPane').append('<div class="instrumentationNote">' + piece['Instrumentation Notes'][g] + '</div>');
        };
    };

    function loadPieces(callback) {
        Tabletop.init({ key: "1TEqhErIfRaeyxF2pHF0AmaHO7qZvAiUpYrUPCRkV8SA",
            callback: function (data, tabletop) {
                pieceList = data;
                numberOfPieces = pieceList.length;
                var g = 0;
                activePieceList = [];

                for (var i = 0; i < numberOfPieces; i++) {
                    var testTwo = checkForDuplicates(i);

                    if (testTwo !== false) {
                        activePieceList.push(testTwo);
                        g++;
                    };
                };

                numberOfPieces = activePieceList.length;
                activePieceList.sort(function (a, b) { return (a['Title'] > b['Title']) ? 1 : ((b['Title'] > a['Title']) ? -1 : 0); });
                pieceListLoading = false;

                piecesLoaded = true;
                if (callback) { callback(); };
            },
            simpleSheet: true
        });
    };

    //Check for Duplicates
    function checkForDuplicates(t) {
        var alreadyDone = false;
        var pieceInQuestion = false;

        //Loop through every piece
        for (var a = 0; a < t; a++) {
            if (pieceList[t]['Title'].toUpperCase() == pieceList[a]['Title'].toUpperCase() && pieceList[t]['Composer'].toUpperCase() == pieceList[a]['Composer'].toUpperCase() && pieceList[t]['Arranger'].toUpperCase() == pieceList[a]['Arranger'].toUpperCase() && pieceList[t]['Publisher'].toUpperCase() == pieceList[a]['Publisher'].toUpperCase()) {
                alreadyDone = true;
            };
        };

        if (!alreadyDone) {
            pieceInQuestion = {}

            //Direct Attributes
            pieceInQuestion['Title'] = pieceList[t]['Title'];
            pieceInQuestion['Composer'] = pieceList[t]['Composer'];
            pieceInQuestion['Publisher'] = pieceList[t]['Publisher'];
            pieceInQuestion['Arranger'] = pieceList[t]['Arranger'];

            //Calculated Attribute Setup
            pieceInQuestion['Rapidity'] = [];
            pieceInQuestion['Rhythm'] = [];
            pieceInQuestion['Dynamics'] = [];
            pieceInQuestion['Texture'] = [];
            pieceInQuestion['Tonality'] = [];
            pieceInQuestion['Range'] = [];
            pieceInQuestion['Soprano'] = [];
            pieceInQuestion['Alto'] = [];
            pieceInQuestion['Tenor'] = [];
            pieceInQuestion['Bass'] = [];
            pieceInQuestion['Piano'] = [];
            pieceInQuestion['Difficulty Notes'] = [];
            pieceInQuestion['Instrumentation Notes'] = [];
            pieceInQuestion['Number of Analyses'] = 0;
            pieceInQuestion['Reference States'] = [];
            pieceInQuestion['Names'] = [];
            pieceInQuestion['Affiliations'] = [];

            //For each piece, loop through each piece again
            for (var a = t; a < numberOfPieces; a++) {
                if (pieceList[t]['Title'] == pieceList[a]['Title'] && pieceList[t]['Composer'] == pieceList[a]['Composer'] && pieceList[t]['Arranger'] == pieceList[a]['Arranger'] && pieceList[t]['Publisher'] == pieceList[a]['Publisher']) {

                    //For all pieces that are the same...
                    pieceInQuestion['Rapidity'].push(pieceList[a][' [Rapidity]'] / 1);
                    pieceInQuestion['Rhythm'].push(pieceList[a][' [Rhythm]'] / 1);
                    pieceInQuestion['Dynamics'].push(pieceList[a][' [Dynamics]'] / 1);
                    pieceInQuestion['Texture'].push(pieceList[a][' [Texture]'] / 1);
                    pieceInQuestion['Tonality'].push(pieceList[a][' [Tonality]'] / 1);
                    pieceInQuestion['Range'].push(pieceList[a][' [Range]'] / 1);
                    pieceInQuestion['Soprano'].push(pieceList[a][' [Soprano]']);
                    pieceInQuestion['Alto'].push(pieceList[a][' [Alto]']);
                    pieceInQuestion['Tenor'].push(pieceList[a][' [Tenor]']);
                    pieceInQuestion['Bass'].push(pieceList[a][' [Bass]']);
                    pieceInQuestion['Piano'].push(pieceList[a]['Piano']);
                    pieceInQuestion['Number of Analyses']++;
                    pieceInQuestion['Reference States'].push(pieceList[a]['Reference State']);
                    pieceInQuestion['Names'].push(pieceList[a]['Your Name']);
                    pieceInQuestion['Affiliations'].push(pieceList[a]['Your Affiliation']);

                    if (pieceList[a]['Difficulty Notes'] !== '') {
                        var diff = pieceList[a]['Difficulty Notes'];
                        var diff2 = diff.split('.');

                        for (var h = 0; h < (diff2.length); h++) {
                            if (diff2[h] !== '') {
                                var thisn = diff2[h] + '.';
                                pieceInQuestion['Difficulty Notes'].push(thisn);
                            };
                        };
                    };

                    if (pieceList[a]['Instrumentation Notes'] !== "") {
                        var diff = pieceList[a]['Instrumentation Notes'];
                        var diff2 = diff.split('.');

                        for (var h = 0; h < (diff2.length); h++) {
                            if (diff2[h] !== '') {
                                var thisn = diff2[h] + '.';
                                pieceInQuestion['Instrumentation Notes'].push(thisn);
                            };
                        };
                    };
                };
            };

            //Calculated Attribute Calculations
            pieceInQuestion['Rapidity'] = Math.round(findMean(pieceInQuestion['Rapidity']));
            pieceInQuestion['Rhythm'] = Math.round(findMean(pieceInQuestion['Rhythm']));
            pieceInQuestion['Dynamics'] = Math.round(findMean(pieceInQuestion['Dynamics']));
            pieceInQuestion['Texture'] = Math.round(findMean(pieceInQuestion['Texture']));
            pieceInQuestion['Tonality'] = Math.round(findMean(pieceInQuestion['Tonality']));
            pieceInQuestion['Range'] = Math.round(findMean(pieceInQuestion['Range']));
            pieceInQuestion['Soprano'] = findMode(pieceInQuestion['Soprano'], 0);
            pieceInQuestion['Alto'] = findMode(pieceInQuestion['Alto'], 0);
            pieceInQuestion['Tenor'] = findMode(pieceInQuestion['Tenor'], 0);
            pieceInQuestion['Bass'] = findMode(pieceInQuestion['Bass'], 0);
            pieceInQuestion['Piano'] = findMode(pieceInQuestion['Piano'], 'No');
            pieceInQuestion['Reference States'] = uniqueCount(pieceInQuestion['Reference States']);
            pieceInQuestion['Names'] = uniqueCount(pieceInQuestion['Names']);
            pieceInQuestion['Affiliations'] = uniqueCount(pieceInQuestion['Affiliations']);
        };

        return pieceInQuestion;
    };

    //Create Graph
    function createGraph() {
        $('#canvasContainer').empty();
        $('#canvasContainer').append('<canvas id="myBand" width="300" height="300"></canvas>');

        var myChart = new Chart("myBand", {
            type: 'radar',
            data: {
                labels: ["Rapidity", "Rhythm", "Dynamics", "Texture", "Tonality", "Range"],
                datasets: [
                                                                                                         {
                                                                                                             label: "Selected Piece",
                                                                                                             fillColor: "rgba(440,220,320,0.4)",
                                                                                                             strokeColor: "rgba(440,220,220,1)",
                                                                                                             pointColor: "rgba(440,220,220,1)",
                                                                                                             pointStrokeColor: "#fff",
                                                                                                             pointHighlightFill: "#fff",
                                                                                                             pointHighlightStroke: "rgba(440,220,220,1)",
                                                                                                             backgroundColor: "rgba(255,182,193,0.6)",
                                                                                                             borderColor: "lightpink",
                                                                                                             data: [
                                                                                                                     currentPiece.elementOne,
                                                                                                                     currentPiece.elementTwo,
                                                                                                                     currentPiece.elementThree,
                                                                                                                     currentPiece.elementFour,
                                                                                                                     currentPiece.elementFive,
                                                                                                                     currentPiece.elementSix
                                                                                                                   ]
                                                                                                         },
                                                                                                         {
                                                                                                             label: "Your Choir",
                                                                                                             fillColor: "rgba(220,220,440,0.4)",
                                                                                                             strokeColor: "rgba(220,220,440,1)",
                                                                                                             pointColor: "rgba(220,220,440,1)",
                                                                                                             pointStrokeColor: "#fff",
                                                                                                             pointHighlightFill: "#fff",
                                                                                                             pointHighlightStroke: "rgba(220,220,220,1)",
                                                                                                             backgroundColor: "rgba(152,251,152,0.8)",
                                                                                                             borderColor: "palegreen",
                                                                                                             data: [
                                                                                                                     currentUser.elementOne,
                                                                                                                     currentUser.elementTwo,
                                                                                                                     currentUser.elementThree,
                                                                                                                     currentUser.elementFour,
                                                                                                                     currentUser.elementFive,
                                                                                                                     currentUser.elementSix
                                                                                                                   ]
                                                                                                         }

                                                                                                     ]
            },
            options: {
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 6,
                        stepSize: 1
                    }
                }
            }
        });
    };

    function addPiece(number, challengeLevel) {
        var loadInfo = activePieceList[number];
        $('#databasePane').append('<div id="' + number + '" class="piece"></div>');
        $('#' + number).append('<h2>' + loadInfo['Title'] + '</h1>');
        $('#' + number).append('<h3>' + loadInfo['Composer'] + '</h3>');

        if (loadInfo['Arranger'] !== "") {
            $('#' + number).append('<h3>Arranged by ' + loadInfo['Arranger'] + '</h3>');
        };
        $('#' + number).append('<h4>' + loadInfo['Publisher'] + '</h4>');

        if (challengeLevel) {
            $('#' + number).append('<p class="cLevel" id="cl' + challengeLevel + '">Challenge Level: ' + challengeLevel + '</p>');
        }

        $('#' + number).append('<p class="analyzerData">?</p>');
        $('#' + number).append('<p class="analyzeThis">Add Analysis</p>');
    };

    function clearSelectedPiece() {
        $('#notesPane').empty();
        currentPiece = {};
        createGraph();
        $('.instrument').removeClass('trueBasic');
        $('.instrument').removeClass('trueAdvanced');
        $('#numberOfPercussion').empty();
    };

    function addNewPieceButtons() {
        $('#databasePane').prepend('<div id="addPiece"><div>+</div><p>Add a new piece</p></div>');
        $('#databasePane').append('<div id="addPiece"><div>+</div><p>Add a new piece</p></div>');
    };

    function listAllPieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();
            clearSelectedPiece();
            for (var i = 0; i < numberOfPieces; i++) { addPiece(i); };
            addNewPieceButtons();
        };
    };

    function searchForPiece() {
        if (piecesLoaded) {
            //Generate Search Screen
            $('#databasePane').empty();
            clearSelectedPiece();
            $('#databasePane').append(
                                        '<br /><div>Search Title <input id="searchTitle" class="searchItem" type="checkbox" name="searchIn" value="Title"></div>' +
                                        '<br /><div>Search Composer <input id="searchComposer" class="searchItem" type="checkbox" name="searchIn" value="Composer"></div>' +
                                        '<br /><div>Search Arranger <input id="searchArranger" class="searchItem" type="checkbox" name="searchIn" value="Arranger"><br /></div><br />'
                                    );
            $('#databasePane').append('<input name="searchTerm" type="text" placeholder="search for a piece" id="searchTerm"><br />');
            $('#databasePane').append('<input type="button" name="executeSearch" value="Search" id="searchButton">');

            //When "Search" is Clicked
            $(document).on('click', '#searchButton', function () {
                searchTitle = document.getElementById("searchTitle").checked;
                searchComposer = document.getElementById("searchComposer").checked;
                searchArranger = document.getElementById("searchArranger").checked;
                searchFor = document.getElementById('searchTerm').value.toString().toUpperCase();

                $('#databasePane').empty();

                for (var i = 0; i < numberOfPieces; i++) {
                    if ((searchTitle && activePieceList[i]['Title'].toUpperCase().search(searchFor) >= 0) || (searchComposer && activePieceList[i]['Composer'].toUpperCase().search(searchFor) >= 0) || (searchArranger && activePieceList[i]['Arranger'].toUpperCase().search(searchFor) >= 0)) {
                        addPiece(i);
                    };
                };
                addNewPieceButtons();
            });
        };
    };

    function listOptimalPieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();
            clearSelectedPiece();
            var optimalTrip = false;

            for (var i = 0; i < numberOfPieces; i++) {
                if (currentUser.elementOne == activePieceList[i]['Rapidity'] && currentUser.elementTwo == activePieceList[i]['Rhythm'] && currentUser.elementThree == activePieceList[i]['Dynamics'] && currentUser.elementFour == activePieceList[i]['Texture'] && currentUser.elementFive == activePieceList[i]['Tonality'] && currentUser.elementSix == activePieceList[i]['Range']) {
                    addPiece(i);
                    optimalTrip = true;
                };
            };

            if (!optimalTrip) {
                $('#databasePane').append('<p>No optimal pieces yet.</p>');
                $('#databasePane').append('<div id="addPiece"><div>+</div><p>Add a new piece</p></div>');
            }
            else {
                addNewPieceButtons();
            };
        };
    };

    function listPlayablePieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();
            clearSelectedPiece();
            for (var i = 0; i < numberOfPieces; i++) {
                if (currentUser.elementOne >= activePieceList[i]['Rapidity'] && currentUser.elementTwo >= activePieceList[i]['Rhythm'] && currentUser.elementThree >= activePieceList[i]['Dynamics'] && currentUser.elementFour >= activePieceList[i]['Texture'] && currentUser.elementFive >= activePieceList[i]['Tonality'] && currentUser.elementSix >= activePieceList[i]['Range']) {
                    addPiece(i);
                };
            };
            addNewPieceButtons();
        };
    };

    function listChallengePieces() {
        if (piecesLoaded) {
            $('#databasePane').empty();
            clearSelectedPiece();
            var challengeLevel;

            //Iterate through list of pieces
            for (var i = 0; i < numberOfPieces; i++) {
                if (!(currentUser.elementOne >= activePieceList[i]['Rapidity'] && currentUser.elementTwo >= activePieceList[i]['Rhythm'] && currentUser.elementThree >= activePieceList[i]['Dynamics'] && currentUser.elementFour >= activePieceList[i]['Texture'] && currentUser.elementFive >= activePieceList[i]['Tonality'] && currentUser.elementSix >= activePieceList[i]['Range']) && (currentUser.elementOne + 1) >= activePieceList[i]['Rapidity'] && (currentUser.elementTwo + 1) >= activePieceList[i]['Rhythm'] && (currentUser.elementThree + 1) >= activePieceList[i]['Dynamics'] && (currentUser.elementFour + 1) >= activePieceList[i]['Texture'] && (currentUser.elementFive + 1) >= activePieceList[i]['Tonality'] && (currentUser.elementSix + 1) >= activePieceList[i]['Range']) {

                    //Add 1 to challengeLevel for each challenge element
                    challengeLevel = 0;

                    if (currentUser.elementOne < activePieceList[i]['Rapidity']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementTwo < activePieceList[i]['Rhythm']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementThree < activePieceList[i]['Dynamics']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementFour < activePieceList[i]['Texture']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementFive < activePieceList[i]['Tonality']) {
                        challengeLevel++;
                    };
                    if (currentUser.elementSix < activePieceList[i]['Range']) {
                        challengeLevel++;
                    };

                    //Append Piece
                    addPiece(i, challengeLevel);
                };
            };

            addNewPieceButtons();
        };
    };

    function selectPiece(piece) {
        $('.selectedPiece').removeClass('selectedPiece');
        $(piece).addClass('selectedPiece');

        var idNo = $(piece).attr("id") / 1;

        currentPiece = {
            title: "None Selected"
        };

        currentPiece.title = activePieceList[idNo]['Title'];
        currentPiece.elementOne = activePieceList[idNo]['Rapidity'] / 1;
        currentPiece.elementTwo = activePieceList[idNo]['Rhythm'] / 1;
        currentPiece.elementThree = activePieceList[idNo]['Dynamics'] / 1;
        currentPiece.elementFour = activePieceList[idNo]['Texture'] / 1;
        currentPiece.elementFive = activePieceList[idNo]['Tonality'] / 1;
        currentPiece.elementSix = activePieceList[idNo]['Range'] / 1;

        changeInstrumentation(activePieceList[idNo]);
        addNotes(activePieceList[idNo]);
        createGraph();
    };

    //Login Button
    function login(emailAttempt, bandAttempt) {
        //Load Google Sheet "User List"
        var userList = '1XU227N5VXHO6vWvA5BU9hVz7wsEop0wQkCYOLiHeQj8';

        //Verify User, Load User Information, and Draw Graph                
        var numberOfItems = listOfUsers.length;
        var userSuccess = false;
        var bandSuccess = false;

        for (var i = 0; i < numberOfItems; i++) {

            //Check Username
            if (listOfUsers[i]['Email Address'].toUpperCase() === emailAttempt.toUpperCase()) {

                //Flag Username as Correct
                userSuccess = true;

                //Confirm Password
                if (listOfUsers[i]['Choir Name'].toUpperCase() === bandAttempt.toUpperCase()) {
                    bandSuccess = true;

                    //Set Current User Info
                    currentUser.user = (listOfUsers[i]['Choir Name']);
                    currentUser.elementOne = (listOfUsers[i]['Choir Skill [Rapidity]'] / 1);
                    currentUser.elementTwo = (listOfUsers[i]['Choir Skill [Rhythm]'] / 1);
                    currentUser.elementThree = (listOfUsers[i]['Choir Skill [Dynamics]'] / 1);
                    currentUser.elementFour = (listOfUsers[i]['Choir Skill [Texture]'] / 1);
                    currentUser.elementFive = (listOfUsers[i]['Choir Skill [Tonality]'] / 1);
                    currentUser.elementSix = (listOfUsers[i]['Choir Skill [Range]'] / 1);

                    //Cookies
                    if (!cookiesExist || !(emailAttempt.toUpperCase() == getCookie('email').toUpperCase() && bandAttempt.toUpperCase() == getCookie('band').toUpperCase())) {
                        var allow = confirm('Remember information using cookies?');

                        if (allow) {
                            setCookie('band', bandAttempt, 14);
                            setCookie('email', emailAttempt, 14);
                        };
                    };

                    //Prepare Piece List and UI                    
                    $('#dataPane').empty();
                    $('#dataPane').append('<div class="loader"></div>');
                    $('#databasePane').empty();

                    loadPieces(function () {
                        addGraphCanvas();
                        createGraph();
                        $('#notesPane').empty();
                        listAllPieces();
                    });

                    //Stop if this is a valid band
                    break;
                }
                else {
                    if (i == [numberOfItems - 1] && !bandSuccess) {
                        alert("Band not Found");
                    };
                }
            }
            else {
                if (i == [numberOfItems - 1] && !userSuccess) {
                    alert("Email not Found");
                };
            };
        };
    };

    //Tool Tips
    function createToolTip(element, text) {
        $(document).on({
            mouseenter: function (evt) {
                if ($('#help').hasClass('on')) {
                    $('#toolTip').html(text);
                    $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                };
            },
            mouseleave: function () {
                $('#toolTip').css('display', 'none');
            }
        }, element);
    };

    function createAdvancedChoirToolTip(hoverDiv, part) {
        $(document).on({
            mouseenter: function (evt) {
                if ($('#help').hasClass('on')) {
                    switch (true) {
                        case $(hoverDiv).hasClass('green'):
                            $('#toolTip').html('This piece has 1 ' + part + ' part.');
                            $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                            break;
                        case $(hoverDiv).hasClass('yellow'):
                            $('#toolTip').html('This piece has 2 ' + part + ' parts.');
                            $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                            break;
                        case $(hoverDiv).hasClass('orange'):
                            $('#toolTip').html('This piece has 3 ' + part + ' parts.');
                            $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                            break;
                        case $(hoverDiv).hasClass('red'):
                            $('#toolTip').html('This piece has 4 or more ' + part + ' parts.');
                            $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                            break;
                        default:
                            $('#toolTip').html('This piece has no ' + part + ' parts.');
                            $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                    };
                };
            },
            mouseleave: function () {
                $('#toolTip').css('display', 'none');
            }
        }, hoverDiv);
    };

    //Help on and off
    $(document).on('click', '#help', function () {
        $(this).toggleClass('on');
        if ($(this).hasClass('on')) {
            $('.instrument').css('border', '2px solid lightpink');
            setTimeout(function () { $('.instrument').css('border', '2px solid #7D7D7D') }, 150);
            setTimeout(function () { $('.instrument').css('border', '2px solid lightpink') }, 300);
            setTimeout(function () { $('.instrument').css('border', '2px solid #7D7D7D') }, 450);

            $('.cLevel').css('color', 'lightpink');
            setTimeout(function () { $('.cLevel').css('color', 'maroon') }, 150);
            setTimeout(function () { $('.cLevel').css('color', 'lightpink') }, 300);
            setTimeout(function () { $('.cLevel').css('color', 'maroon') }, 450);
        };
    });

    createAdvancedChoirToolTip('#sopranos', 'soprano');
    createAdvancedChoirToolTip('#altos', 'alto');
    createAdvancedChoirToolTip('#tenors', 'tenor');
    createAdvancedChoirToolTip('#basses', 'bass');


    createToolTip('#help', 'Toggle help');

    //Voicing tooltip
    $(document).on({
        mouseenter: function (evt) {
            if ($('#voicing').html() !== "") {
                $('#toolTip').html('This piece has a voicing of ' + $('#voicing').html() + '.');
                $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
            };            
        },
        mouseleave: function () {
            $('#toolTip').css('display', 'none');
        }
    }, '#voicing');

    //Piano tooltip
    $(document).on({
        mouseenter: function (evt) {
            if ($('#help').hasClass('on')) {
                if ($('#piano').hasClass('yellow')) {
                    $('#toolTip').html('This piece has an optional piano part.');
                    $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                }
                else if ($('#piano').hasClass('red')) {
                    $('#toolTip').html('This piece has a required piano part.');
                    $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                }
                else {
                    $('#toolTip').html('This piece has no piano part.');
                    if ($('#toolTip').html() !== "") {
                        $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
                    };
                }
            };
        },
        mouseleave: function () {
            $('#toolTip').css('display', 'none');
        }
    }, '#piano');

    //Challenge tooltip
    $(document).on({
        mouseenter: function (evt) {
            if ($('#help').hasClass('on')) {
                if (this.id[2] == "1") {
                    $('#toolTip').html('1 node is above your band\'s level');
                }
                else {
                    $('#toolTip').html(this.id[2] + ' nodes are above your band\'s level');
                };
                $('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
            };
        },
        mouseleave: function () {
            $('#toolTip').css('display', 'none');
        }
    }, '.cLevel');


    //Button Assignments
    $(document).on('click', '#loginButton', function () { login(document.getElementById('userEmail').value.toString(), document.getElementById('userBand').value.toString()); });
    $(document).on('click', '#newAccountButton', function () {
        openOverlay('https://docs.google.com/forms/d/e/1FAIpQLSe0qUGcBPa0qSSddewnG2DTsjjnxlnldfe84x9eoLZTaz85ig/viewform', true, function () {
            $('iframe#pageContent').load(function () {
                $('#overlayPane').empty();
                $('#overlayPane').prepend('<div class="loaderExternal"></div>');
                $('#overlayPane').append('<p id="verifying">Verifying registration and preparing to load choir...</p>')

                function checkUntilLoaded() {
                    getUserList();

                    if (listOfUsers.length > numberOfUsers) {
                        if (!newBandCreated) {
                            newBandCreated = true;
                            closeOverlay();
                            login(listOfUsers[listOfUsers.length - 1]['Email Address'], listOfUsers[listOfUsers.length - 1]['Choir Name']);
                        };
                    }
                    else {
                        setTimeout(function () {
                            if (!newBandCreated) {
                                checkUntilLoaded();
                            };
                        }, 2000);
                    };
                }

                setTimeout(function () { checkUntilLoaded(); }, 2000);
            });
        });
    });

    $(document).on('click', '#search', function () { searchForPiece(); });
    $(document).on('click', '#listOptimal', function () { listOptimalPieces(); });
    $(document).on('click', '#listAllPlayable', function () { listPlayablePieces(); });
    $(document).on('click', '#listChallenge', function () { listChallengePieces(); });
    $(document).on('click', '#listAll', function () { listAllPieces(); });
    $(document).on('click', '#addPiece', function () {
        openOverlay('https://docs.google.com/forms/d/e/1FAIpQLSfD-XMPfGGhg4i9o9D0dpZ14phqsoxE2ByLzbZg1c1SklqRVQ/viewform', true);
    });

    $(document).on('click', '#versionNumber', function () { openOverlay('changeLog.html', false); });
    $(document).on('click', '#tutorialLink', function () { openOverlay('tutorial.html', false); });

    $(document).on('click', '#pageCover', function () { closeOverlay(); });

    $(document).on('click', '#emailLink', function () { openWindow('mailto:optimal.efficient@gmail.com') });

    //Clickable pieces that display the graph
    $(document).on('click', '.piece', function () { selectPiece(this); });

    //Open Overlay to Analyze Existing Piece
    $(document).on('click', '.analyzeThis', function () {
        var thisPiece = activePieceList[$(this).parent().attr("id")];

        openOverlay('https://docs.google.com/forms/d/e/1FAIpQLSfD-XMPfGGhg4i9o9D0dpZ14phqsoxE2ByLzbZg1c1SklqRVQ/viewform?usp=pp_url&entry.290029157=' + thisPiece['Title'] + '&entry.1725435401=' + thisPiece['Composer'] + '&entry.1690364591=' + thisPiece['Arranger'] + '&entry.16958485=__other_option__&entry.16958485.other_option_response=' + thisPiece['Publisher'], true);
    });

    //Navigation in Piece List
    $(document).keydown(function (e) {
        if ($(".selectedPiece")[0]) {
            if (e.keyCode == 37) { // left
                e.preventDefault();
                var newSelected = $(".selectedPiece").prev();

                if (!$(".selectedPiece").is(':first-child')) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                }
            }
            else if (e.keyCode == 39) { // right
                e.preventDefault();
                var newSelected = $(".selectedPiece").next();

                if (!$(".selectedPiece").is(':last-child')) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                }
            }
            else if (e.keyCode == 38) { // down
                e.preventDefault();
                var newSelected = $(".selectedPiece").prev().prev().prev().prev();
                if (newSelected.length) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                    $('#databasePane').scrollTop($('#databasePane').scrollTop() - 168);
                }
            }
            else if (e.keyCode == 40) { // up
                e.preventDefault();
                var newSelected = $(".selectedPiece").next().next().next().next();
                if (newSelected.length) {
                    $(".selectedPiece").removeClass("selectedPiece");
                    selectPiece(newSelected);
                    $('#databasePane').scrollTop($('#databasePane').scrollTop() + 168);
                }
            };
        };
    });

    $(document).on({
        mouseenter: function () {
            var parentPiece = activePieceList[$(this).parent().attr('id')];

            $(this).parent().prepend('<div id="infoCover"></div>');

            $('#infoCover').append('<h3 class="dataCat">States</h3>');

            for (var r = 0; r < parentPiece['Reference States'].length; r++) {
                if (parentPiece['Reference States'][r][1] > 1) {
                    $('#infoCover').append(parentPiece['Reference States'][r][0] + ' (' + parentPiece['Reference States'][r][1] + ')<br />');
                }
                else {
                    $('#infoCover').append(parentPiece['Reference States'][r][0] + '<br />');
                };
            };

            $('#infoCover').append('<h3 class="dataCat">Affiliations</h3>');

            for (var r = 0; r < parentPiece['Affiliations'].length; r++) {
                if (parentPiece['Affiliations'][r][1] > 1) {
                    $('#infoCover').append(parentPiece['Affiliations'][r][0] + ' (' + parentPiece['Affiliations'][r][1] + ')<br />');
                }
                else {
                    $('#infoCover').append(parentPiece['Affiliations'][r][0] + '<br />');
                };
            };

            if (parentPiece['Number of Analyses'] == 1) {
                $('#infoCover').append('<div class="analysisCount">' + parentPiece['Number of Analyses'] + ' Analysis' + '</div>');
            }
            else {
                $('#infoCover').append('<div class="analysisCount">' + parentPiece['Number of Analyses'] + ' Analyses' + '</div>');
            };
        },
        mouseleave: function () {
            $('#infoCover').remove();
        }
    }, '.analyzerData');
});