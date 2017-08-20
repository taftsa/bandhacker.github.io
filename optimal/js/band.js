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
//Function to check if a piece has multiple entries; returns aggregated piece if the piece hasn't already been processed
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
		pieceInQuestion['Flutes'] = [];
		pieceInQuestion['Clarinets'] = [];
		pieceInQuestion['Saxophones'] = [];
		pieceInQuestion['Oboe'] = [];
		pieceInQuestion['Bassoon'] = [];
		pieceInQuestion['Trumpets'] = [];
		pieceInQuestion['Horns'] = [];
		pieceInQuestion['Trombones'] = [];
		pieceInQuestion['Baritone'] = [];
		pieceInQuestion['Tuba'] = [];
		pieceInQuestion['Percussion'] = [];
		pieceInQuestion['Difficulty Notes'] = [];
		pieceInQuestion['Instrumentation Notes'] = [];
		pieceInQuestion['Number of Analyses'] = 0;
		pieceInQuestion['Reference States'] = [];
		pieceInQuestion['Names'] = [];
		pieceInQuestion['Affiliations'] = [];
		pieceInQuestion['Grades'] = [];
		pieceInQuestion['Classifications'] = [];

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
				pieceInQuestion['Flutes'].push(pieceList[a]['Flutes']);
				pieceInQuestion['Clarinets'].push(pieceList[a]['Clarinets']);
				pieceInQuestion['Saxophones'].push(pieceList[a]['Saxophones']);
				pieceInQuestion['Oboe'].push(pieceList[a]['Oboe']);
				pieceInQuestion['Bassoon'].push(pieceList[a]['Bassoon']);
				pieceInQuestion['Trumpets'].push(pieceList[a]['Trumpets']);
				pieceInQuestion['Horns'].push(pieceList[a]['Horns']);
				pieceInQuestion['Trombones'].push(pieceList[a]['Trombones']);
				pieceInQuestion['Baritone'].push(pieceList[a]['Baritone']);
				pieceInQuestion['Tuba'].push(pieceList[a]['Tuba']);
				pieceInQuestion['Percussion'].push(pieceList[a]['Percussion'] / 1);
				pieceInQuestion['Number of Analyses']++;
				pieceInQuestion['Reference States'].push(pieceList[a]['Reference State']);
				pieceInQuestion['Names'].push(pieceList[a]['Your Name']);
				pieceInQuestion['Affiliations'].push(pieceList[a]['Your Affiliation']);
				pieceInQuestion['Grades'].push(pieceList[a]['Grade']);
				
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
				
				//Instrumentation Notes
				if (pieceList[a]['Instrumentation Notes'] !== '') {
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
		pieceInQuestion['Flutes'] = findMode(pieceInQuestion['Flutes'], '1');
		pieceInQuestion['Clarinets'] = findMode(pieceInQuestion['Clarinets'], '1-2');
		pieceInQuestion['Saxophones'] = findMode(pieceInQuestion['Saxophones'], 'ATB');
		pieceInQuestion['Oboe'] = findMode(pieceInQuestion['Oboe'], 'No');
		pieceInQuestion['Bassoon'] = findMode(pieceInQuestion['Bassoon'], 'No');
		pieceInQuestion['Trumpets'] = findMode(pieceInQuestion['Trumpets'], '1-2');
		pieceInQuestion['Horns'] = findMode(pieceInQuestion['Horns'], '1');
		pieceInQuestion['Trombones'] = findMode(pieceInQuestion['Trombones'], '1');
		pieceInQuestion['Baritone'] = findMode(pieceInQuestion['Baritone'], 'Yes');
		pieceInQuestion['Tuba'] = findMode(pieceInQuestion['Tuba'], 'Yes');
		pieceInQuestion['Percussion'] = Math.ceil(findMean(pieceInQuestion['Percussion']));
		pieceInQuestion['Reference States'] = uniqueCount(pieceInQuestion['Reference States']);
		pieceInQuestion['Names'] = uniqueCount(pieceInQuestion['Names']);
		pieceInQuestion['Affiliations'] = uniqueCount(pieceInQuestion['Affiliations']);
		pieceInQuestion['Grades'] = uniqueCount(pieceInQuestion['Grades']);
		pieceInQuestion['Classifications'] = uniqueCount(pieceInQuestion['Classifications']);
	};

	return pieceInQuestion;
};

//Function to add canvas for graph and blank instrumentation pane
function addGraphCanvas() {
	$('#dataPane').empty();
	$('#dataPane').append(
			'<div id="canvasContainer">' +
				'<canvas id="myEns" width="300" height="300"></canvas>' +
			'</div>' +
			'<table id="instrumentationPane">' +
				'<tr>' +
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
			   '</tr>' +
			'</table>' +
			'<div id="help">?</div> '
			);
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
//Process ensemble-specific filters

function showEnsFilters() {	
	
};

function ensFilters(iteration) {
	return(true);
};