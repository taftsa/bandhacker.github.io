//----------------------------------------------------------------------------------------------------------------------------------Variables for shared.js
var ensVars = {
	ensembleName: 'Band',
	ensembleNameLower: 'band',
	ensembleColor: 'lightblue',
	ensembleRGBA: 'rgba(173,216,230,0.6)',
	userListKey: '1Wo1RArWUmqVJ9KBjiT2W7B4Tx3KeUsy1sPYPjulcr5I',
	pieceListKey: '1vptbIS_PexH6J8N8KRm1EfJ6nj5rAKmImzLk3_j2eew',
	typeOfNotes: 'Instrumentation Notes',
	newAccountForm: 'https://docs.google.com/forms/d/e/1FAIpQLSf7CKt6BjXfYagKP9XWO74g6PdyYAiAoWhEcvCfUinXGbpcDA/viewform',
	newPieceForm: 'https://docs.google.com/forms/d/e/1FAIpQLSe5q7jbSlC4H0u8NPEeAaniK09N4vqj9ZoStJSBG3R4SQsgUQ/viewform'
};

//----------------------------------------------------------------------------------------------------------------------------------Load Data
//Functions to process ensemble-specific attributes of a piece
function setUpAttributes(onePiece) {
	onePiece['Flutes'] = [];
	onePiece['Clarinets'] = [];
	onePiece['Saxophones'] = [];
	onePiece['Oboe'] = [];
	onePiece['Bassoon'] = [];
	onePiece['Trumpets'] = [];
	onePiece['Horns'] = [];
	onePiece['Trombones'] = [];
	onePiece['Baritone'] = [];
	onePiece['Tuba'] = [];
	onePiece['Percussion'] = [];
	
	return onePiece;
};

function aggregateAttributes(onePiece, currentPieceList, iteration) {
	onePiece['Flutes'].push(currentPieceList[iteration]['Flutes']);
	onePiece['Clarinets'].push(currentPieceList[iteration]['Clarinets']);
	onePiece['Saxophones'].push(currentPieceList[iteration]['Saxophones']);
	onePiece['Oboe'].push(currentPieceList[iteration]['Oboe']);
	onePiece['Bassoon'].push(currentPieceList[iteration]['Bassoon']);
	onePiece['Trumpets'].push(currentPieceList[iteration]['Trumpets']);
	onePiece['Horns'].push(currentPieceList[iteration]['Horns']);
	onePiece['Trombones'].push(currentPieceList[iteration]['Trombones']);
	onePiece['Baritone'].push(currentPieceList[iteration]['Baritone']);
	onePiece['Tuba'].push(currentPieceList[iteration]['Tuba']);
	onePiece['Percussion'].push(currentPieceList[iteration]['Percussion'] / 1);
	
	return onePiece;
};

function calculateAttributes(onePiece) {
	onePiece['Flutes'] = findMode(onePiece['Flutes'], '1');
	onePiece['Clarinets'] = findMode(onePiece['Clarinets'], '1-2');
	onePiece['Saxophones'] = findMode(onePiece['Saxophones'], 'ATB');
	onePiece['Oboe'] = findMode(onePiece['Oboe'], 'No');
	onePiece['Bassoon'] = findMode(onePiece['Bassoon'], 'No');
	onePiece['Trumpets'] = findMode(onePiece['Trumpets'], '1-2');
	onePiece['Horns'] = findMode(onePiece['Horns'], '1');
	onePiece['Trombones'] = findMode(onePiece['Trombones'], '1');
	onePiece['Baritone'] = findMode(onePiece['Baritone'], 'Yes');
	onePiece['Tuba'] = findMode(onePiece['Tuba'], 'Yes');
	onePiece['Percussion'] = Math.ceil(findMean(onePiece['Percussion']));
	
	return onePiece;
};

//Function to add blank instrumentation pane
function addEnsInstrumentGraph() {
	$('#instrumentationPane').append('<tr>' +
			'<td id="oneFlute" class="instrument">F</td>' +
			'<td id="twoClarinets" class="instrument">C</td>' +
			'<td id="threeSaxophones" class="instrument">S</td>' +
			'<td id="oneHorn" class="instrument">H</td>' +
			'<td id="twoTrumpets" class="instrument">T</td>' +
			'<td id="oneTrombone" class="instrument">R</td>' +
			'<td id="baritone" class="instrument">B</td>' +
			'<td id="tuba" class="instrument">U</td>' +
			'<td id="sixPercussion" class="instrument">P</td>' +
		'</tr>' +
		'<tr>' +
			'<td id="moreFlutes" class="instrument">F+</td>' +
			'<td id="moreClarinets" class="instrument">C+</td>' +
			'<td id="moreSaxophones" class="instrument">S+</td>' +
			'<td id="moreHorns" class="instrument">H+</td>' +
			'<td id="moreTrumpets" class="instrument">T+</td>' +
			'<td id="moreTrombones" class="instrument">R+</td>' +
			'<td id="oboe" class="instrument">O</td>' +
			'<td id="bassoon" class="instrument">OO</td>' +
			'<td id="numberOfPercussion" class="instrument">0</td>' +
	   '</tr>');
};

//Function to load instrumentation when a piece is selected
function changeInstrumentation(piece) {
	$('.trueBasic').removeClass('trueBasic');
	$('.trueAdvanced').removeClass('trueAdvanced');

	if (piece['Flutes'] !== '0') {
		$('#oneFlute').addClass('trueBasic');
	};

	if (piece['Clarinets'] !== '0') {
		$('#twoClarinets').addClass('trueBasic');
	};

	if (piece['Saxophones'] !== 'Less than ATB') {
		$('#threeSaxophones').addClass('trueBasic');
	};

	if (piece['Horns'] !== '0') {
		$('#oneHorn').addClass('trueBasic');
	};

	if (piece['Trumpets'] !== '0') {
		$('#twoTrumpets').addClass('trueBasic');
	};

	if (piece['Trombones'] !== '0') {
		$('#oneTrombone').addClass('trueBasic');
	};

	if (piece['Percussion'] !== '0') {
		$('#sixPercussion').addClass('trueBasic');
	};

	if (piece['Baritone'] == 'Yes') {
		$('#baritone').addClass('trueBasic');
	};

	if (piece['Tuba'] == 'Yes') {
		$('#tuba').addClass('trueBasic');
	};

	if (piece['Flutes'] == '2+') {
		$('#moreFlutes').addClass('trueAdvanced');
	};

	if (piece['Clarinets'] == '3+') {
		$('#moreClarinets').addClass('trueAdvanced');
	};

	if (piece['Saxophones'] == 'AATB') {
		$('#moreSaxophones').addClass('trueAdvanced');
	};

	if (piece['Oboe'] == 'Yes') {
		$('#oboe').addClass('trueAdvanced');
	};

	if (piece['Bassoon'] == 'Yes') {
		$('#bassoon').addClass('trueAdvanced');
	};

	if (piece['Trombones'] == '2+') {
		$('#moreTrombones').addClass('trueAdvanced');
	};

	if (piece['Trumpets'] == '3+') {
		$('#moreTrumpets').addClass('trueAdvanced');
	};

	if (piece['Horns'] == '2+') {
		$('#moreHorns').addClass('trueAdvanced');
	};

	if ((piece['Percussion']) > 5) {
		$('#sixPercussion').removeClass('trueBasic');
		$('#sixPercussion').addClass('trueAdvanced');
	};

	$('#numberOfPercussion').html(piece['Percussion']);
};

//----------------------------------------------------------------------------------------------------------------------------------Tooltips
//Tooltips
$(document).on('ready', function() {
	createAdvancedToolTip('#oneFlute', 'trueBasic', 'This piece requires at least 1 flute', 'This piece can be played without flutes');
	createAdvancedToolTip('#twoClarinets', 'trueBasic', 'This piece requires at least 1-2 clarinets', 'This piece can be played without clarinets');
	createAdvancedToolTip('#threeSaxophones', 'trueBasic', 'This piece requires at least ATB saxes', 'This piece can be played with less than ATB saxes');
	createAdvancedToolTip('#oneHorn', 'trueBasic', 'This piece requires at least 1 horn', 'This piece can be played without horns');
	createAdvancedToolTip('#twoTrumpets', 'trueBasic', 'This piece requires at least 1-2 trumpets', 'This piece can be played without trumpets');
	createAdvancedToolTip('#oneTrombone', 'trueBasic', 'This piece requires at least 1 trombone', 'This piece can be played without trombones');
	createAdvancedToolTip('#baritone', 'trueBasic', 'This piece requires baritone', 'This piece can be played without baritone');
	createAdvancedToolTip('#tuba', 'trueBasic', 'This piece requires tuba', 'This piece can be played without tuba');
	createAdvancedToolTip('#oneFlute', 'trueBasic', 'This piece requires at least 1 flute', 'This piece can be played without flutes');
	createAdvancedToolTip('#moreFlutes', 'trueAdvanced', 'This piece requires 2 or more flutes', 'This piece does not require 2 or more flutes');
	createAdvancedToolTip('#moreClarinets', 'trueAdvanced', 'This piece requires 3 or more clarinets', 'This piece does not require 3 or more clarinets');
	createAdvancedToolTip('#moreSaxophones', 'trueAdvanced', 'This piece requires more than ATB saxes', 'This piece does not require more than ATB saxes');
	createAdvancedToolTip('#moreHorns', 'trueAdvanced', 'This piece requires 2 or more horns', 'This piece does not require 2 or more horns');
	createAdvancedToolTip('#moreTrumpets', 'trueAdvanced', 'This piece requires 3 or more trumpets', 'This piece does not require 3 or more trumpets');
	createAdvancedToolTip('#moreTrombones', 'trueAdvanced', 'This piece requires 2 or more trombones', 'This piece does not require 2 or more trombones');
	createAdvancedToolTip('#oboe', 'trueAdvanced', 'This piece requires oboe', 'This piece can be played without oboe');
	createAdvancedToolTip('#bassoon', 'trueAdvanced', 'This piece requires bassoon', 'This piece can be played without bassoon');
});

//Tooltip showing categorical level of number of percussionists
$(document).on({
	mouseenter: function (evt) {
		if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
			if ($('#sixPercussion').hasClass('trueBasic')) {
				$('#toolTip').html('This piece requires 1-5 percussion');
				$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
			}
			else if ($('#sixPercussion').hasClass('trueAdvanced')) {
				$('#toolTip').html('This piece requires 6 or more percussion');
				$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
			}
			else {
				$('#toolTip').html('This piece can be played without percussion');
				$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
			}
		};
	},
	mouseleave: function () {
		$('#toolTip').css('display', 'none');
	}
}, '#sixPercussion');

//Tooltip showing required number of percussion
$(document).on({
	mouseenter: function (evt) {
		if (localStorage.getItem(ensVars.ensembleNameLower + 'help') == 'on') {
			$('#toolTip').html('This piece requires ' + $('#numberOfPercussion').html() + ' percussion');
			$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
		};
	},
	mouseleave: function () {
		$('#toolTip').css('display', 'none');
	}
}, '#numberOfPercussion');

//----------------------------------------------------------------------------------------------------------------------------------Filters
//Display ensemble-specific filters
function showEnsFilters() {	
	
};

//Apply ensemble-specific filters
function ensFilters(iteration) {
	return(true);
};

//Remember ensemble-specific filters
function rememberEnsFilters() {
	
};