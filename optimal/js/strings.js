//----------------------------------------------------------------------------------------------------------------------------------Variables for shared.js
var ensVars = {
	ensembleName: 'Orch.',
	ensembleNameLower: 'orch',
	ensembleColor: 'gold',
	ensembleRGBA: 'rgba(255,215,0,0.6)',
	userListKey: '1oQ0hKPKwKQL50w_4n45OwGRydOSxiUQZUI7K9_yq89I',
	pieceListKey: '1S1e9WcPa87XheaOzDrOEFwUk5oyjdCMrnNBdTWxYLug',
	typeOfNotes: 'Instrumentation Notes',
	newAccountForm: 'https://docs.google.com/forms/d/e/1FAIpQLSdZUcsVlObflsIfz3obCMCcAdY7RFDXLkNznhp3cpT4zTuK5g/viewform',
	newPieceForm: 'https://docs.google.com/forms/d/e/1FAIpQLSe2YeJGsfFOhGu8BBi-vVq1JB-6HMHpuHR-xHNM9HaZL7a_3w/viewform'
};

//----------------------------------------------------------------------------------------------------------------------------------Load Data
//Functions to process ensemble-specific attributes of a piece
function setUpAttributes(onePiece) {
	onePiece['Violin 1'] = [];
	onePiece['Violin 2'] = [];
	onePiece['Viola'] = [];
	onePiece['Cello'] = [];
	onePiece['Bass'] = [];
	
	return onePiece;
};

function aggregateAttributes(onePiece, currentPieceList, iteration) {
	onePiece['Violin 1'].push(currentPieceList[iteration][' [Violin 1]']);
	onePiece['Violin 2'].push(currentPieceList[iteration][' [Violin 2]']);
	onePiece['Viola'].push(currentPieceList[iteration][' [Viola]']);
	onePiece['Cello'].push(currentPieceList[iteration][' [Cello]']);
	onePiece['Bass'].push(currentPieceList[iteration][' [Bass]']);
	
	return onePiece;
};

function calculateAttributes(onePiece) {
	onePiece['Violin 1'] = findMode(onePiece['Violin 1'], 'As difficult as the other parts');
	onePiece['Violin 2'] = findMode(onePiece['Violin 2'], 'As difficult as the other parts');
	onePiece['Viola'] = findMode(onePiece['Viola'], 'As difficult as the other parts');
	onePiece['Cello'] = findMode(onePiece['Cello'], 'As difficult as the other parts');
	onePiece['Bass'] = findMode(onePiece['Bass'], 'As difficult as the other parts');
	
	return onePiece;
};

//Function to add blank instrumentation pane
function addEnsInstrumentGraph() {
	$('#instrumentationPane').append('<tr>' +
			'<td id="violinOne" class="instrument">V1</td>' +
			'<td id="violinTwo" class="instrument">V2</td>' +
			'<td id="viola" class="instrument">Va</td>' +
			'<td id="cello" class="instrument">C</td>' +
			'<td id="bass" class="instrument">B</td>' +
		'</tr>');
};

//Function to load voicing when a piece is selected
function changeInstrumentation(piece) {
$('.instrument').removeClass('trueEasy');
	$('.instrument').removeClass('trueBasic');
	$('.instrument').removeClass('trueAdvanced');

	var violinOne = piece['Violin 1'];
	var violinTwo = piece['Violin 2'];
	var viola = piece['Viola'];
	var cello = piece['Cello'];
	var bass = piece['Bass'];

	switch (violinOne) {
		case 'No part':
			break;
		case 'Less difficult than the other parts':
			$('#violinOne').addClass('trueEasy');
			break;
		case 'As difficult as the other parts':
			$('#violinOne').addClass('trueBasic');
			break;
		case 'More difficult than the other parts':
			$('#violinOne').addClass('trueAdvanced');
			break;
		default:
			break;
	};

	switch (violinTwo) {
		case 'No part':
			break;
		case 'Less difficult than the other parts':
			$('#violinTwo').addClass('trueEasy');
			break;
		case 'As difficult as the other parts':
			$('#violinTwo').addClass('trueBasic');
			break;
		case 'More difficult than the other parts':
			$('#violinTwo').addClass('trueAdvanced');
			break;
		default:
			break;
	};
	
	switch (viola) {
		case 'No part':
			break;
		case 'Less difficult than the other parts':
			$('#viola').addClass('trueEasy');
			break;
		case 'As difficult as the other parts':
			$('#viola').addClass('trueBasic');
			break;
		case 'More difficult than the other parts':
			$('#viola').addClass('trueAdvanced');
			break;
		default:
			break;
	};
	
	switch (cello) {
		case 'No part':
			break;
		case 'Less difficult than the other parts':
			$('#cello').addClass('trueEasy');
			break;
		case 'As difficult as the other parts':
			$('#cello').addClass('trueBasic');
			break;
		case 'More difficult than the other parts':
			$('#cello').addClass('trueAdvanced');
			break;
		default:
			break;
	};
	
	switch (bass) {
		case 'No part':
			break;
		case 'Less difficult than the other parts':
			$('#bass').addClass('trueEasy');
			break;
		case 'As difficult as the other parts':
			$('#bass').addClass('trueBasic');
			break;
		case 'More difficult than the other parts':
			$('#bass').addClass('trueAdvanced');
			break;
		default:
			break;
	};
};
	
//----------------------------------------------------------------------------------------------------------------------------------Tooltips
function createAdvancedStringsToolTip(hoverDiv, part) {
	$(document).on({
		mouseenter: function (evt) {
			if ($('#help').hasClass('on')) {
				switch (true) {
					case $(hoverDiv).hasClass('trueEasy'):
						$('#toolTip').html('The ' + part + ' part for this piece is easier than the other parts.');
						$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
						break;
					case $(hoverDiv).hasClass('trueBasic'):
						$('#toolTip').html('The ' + part + ' part for this piece is about as hard as the other parts.');
						$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
						break;
					case $(hoverDiv).hasClass('trueAdvanced'):
						$('#toolTip').html('The ' + part + ' part for this piece is harder than the other parts.');
						$('#toolTip').css({ 'top': evt.pageY, 'left': evt.pageX + 20, 'display': 'block' }).fadeIn();
						break;
					default:
						$('#toolTip').html('This piece has no ' + part + ' part.');
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
	createAdvancedStringsToolTip('#violinOne', 'first violin');
    createAdvancedStringsToolTip('#violinTwo', 'second violin');
    createAdvancedStringsToolTip('#viola', 'viola');
    createAdvancedStringsToolTip('#cello', 'cello');
	createAdvancedStringsToolTip('#bass', 'bass');
});
	
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