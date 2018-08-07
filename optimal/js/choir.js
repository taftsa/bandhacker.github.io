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
//Functions to process ensemble-specific attributes of a piece
function setUpAttributes(onePiece) {
	onePiece['Soprano'] = [];
	onePiece['Alto'] = [];
	onePiece['Tenor'] = [];
	onePiece['Bass'] = [];
	onePiece['Piano'] = [];
	onePiece['Languages'] = [];
	
	return onePiece;
};

function aggregateAttributes(onePiece, currentPieceList, iteration) {
	onePiece['Soprano'].push(currentPieceList[iteration][' [Soprano]']);
	onePiece['Alto'].push(currentPieceList[iteration][' [Alto]']);
	onePiece['Tenor'].push(currentPieceList[iteration][' [Tenor]']);
	onePiece['Bass'].push(currentPieceList[iteration][' [Bass]']);
	onePiece['Piano'].push(currentPieceList[iteration]['Piano']);
	
	//Languages
	var languageList = currentPieceList[iteration]['Language'].split(', ');
	
	for (var cp = 0; cp < languageList.length; cp++) {
		onePiece['Languages'].push(languageList[cp]);
	};
	
	return onePiece;
};

function calculateAttributes(onePiece) {
	onePiece['Soprano'] = findMode(onePiece['Soprano'], 0);
	onePiece['Alto'] = findMode(onePiece['Alto'], 0);
	onePiece['Tenor'] = findMode(onePiece['Tenor'], 0);
	onePiece['Bass'] = findMode(onePiece['Bass'], 0);
	onePiece['Piano'] = findMode(onePiece['Piano'], 'No');
	onePiece['Languages'] = uniqueCount(onePiece['Languages']);
	
	return onePiece;
};

//Function to add blank instrumentation pane
function addEnsInstrumentGraph() {
	$('#instrumentationPane').append('<tr>' +
			'<td id="sopranos" class="instrument">S</td>' +
			'<td id="altos" class="instrument">A</td>' +
			'<td id="tenors" class="instrument">T</td>' +
			'<td id="basses" class="instrument">B</td>' +
			'<td id="piano" class="instrument">P</td>' +
		'</tr>' +
		'<tr>' +
			'<td colspan="4" id="voicing" class="instrument"></td>' +
		'</tr>');
};

//Function to load voicing when a piece is selected
function changeInstrumentation(piece) {
	$('#voicing').empty();
	
	$('.instrument').removeClass('black');
	$('.instrument').removeClass('maroon');
	$('.instrument').removeClass('pink');
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
			$('#sopranos').addClass('pink');
			break;
		case 3:
			$('#sopranos').addClass('maroon');
			break;
		case 4:
			$('#sopranos').addClass('black');
			break;
		default:
			break;
	};

	switch (alto) {
		case 0:
			break;
		case 1:
			$('#altos').addClass('green');
			break;
		case 2:
			$('#altos').addClass('pink');
			break;
		case 3:
			$('#altos').addClass('maroon');
			break;
		case 4:
			$('#altos').addClass('black');
			break;
		default:
			break;
	};

	switch (tenor) {
		case 0:
			break;
		case 1:
			$('#tenors').addClass('green');
			break;
		case 2:
			$('#tenors').addClass('pink');
			break;
		case 3:
			$('#tenors').addClass('maroon');
			break;
		case 4:
			$('#tenors').addClass('black');
			break;
		default:
			break;
	};

	switch (bass) {
		case 0:
			break;
		case 1:
			$('#basses').addClass('green');
			break;
		case 2:
			$('#basses').addClass('pink');
			break;
		case 3:
			$('#basses').addClass('maroon');
			break;
		case 4:
			$('#basses').addClass('black');
			break;
		default:
			break;
	};

	switch (piece['Piano']) {
		case 'None':
			break;
		case 'Optional':
			$('#piano').addClass('pink');
			break;
		case 'Required':
			$('#piano').addClass('maroon');
			break;
		default:
			break;
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
					case $(hoverDiv).hasClass('pink'):
						$('#toolTip').html('This piece has 2 ' + part + ' parts.');
						$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
						break;
					case $(hoverDiv).hasClass('maroon'):
						$('#toolTip').html('This piece has 3 ' + part + ' parts.');
						$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
						break;
					case $(hoverDiv).hasClass('black'):
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

//Voicing tooltip
$(document).on({
	mouseenter: function (evt) {
		if ($('#voicing').html() !== "" && $('#help').hasClass('on')) {
			$('#toolTip').html('This piece has a voicing of at least ' + $('#voicing').html() + '.');
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
			if ($('#piano').hasClass('pink')) {
				$('#toolTip').html('This piece has an optional piano part.');
				$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
			}
			else if ($('#piano').hasClass('maroon')) {
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
	
//----------------------------------------------------------------------------------------------------------------------------------Filters
//Display ensemble-specific filters
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
	
	if (sessionStorage.getItem(ensVars.ensembleNameLower + 'language') !== null) { $('#languageFilter').val(sessionStorage.getItem(ensVars.ensembleNameLower + 'language')); };
};

//Apply ensemble-specific filters
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
	
	//Add ensemble specific filters by using &&
	allowEns = (allowLanguage);
	
	//Return true or false
	return(allowEns);
};

//Remember ensemble-specific filters
function rememberEnsFilters() {
	sessionStorage.setItem(ensVars.ensembleNameLower + 'language', $('#languageFilter').val());
};