//----------------------------------------------------------------------------------------------------------------------------------Variables for shared.js
var ensVars = {
	ensembleName: 'Choir',
	ensembleNameLower: 'choir',
	ensembleColor: 'lightpink',
	ensembleRGBA: 'rgba(255,182,193,0.6)',
	userListKey: '1XU227N5VXHO6vWvA5BU9hVz7wsEop0wQkCYOLiHeQj8',
	pieceListKey: '1TEqhErIfRaeyxF2pHF0AmaHO7qZvAiUpYrUPCRkV8SA',
	typeOfNotes: 'Voicing Notes',
	newAccountForm: 'https://docs.google.com/forms/d/e/1FAIpQLSe0qUGcBPa0qSSddewnG2DTsjjnxlnldfe84x9eoLZTaz85ig/viewform',
	newPieceForm: 'https://docs.google.com/forms/d/e/1FAIpQLSfD-XMPfGGhg4i9o9D0dpZ14phqsoxE2ByLzbZg1c1SklqRVQ/viewform'
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
		pieceInQuestion['Voicing Notes'] = [];
		pieceInQuestion['Number of Analyses'] = 0;
		pieceInQuestion['Reference States'] = [];
		pieceInQuestion['Names'] = [];
		pieceInQuestion['Affiliations'] = [];
		pieceInQuestion['Grades'] = [];
		pieceInQuestion['Classifications'] = [];
		pieceInQuestion['Languages'] = [];

		for (var a = t; a < numberOfPieces; a++) {		
		
			//If it is the same piece...
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
				pieceInQuestion['Grades'].push(pieceList[a]['Grade']);
				
				//Classifications
				var classificationList = pieceList[a]['Classification'].split(', ');
				
				for (var cp = 0; cp < classificationList.length; cp++) {
					pieceInQuestion['Classifications'].push(classificationList[cp]);
				};	
				
				//Languages
				var languageList = pieceList[a]['Language'].split(', ');
				
				for (var cp = 0; cp < languageList.length; cp++) {
					pieceInQuestion['Languages'].push(languageList[cp]);
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
				
				//Voicing Notes
				if (pieceList[a]['Voicing Notes'] !== '') {
					var diff = pieceList[a]['Voicing Notes'];
					var diff2 = diff.split('.');

					for (var h = 0; h < (diff2.length); h++) {
						if (diff2[h] !== '') {
							var thisn = diff2[h] + '.';
							pieceInQuestion['Voicing Notes'].push(thisn);
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
		pieceInQuestion['Grades'] = uniqueCount(pieceInQuestion['Grades']);
		pieceInQuestion['Classifications'] = uniqueCount(pieceInQuestion['Classifications']);
		pieceInQuestion['Languages'] = uniqueCount(pieceInQuestion['Languages']);
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
				'<div id="help">?</div>'
			);
};

//Function to load voicing when a piece is selected
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
	
//----------------------------------------------------------------------------------------------------------------------------------Tooltips
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

$(document).on('ready', function() {	
	createAdvancedChoirToolTip('#sopranos', 'soprano');
    createAdvancedChoirToolTip('#altos', 'alto');
    createAdvancedChoirToolTip('#tenors', 'tenor');
    createAdvancedChoirToolTip('#basses', 'bass');
});
	
//----------------------------------------------------------------------------------------------------------------------------------Filters
//Process ensemble-specific filters
function showEnsFilters() {	
	//Language filter
	$('#filterBox').append('<select class="filter" id="languageFilter" name="languageFilter"><option value="Any Language">Any Language</option></select>');
	//Looks through all pieces
	for (var f = 0; f < activePieceList.length; f++) {
		//Looks through each piece's "Languages" array
		for (var fa = 0; fa < activePieceList[f]['Languages'].length; fa++) {
			var languageResult = activePieceList[f]['Languages'][fa][0];
			if (($('#languageFilter option[value="' + languageResult + '"]').length == 0) && (languageResult != '')){
				$('#languageFilter').append('<option value="' + languageResult + '">' + languageResult + '</option>');
			};							
		};
	};
};

function ensFilters(iteration) {
	//Master 'allow' variable for ensemble-specific filters
	var allowEns = true;
	
	//When adding filters, add here, too
	var languageValue = $('#languageFilter').val();

	//Process language filter
	if (languageValue !== 'Any Language') {		
		var thisPieceLanguages = activePieceList[$('.piece:eq(' + iteration + ')').attr('id') / 1]['Languages'];
		var allowLanguage = false;
			
		for (var sfa = 0; sfa < thisPieceLanguages.length; sfa++) {
			if (thisPieceLanguages[sfa][0] == languageValue) {
				allowLanguage = true;
			};
		};
	};
	
	//Add ensemble specific filters by deleting "true" and using &&
	allowEns = (allowLanguage);
	
	//Return true or false
	return(allowEns);
};