$(document).ready(function() {
	$('#topMenu').append('<div id="info"><span id="versionNumber">Version 1.4.3b</span><br />&copy; TEST Seth Taft<br /><span id="emailLink">optimal.efficient@gmail.com</span></div>');
	
	$('body').append('<div id="optionsMenu"></div>');
		$('#optionsMenu').append('<div class="menuOption a m" id="search">Search');
		$('#optionsMenu').append('</div><div class="menuOption b" id="listOptimal">List Optimal');
		$('#optionsMenu').append('</div><div class="menuOption a" id="listAllPlayable">List Performable');
		$('#optionsMenu').append('</div><div class="menuOption b" id="listChallenge">List Challenging');
		$('#optionsMenu').append('</div><div class="menuOption a" id="listAll">List All');
		$('#optionsMenu').append('</div><div class="menuOption b" id="filterBox">Filters');
		$('#optionsMenu').append('</div><div class="menuOption a" id="tutorialLink">Tutorial');
		$('#optionsMenu').append('</div>');
	
	$('body').append('<div id="leftPane"></div>');
		$('#leftPane').append('<div id="dataPane"></div>');
			$('#dataPane').append('<div id="buffer"></div>');
			$('#dataPane').append('<form id="loginForm" autocomplete="on"></form>');
				$('#loginForm').append('<input name="userEmail" type="text" placeholder="email" id="userEmail">');
				$('#loginForm').append('<input name="userEnsName" type="text" placeholder="' + ensVars.ensembleNameLower + ' name" id="userEns">');
				$('#loginForm').append('<input type="button" name="login" value="Loading." class="button" id="loginButton">');
				$('#loginForm').append('<input type="button" name="remember" value="Remember Me" class="button" id="rememberButton">');
				$('#loginForm').append('<input type="button" name="newAccount" value="New ' + ensVars.ensembleName + '" class="button" id="newAccountButton">');
				$('#loginForm').append('<input type="button" name="forgotName" value="Forgot ' + ensVars.ensembleName + ' Name" class="button" id="forgotNameButton">');

		$('#leftPane').append('<div id="notesPane"></div>');
	
	$('body').append('<div id="databasePane"></div>');
		$('#databasePane').append('<div id="intro">New?</div>');
		$('#databasePane').append('<div class="introButton" id="newTutorial">Click here to check out the tutorial<br />(it\'s also in the menu bar)</div>');
		$('#databasePane').append('<div class="introButton" id="browse">Click here to browse pieces without logging in<br />(you\'ll need to refresh to log in)</div>');      
	
	$('body').append('<div id="toolTip"></div>');
});
