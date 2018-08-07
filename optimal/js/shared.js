//----------------------------------------------------------------------------------------------------------------------------------Variables
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
	title: 'None Selected',
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
var newEnsCreated = false;
var newPieceCreated = false;
var numberOfUsers;
var timeoutCount = 0;
var loadAnimate;

//----------------------------------------------------------------------------------------------------------------------------------Math/Logic Functions
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

//function to return only 1 of each unique item in an array
function unique(array) {
	newArray = [];

	for (var ar = 0; ar < array.length; ar++) {
		if ($.inArray(array[ar], newArray) == -1) {
			newArray.push(array[ar]);
		};
	};

	return newArray;
};

//Function to count and return unique items in an array in the format [[arrayItem1, howMany1], [arrayItem2, howMany2]...
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

//Function to handle link buttons
function openWindow(url) {
	var win = window.open(url, '_blank');
	if (win) {
		win.focus();
	} else {
		alert('Please allow popups for this website');
	};
};

//----------------------------------------------------------------------------------------------------------------------------------Compatibility Functions
//Detect mobile and warn against its use
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

//Test for and handle localStorage
function lsTest(){
	var test = 'test';
	try {
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch(e) {
		return false;
	}
}

//Disable "Remember Me" button if localStorage isn't available
$(document).on('ready', function(){
	if(!lsTest()){
		$('#rememberButton').attr('disabled', 'disabled');
	};

	if (localStorage.getItem(ensVars.ensembleNameLower + 'email') !== null || localStorage.getItem(ensVars.ensembleNameLower + 'ens') !== null) {
		$('#rememberButton').addClass('forgetMe');
		document.getElementById('rememberButton').value = 'Forget Me';
		document.getElementById('userEmail').value = localStorage.getItem(ensVars.ensembleNameLower + 'email');
		document.getElementById('userEns').value = localStorage.getItem(ensVars.ensembleNameLower + 'ens');
	};
});

//----------------------------------------------------------------------------------------------------------------------------------UI Functions
//Function to clear selected piece
function clearSelectedPiece() {
	$('.selectedPiece').removeClass('selectedPiece');
	
	$('#notesPane').empty();
	currentPiece = {};
	createGraph();
	
	$('.instrument').removeClass('trueBasic');
	$('.instrument').removeClass('trueAdvanced');
	$('#numberOfPercussion').empty();
};

//Function to add "Add a new piece" buttons to beginning and end of lists
function addNewPieceButtons() {
	$('#databasePane').prepend('<div id="addPiece"><div>+</div><p>Add a new piece</p></div>');
	
	if ($('.piece').length > 0) {
		$('#databasePane').append('<div id="addPiece"><div>+</div><p>Add a new piece</p></div>');
	};
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
			
			if (callback) { callback(); };
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

//Show information about who has analyzed a piece
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

//Select a piece by clicking
function selectPiece(piece) {
	$('.selectedPiece').removeClass('selectedPiece');
	$(piece).addClass('selectedPiece');

	var idNo = $(piece).attr('id') / 1;

	currentPiece = {
		title: 'None Selected'
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

//Function to add notes to the notes pane
function addNotes(piece) {
	$('#notesPane').empty();

	if (piece['Difficulty Notes'].length == 0 && piece[ensVars.typeOfNotes].length == 0) {
		$('#notesPane').append('<div class="noNotes">No Notes Yet</div>');
	};

	for (var g = 0; g < piece['Difficulty Notes'].length; g++) {
		$('#notesPane').append('<div class="difficultyNote">' + piece['Difficulty Notes'][g] + '</div>');
	};

	for (var g = 0; g < piece[ensVars.typeOfNotes].length; g++) {
		$('#notesPane').append('<div class="instrumentationNote">' + piece[ensVars.typeOfNotes][g] + '</div>');
	};
};

//----------------------------------------------------------------------------------------------------------------------------------Tooltip Functions
//Functions to create generic tooltips
function createToolTip(element, text) {
	$(document).on({
		mouseenter: function (evt) {
			if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
				$('#toolTip').html(text);
				$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
			};
		},
		mouseleave: function () {
			$('#toolTip').css('display', 'none');
		}
	}, element);
};

function createAdvancedToolTip(hoverDiv, conditionClass, textTrue, textFalse) {
	$(document).on({
		mouseenter: function (evt) {
			if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
				if ($(hoverDiv).hasClass(conditionClass)) {
					$('#toolTip').html(textTrue);
					$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
				}
				else {
					$('#toolTip').html(textFalse);
					if ($('#toolTip').html() !== '') {
						$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
					};
				}
			};
		},
		mouseleave: function () {
			$('#toolTip').css('display', 'none');
		}
	}, hoverDiv);
};

//Button toggling tooltips
$(document).on('click', '#help', function () {
	if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
		localStorage.setItem(ensVars.ensembleNameLower + 'help', 'off');
		$(this).removeClass('on');
	} else {
		localStorage.setItem(ensVars.ensembleNameLower + 'help', 'on');
		$(this).addClass('on');
	};
	
	if ($(this).hasClass('on')) {
		$('.instrument').css('border', '2px solid ' + ensVars.ensembleColor);
		setTimeout(function () { $('.instrument').css('border', '2px solid #7D7D7D') }, 100);
		setTimeout(function () { $('.instrument').css('border', '2px solid '  + ensVars.ensembleColor) }, 200);
		setTimeout(function () { $('.instrument').css('border', '2px solid #7D7D7D') }, 300);

		$('.cLevel').css('color',  ensVars.ensembleColor);
		setTimeout(function () { $('.cLevel').css('color', 'maroon') }, 100);
		setTimeout(function () { $('.cLevel').css('color',  ensVars.ensembleColor) }, 200);
		setTimeout(function () { $('.cLevel').css('color', 'maroon') }, 300);
	};
});

//Create tooltip explaining challenge levels
$(document).on({
	mouseenter: function (evt) {
		if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
			if (this.id[2] == '1') {
				$('#toolTip').html('1 node is above your ' + ensVars.ensembleNameLower + '\'s level');
			}
			else {
				$('#toolTip').html(this.id[2] + ' nodes are above your ' + ensVars.ensembleNameLower + '\'s level');
			};
			$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
		};
	},
	mouseleave: function () {
		$('#toolTip').css('display', 'none');
	}
}, '.cLevel');

//----------------------------------------------------------------------------------------------------------------------------------Initialization Functions
//Function to re-load the list of users
function getUserList(afterFunction) {
	//userListKey variable is defined in HTML files
	Tabletop.init({ key: ensVars.userListKey,
		callback: function (data, tabletop) {
			listOfUsers = data;
			if (afterFunction) { afterFunction() };
		},
		simpleSheet: true
	});
};

//Login button function
function login(emailAttempt, ensAttempt) {
	//Verify User, Load User Information, and Draw Graph                
	var numberOfItems = listOfUsers.length;
	var userSuccess = false;
	var ensSuccess = false;

	for (var i = (numberOfItems - 1); i >= 0; i--) {
		//Check Username
		if (listOfUsers[i]['Email Address'].toUpperCase() === emailAttempt.toUpperCase()) {

			//Flag Username as Correct
			userSuccess = true;

			//Confirm Password
			if (listOfUsers[i][ensVars.ensembleName + ' Name'].toUpperCase() === ensAttempt.toUpperCase()) {
				ensSuccess = true;

				//Set Current User Info
				currentUser.user = (listOfUsers[i][ensVars.ensembleName + ' Name']);
				currentUser.elementOne = (listOfUsers[i][ensVars.ensembleName + ' Skill [Rapidity]'] / 1);
				currentUser.elementTwo = (listOfUsers[i][ensVars.ensembleName + ' Skill [Rhythm]'] / 1);
				currentUser.elementThree = (listOfUsers[i][ensVars.ensembleName +' Skill [Dynamics]'] / 1);
				currentUser.elementFour = (listOfUsers[i][ensVars.ensembleName + ' Skill [Texture]'] / 1);
				currentUser.elementFive = (listOfUsers[i][ensVars.ensembleName + ' Skill [Tonality]'] / 1);
				currentUser.elementSix = (listOfUsers[i][ensVars.ensembleName + ' Skill [Range]'] / 1);

				//Prepare Piece List and UI                    
				$('#dataPane').empty();
				$('#dataPane').append('<div class="loader"></div>');
				$('#databasePane').empty();

				loadPieces(function () {
					addGraphCanvas();					
					if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
						$('#help').addClass('on');
					};
								
					createGraph();
					$('#notesPane').empty();
					listAllPieces();
				});

				//Stop if this is a valid ensemble
				break;
			}
			else {
				if (i == 0 && !ensSuccess) {
					alert(ensVars.ensembleName + ' not Found');
				};
			}
		}
		else {
			if (i == 0 && !userSuccess) {
				alert('Email not Found');
			};
		};
	};
};

//Function to prepare the graph canvas
function addGraphCanvas() {
	$('#dataPane').empty();
	
	$('#dataPane').append('<div id="canvasContainer"></div>');
		$('#canvasContainer').append('<canvas id="myEns" width="300" height="300"></canvas>');
	$('#dataPane').append('<table id="instrumentationPane"></table>');
	$('#dataPane').append('<div id="help">?</div>');
			
	addEnsInstrumentGraph();
};

//Function to display the graph
function createGraph() {
	$('#canvasContainer').empty();
	$('#canvasContainer').append('<canvas id="myEns" width="300" height="300"></canvas>');

	var myChart = new Chart('myEns', {
		type: 'radar',
		data: {
			labels: ['Rapidity', 'Rhythm', 'Dynamics', 'Texture', 'Tonality', 'Range'],
			datasets: [
						 {
							 label: 'Selected Piece',
							 fillColor: 'rgba(440,220,320,0.4)',
							 strokeColor: 'rgba(440,220,220,1)',
							 pointColor: 'rgba(440,220,220,1)',
							 pointStrokeColor: '#fff',
							 pointHighlightFill: '#fff',
							 pointHighlightStroke: 'rgba(440,220,220,1)',
							 backgroundColor: ensVars.ensembleRGBA,
							 borderColor: ensVars.ensembleColor,
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
							 label: 'Your ' + ensVars.ensembleName,
							 fillColor: 'rgba(220,220,440,0.4)',
							 strokeColor: 'rgba(220,220,440,1)',
							 pointColor: 'rgba(220,220,440,1)',
							 pointStrokeColor: '#fff',
							 pointHighlightFill: '#fff',
							 pointHighlightStroke: 'rgba(220,220,220,1)',
							 backgroundColor: 'rgba(152,251,152,0.8)',
							 borderColor: 'palegreen',
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

//Function to clear "activePieceList" and load data from Google sheet into it
function loadPieces(afterFunction) {
	Tabletop.init({ key: ensVars.pieceListKey,
		callback: function (data, tabletop) {
			pieceList = data;
			numberOfPieces = pieceList.length;
			var g = 0;
			activePieceList = [];

			for (var i = 0; i < numberOfPieces; i++) {
				var testTwo = generatePiece(i);

				if (testTwo !== false) {
					activePieceList.push(testTwo);
					g++;
				};
			};

			numberOfPieces = activePieceList.length;
			activePieceList.sort(function (a, b) { return (a['Title'] > b['Title']) ? 1 : ((b['Title'] > a['Title']) ? -1 : 0); });
			pieceListLoading = false;

			piecesLoaded = true;
			if (afterFunction) { afterFunction(); };
		},
		simpleSheet: true
	});
};

var pieceEntriesCount = 0;

function countPieces(afterFunction) {
	Tabletop.init({ key: '1S1e9WcPa87XheaOzDrOEFwUk5oyjdCMrnNBdTWxYLug',
		callback: function (data, tabletop) {
			pieceEntriesCount = data.length;
			if (afterFunction) { afterFunction(); };
			pieceEntriesCount = 0;
		},
		simpleSheet: true
	});	
};

//Process multiples of individual pieces into one piece and create usable data for individual properties
function generatePiece(t) {
	var alreadyDone = false;
	var pieceInQuestion = false;
	
	for (var a = 0; a < t; a++) {
		if (pieceList[t]['Title'].toUpperCase() == pieceList[a]['Title'].toUpperCase() && pieceList[t]['Composer'].toUpperCase() == pieceList[a]['Composer'].toUpperCase() && pieceList[t]['Arranger'].toUpperCase() == pieceList[a]['Arranger'].toUpperCase() && pieceList[t]['Publisher'].toUpperCase() == pieceList[a]['Publisher'].toUpperCase()) {
			alreadyDone = true;
		};
	};
	
	if (!alreadyDone) {
		pieceInQuestion = {};

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
		pieceInQuestion['Difficulty Notes'] = [];
		pieceInQuestion[ensVars.typeOfNotes] = [];
		pieceInQuestion['Number of Analyses'] = 0;
		pieceInQuestion['Reference States'] = [];
		pieceInQuestion['Names'] = [];
		pieceInQuestion['Affiliations'] = [];
		pieceInQuestion['Grades'] = [];
		pieceInQuestion['Classifications'] = [];
		pieceInQuestion['Names'] = [];
		
		//Set up ensemble-specific attributes
		pieceInQuestion = setUpAttributes(pieceInQuestion);

		//For each piece, loop through each piece again
		for (var a = t; a < numberOfPieces; a++) {
			
			//If it is the same piece...
			if (pieceList[t]['Title'] == pieceList[a]['Title'] && pieceList[t]['Composer'] == pieceList[a]['Composer'] && pieceList[t]['Arranger'] == pieceList[a]['Arranger'] && pieceList[t]['Publisher'] == pieceList[a]['Publisher']) {

				pieceInQuestion['Rapidity'].push(pieceList[a][' [Rapidity]'] / 1);
				pieceInQuestion['Rhythm'].push(pieceList[a][' [Rhythm]'] / 1);
				pieceInQuestion['Dynamics'].push(pieceList[a][' [Dynamics]'] / 1);
				pieceInQuestion['Texture'].push(pieceList[a][' [Texture]'] / 1);
				pieceInQuestion['Tonality'].push(pieceList[a][' [Tonality]'] / 1);
				pieceInQuestion['Range'].push(pieceList[a][' [Range]'] / 1);
				pieceInQuestion['Number of Analyses']++;
				pieceInQuestion['Reference States'].push(pieceList[a]['Reference State']);
				pieceInQuestion['Names'].push(pieceList[a]['Your Name']);
				pieceInQuestion['Affiliations'].push(pieceList[a]['Your Affiliation']);
				pieceInQuestion['Grades'].push(pieceList[a]['Grade']);
				
				//Aggregate ensemble-specific attributes
				pieceInQuestion = aggregateAttributes(pieceInQuestion, pieceList, a);
				
				//Classifications
				var classificationList = pieceList[a]['Classification'].split(', ');
				
				for (var cp = 0; cp < classificationList.length; cp++) {
					pieceInQuestion['Classifications'].push(classificationList[cp]);
				};	
				
				//Difficulty Notes
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
				
				//Instrumentation/Voicing Notes
				if (pieceList[a][ensVars.typeOfNotes] !== '') {
					var diff = pieceList[a][ensVars.typeOfNotes];
					var diff2 = diff.split('.');

					for (var h = 0; h < (diff2.length); h++) {
						if (diff2[h] !== '') {
							var thisn = diff2[h] + '.';
							pieceInQuestion[ensVars.typeOfNotes].push(thisn);
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
		pieceInQuestion['Reference States'] = uniqueCount(pieceInQuestion['Reference States']);
		pieceInQuestion['Names'] = uniqueCount(pieceInQuestion['Names']);
		pieceInQuestion['Affiliations'] = uniqueCount(pieceInQuestion['Affiliations']);
		pieceInQuestion['Grades'] = uniqueCount(pieceInQuestion['Grades']);
		pieceInQuestion['Classifications'] = uniqueCount(pieceInQuestion['Classifications']);
		
		//Calculate ensemble-specific attributes
		pieceInQuestion = calculateAttributes(pieceInQuestion);
	};

	return pieceInQuestion;
};

//Function to display a single piece after a query
function addPiece(number, challengeLevel) {
	var loadInfo = activePieceList[number];
	$('#databasePane').append('<div id="' + number + '" class="piece"></div>');
	$('#' + number).append('<h2>' + loadInfo['Title'] + '</h1>');
	$('#' + number).append('<h3>' + loadInfo['Composer'] + '</h3>');

	if (loadInfo['Arranger'] !== '') {
		$('#' + number).append('<h3>Arranged by ' + loadInfo['Arranger'] + '</h3>');
	};
	$('#' + number).append('<h4>' + loadInfo['Publisher'] + '</h4>');

	if (challengeLevel) {
		$('#' + number).append('<p class="cLevel" id="cl' + challengeLevel + '">Challenge Level: ' + challengeLevel + '</p>');
	}

	$('#' + number).append('<p class="analyzerData">?</p>');
	$('#' + number).append('<p class="analyzeThis">Add Analysis</p>');
};

//Function to list all pieces
function listAllPieces() {
	if (piecesLoaded) {
		$('#databasePane').empty();
		clearSelectedPiece();
		for (var i = 0; i < numberOfPieces; i++) { addPiece(i); };
		addNewPieceButtons();
	};
};

//Add tooltip to help button
$(document).on('ready', function() {
	createToolTip('#help', 'Toggle help');
});

//----------------------------------------------------------------------------------------------------------------------------------Challenge, Optimal, etc.
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

function searchForPiece() {
	if (piecesLoaded) {
		//Generate Search Screen
		$('#databasePane').empty();
		clearSelectedPiece();
		$('#databasePane').append(
									'<br /><div>Search Title <input id="searchTitle" class="checkbox" type="checkbox" name="searchIn" value="Title"></div>' +
									'<br /><div>Search Composer <input id="searchComposer" class="checkbox" type="checkbox" name="searchIn" value="Composer"></div>' +
									'<br /><div>Search Arranger <input id="searchArranger" class="checkbox" type="checkbox" name="searchIn" value="Arranger"><br /></div><br />'
								);
		$('#databasePane').append('<input name="searchTerm" type="text" placeholder="search for a piece" id="searchTerm"><br />');
		$('#databasePane').append('<input type="button" name="executeSearch" value="Search" class="button" id="searchButton">');

		//When "Search" is Clicked
		$(document).on('click', '#searchButton', function () {
			searchTitle = document.getElementById('searchTitle').checked;
			searchComposer = document.getElementById('searchComposer').checked;
			searchArranger = document.getElementById('searchArranger').checked;
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

		addNewPieceButtons();
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

//----------------------------------------------------------------------------------------------------------------------------------On Initialize
$(document).ready(function () {
	//Check to see if a mobile browser is being used
	if (detectmob()) {
        alert('This site is not optimized for mobile. For best results, use your desktop or laptop.')
    };
	
	//Animate Ellipsis on Disabled "Load _____" Button
    $('#loginButton').attr('disabled', 'disabled');

    var loadAnimCount = 1;
    loadAnimate = setInterval(function () {
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
	
	getUserList(function() {
		$('#loginButton').removeAttr('disabled');
		document.getElementById('loginButton').value = 'Load ' + ensVars.ensembleName;
		clearInterval(loadAnimate);
	});
	
	//Set "?" button
	if (localStorage.getItem(ensVars.ensembleNameLower + 'help') === null) {
		localStorage.setItem(ensVars.ensembleNameLower + 'help', 'on');
	};	
});

//----------------------------------------------------------------------------------------------------------------------------------Button Presses
$(document).on('click', '#loginButton', function () { login(document.getElementById('userEmail').value.toString(), document.getElementById('userEns').value.toString()); });
	
$(document).on('click', '#rememberButton', function() {
	if ($(this).hasClass('forgetMe')) {
		$(this).removeClass('forgetMe');
		localStorage.removeItem(ensVars.ensembleNameLower + 'email');
		localStorage.removeItem(ensVars.ensembleNameLower + 'ens');
		document.getElementById('rememberButton').value = 'Remember Me';
	} else {
		if (document.getElementById('userEmail').value.toString() !== '' || document.getElementById('userEns').value.toString() !== '') {
			$(this).addClass('forgetMe');				
			localStorage.setItem(ensVars.ensembleNameLower + 'email', document.getElementById('userEmail').value.toString());
			localStorage.setItem(ensVars.ensembleNameLower + 'ens', document.getElementById('userEns').value.toString());
			document.getElementById('rememberButton').value = 'Forget Me';
		} else {
			alert('Nothing to remember!');
		};				
	};
});

$(document).on('click', '#newAccountButton', function () {
	openOverlay(ensVars.newAccountForm, true, function () {
		document.getElementById('pageContent').onload = (function () {
			$('#overlayPane').empty();
			$('#overlayPane').prepend('<div class="loaderExternal"></div>');
			$('#overlayPane').append('<p id="verifying">Verifying registration and preparing to load ' + ensVars.ensembleNameLower + '...</p>');

			function checkUntilLoaded() {			
				if (timeoutCount == 15) {
					$('#verifying').html('Something went wrong. Reload the page and try to log in. If you cannot, try again to create an account. If this fails again, contact optimal.efficient@gmail.com');
				};
				
				getUserList();

				//This checks to see if a new ensemble has been created
				if (listOfUsers.length > numberOfUsers) {
					//newEnsCreated makes sure that, if an extra Timeout event is fired, the function doesn't run twice
					if (!newEnsCreated) {
						newEnsCreated = true;
						closeOverlay();
						login(listOfUsers[listOfUsers.length - 1]['Email Address'], listOfUsers[listOfUsers.length - 1][ensVars.ensembleName + ' Name']);
						setTimeout(function () {
							newEnsCreated = false;
							timeoutCount = 0;
						}, 2000);
					};
				}
				else {
					setTimeout(function () {
						if (!newEnsCreated) {
							checkUntilLoaded();
						};
					}, 2000);
				};
				
				timeoutCount++;
			};

			setTimeout(function () { checkUntilLoaded(); }, 2000);
		});
	});
});

$(document).on('click', '#search', function () { searchForPiece(); });
$(document).on('click', '#listOptimal', function () { listOptimalPieces(); });
$(document).on('click', '#listAllPlayable', function () { listPlayablePieces(); });
$(document).on('click', '#listChallenge', function () { listChallengePieces(); });
$(document).on('click', '#listAll', function () { listAllPieces(); });

function waitForPieceChange() {
	//Get the existing number of pieces
	var oldPieceCount;
	var newPieceCount;
	
	countPieces(function(){
		oldPieceCount = pieceEntriesCount;
	});
	
	document.getElementById('pageContent').onload = (function () {
		$('#overlayPane').empty();
		$('#overlayPane').prepend('<div class="loaderExternal"></div>');
		$('#overlayPane').append('<p id="verifying">Verifying that piece was logged...</p>');

		function checkUntilLoaded() {		
			if (timeoutCount == 15) {
				$('#verifying').html('Something went wrong. Reload the page. If your piece does not appear within 10 minutes, try again to add it. If this fails again, contact optimal.efficient@gmail.com');
			};			
			
			countPieces(function(){
				newPieceCount = pieceEntriesCount;
			});
			
			//This checks to see if a new ensemble has been created
			if (newPieceCount > oldPieceCount) {
				//newPieceCreated makes sure that, if an extra Timeout event is fired, the function doesn't run twice
				if (!newPieceCreated) {
					newPieceCreated = true;
					closeOverlay();
					loadPieces(function () {
						addGraphCanvas();						
						createGraph();
						$('#notesPane').empty();
						listAllPieces();
					});
					setTimeout(function () {
						newPieceCreated = false;
						timeoutCount = 0;
					}, 2000);
				};
			}
			else {
				setTimeout(function () {
					if (!newPieceCreated) {
						checkUntilLoaded();
					};
				}, 2000);
			};
			
			timeoutCount++;			
		};

		setTimeout(function () { checkUntilLoaded(); }, 2000);
	});
};

$(document).on('click', '#addPiece', function () {
	openOverlay(ensVars.newPieceForm, true, function () {		
		waitForPieceChange();
	});
});

//Open Overlay to Analyze Existing Piece
$(document).on('click', '.analyzeThis', function () {
	var thisPiece = activePieceList[$(this).parent().attr('id')];
	openOverlay(ensVars.newPieceForm +'?usp=pp_url&entry.290029157=' + thisPiece['Title'] + '&entry.1725435401=' + thisPiece['Composer'] + '&entry.1690364591=' + thisPiece['Arranger'] + '&entry.16958485=__other_option__&entry.16958485.other_option_response=' + thisPiece['Publisher'], true, function() {
		waitForPieceChange();
	});
});

$(document).on('click', '#versionNumber', function () { openOverlay('changeLog.html', false); });
$(document).on('click', '#tutorialLink', function () { openOverlay('tutorial.html', false); });

$(document).on('click', '#newTutorial', function () { openOverlay('tutorial.html', false); });
$(document).on('click', '#browse', function () {
	$('#dataPane').empty();
	$('#dataPane').append('<div class="loader"></div>');
	$('#databasePane').empty();
				
	loadPieces(function () {
		addGraphCanvas();
		createGraph();
		$('#notesPane').empty();
		listAllPieces();
	});
});

$(document).on('click', '#pageCover', function () { closeOverlay(); });

$(document).on('click', '#emailLink', function () { openWindow('mailto:optimal.efficient@gmail.com') });

//Clickable pieces that display the graph
$(document).on('click', '.piece', function () { selectPiece(this); });

//Retrieve forgotten ensemble name
$(document).on('click', '#forgotNameButton', function () {
	var email = $('#userEmail').val().toUpperCase();
	var matched = false;
	
	if (email == '') {
		alert('Please enter an email to find associated ' + ensVars.ensembleNameLower + 's');
	} else {
		for (var sul = 0; sul < listOfUsers.length; sul++) {
			if (listOfUsers[sul]['Email Address'].toUpperCase() == email) {
				var date = listOfUsers[sul]['Timestamp'].split(' ');
				
				alert(ensVars.ensembleNameLower + ' "' + listOfUsers[sul][ensVars.ensembleName + ' Name'] + '"  was created on ' + date[0]);
				matched = true;
			};					
		};
		
		if (!matched) {
			alert('No ' + ensVars.ensembleNameLower + 's found for entered email');
		};
	};
});

//----------------------------------------------------------------------------------------------------------------------------------Filters
//Display Filters
var animating = false;
var viewingFilters = false;

$(document).on('click', '#filterBox', function() {
	if (!animating && piecesLoaded && !viewingFilters) {
		animating = true;
		viewingFilters = true;
		
		$('#filterBox').animate({ height: '160px' }, 300, function() {
			animating = false;					
		
			//State filter
			$('#filterBox').append('<select class="filter" id="stateFilter" name="stateFilter"><option value="Any State">Any State</option></select>');
			//Looks through all pieces
			for (var f = 0; f < activePieceList.length; f++) {
				//Looks through each piece's "Reserence States" array
				for (var fa = 0; fa < activePieceList[f]['Reference States'].length; fa++) {
					var stateResult = activePieceList[f]['Reference States'][fa][0];
					if ($('#stateFilter option[value="' + stateResult + '"]').length == 0){
						$('#stateFilter').append('<option value="' + stateResult + '">' + stateResult + '</option>');
					};							
				};
			};
				
			//Grade filter
			$('#filterBox').append('<select class="filter" id="gradeFilter" name="gradeFilter"><option value="Any Grade">Any Grade</option></select>');
			//Looks through all pieces
			for (var f = 0; f < activePieceList.length; f++) {
				//Looks through each piece's "Grades" array
				for (var fa = 0; fa < activePieceList[f]['Grades'].length; fa++) {
					var gradeResult = activePieceList[f]['Grades'][fa][0];
					if (($('#gradeFilter option[value="' + gradeResult + '"]').length == 0) && (gradeResult != '')){
						$('#gradeFilter').append('<option value="' + gradeResult + '">' + gradeResult + '</option>');
					};							
				};
			};
			
			//Classification filter
			$('#filterBox').append('<select class="filter" id="classificationFilter" name="classificationFilter"><option value="Any Classification">Any Classification</option></select>');
			//Looks through all pieces
			for (var f = 0; f < activePieceList.length; f++) {
				//Looks through each piece's "Classifications" array
				for (var fa = 0; fa < activePieceList[f]['Classifications'].length; fa++) {
					var classificationResult = activePieceList[f]['Classifications'][fa][0];
					if (($('#classificationFilter option[value="' + classificationResult + '"]').length == 0) && (classificationResult != '')){
						$('#classificationFilter').append('<option value="' + classificationResult + '">' + classificationResult + '</option>');
					};							
				};
			};
					
			showEnsFilters();

			$(this).append('<div id="applyFilters">Apply</div>');
			
			//Set filters based on sessionStorage
			if (sessionStorage.getItem(ensVars.ensembleNameLower + 'state') !== null) { $('#stateFilter').val(sessionStorage.getItem(ensVars.ensembleNameLower + 'state')); };
			if (sessionStorage.getItem(ensVars.ensembleNameLower + 'grade') !== null) { $('#gradeFilter').val(sessionStorage.getItem(ensVars.ensembleNameLower + 'grade')); };
			if (sessionStorage.getItem(ensVars.ensembleNameLower + 'classification') !== null) { $('#classificationFilter').val(sessionStorage.getItem(ensVars.ensembleNameLower + 'classification')); };
		});
	};
});

//Apply Filters
$(document).on('click', '#applyFilters', function(){
	$('.piece').css('display', 'unset');

	//Create "allowed" array for faster filtering
	var allowed = new Array($('.piece').length);
	allowed.fill(true);
	
	//Clear selected piece
	clearSelectedPiece();
	
	//Look through each piece for selected attributes
	for (var fil = 0; fil < $('.piece').length; fil++) {
		
		//Process state filter
		var stateValue = $('#stateFilter').val();
		
		if (allowed[fil] && (stateValue !== 'Any State')) {
			var thisPieceStates = activePieceList[$('.piece:eq(' + fil + ')').attr('id') / 1]['Reference States'];
			var allowState = false;
			
			for (var sfa = 0; sfa < thisPieceStates.length; sfa++) {
				if (thisPieceStates[sfa][0] == stateValue) {
					allowState = true;
				};
			};
			
			//Apply the filter
			if (allowState == false) {
				$('.piece:eq(' + fil + ')').css('display', 'none');
			};
		};
		
		
		//Process grade filter
		var gradeValue = $('#gradeFilter').val();
		
		if (allowed[fil] && (gradeValue !== 'Any Grade')) {
			var thisPieceGrades = activePieceList[$('.piece:eq(' + fil + ')').attr('id') / 1]['Grades'];
			var allowGrade = false;
			
			for (var sfa = 0; sfa < thisPieceGrades.length; sfa++) {
				if (thisPieceGrades[sfa][0] == gradeValue) {
					allowGrade = true;
				};
			};		
			
			//Apply the filter
			if (allowed[fil] && (allowGrade == false)) {
				$('.piece:eq(' + fil + ')').css('display', 'none');
			};
		};		

		//Process classification filter
		var classificationValue = $('#classificationFilter').val();
		
		if (classificationValue !== 'Any Classification') {		
			var thisPieceClassifications = activePieceList[$('.piece:eq(' + fil + ')').attr('id') / 1]['Classifications'];
			var allowClassification = false;
				
			for (var sfa = 0; sfa < thisPieceClassifications.length; sfa++) {
				if (thisPieceClassifications[sfa][0] == classificationValue) {
					allowClassification = true;
				};
			};
			
			//Apply the filter
			if (allowed[fil] && (allowClassification == false)) {
				$('.piece:eq(' + fil + ')').css('display', 'none');
			};
		};
		
		//Apply ensemble-unique filters 
		if (ensFilters(fil) == false) {
			$('.piece:eq(' + fil + ')').css('display', 'none');
		};
	};
	
	//Remember filters in sessionStorage
	sessionStorage.setItem(ensVars.ensembleNameLower + 'state', $('#stateFilter').val());
	sessionStorage.setItem(ensVars.ensembleNameLower + 'grade', $('#gradeFilter').val());
	sessionStorage.setItem(ensVars.ensembleNameLower + 'classification', $('#classificationFilter').val());
	
	rememberEnsFilters();
	
	//Return 'filter' button to normal
		setTimeout( function() { viewingFilters = false }, 1);
		$('#filterBox').animate({ height: '22px' }, 200);
		$('#filterBox').html('Filters');
});