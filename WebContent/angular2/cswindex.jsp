<!--  Copyright © 2017 BroadSoft Inc. All rights reserved. Proprietary Property of BroadSoft, Inc. Gaithersburg, MD. -->

@codeImport@

@codeFav1@

<script type="text/javascript">

var callSettingsHeroInput = @codeFav2@;
var userDomain = '@codeUserDomainAssign@'
var xsiContextPath = '@codexsiContextPathAssign@'

console.log("Data read from the JSON : "+callSettingsHeroInput);
</script>

@codeFav3@

<script type="text/javascript">
var localeCustomTexts = @codeCustomTextAssign@;
var xhttp = new XMLHttpRequest();
var isTextsLoaded = false;

(function () {
	
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    	window['customizedTexts'] = JSON.parse(this.responseText);
	    }
	    
	    isTextsLoaded = true;
	};
	xhttp.open('GET', 'customTexts?userDomain=' + userDomain + '&language=' + callSettingsHeroInput.language, true);
	xhttp.send();
	
})();


xsiActionsBaseURL = xsiContextPath;
console.log('Xsi-Actions baseURL : '+ xsiActionsBaseURL);

var customStyleUrl = '';
customStyleUrl = customStyleUrl + 'userDomain=' + userDomain;
customStyleUrl = customStyleUrl + '&platform=' + ((callSettingsHeroInput.platform != null && callSettingsHeroInput.platform != '') ? callSettingsHeroInput.platform : 'iOS_Mob');

if(callSettingsHeroInput.branding != null) {
	
	customStyleUrl = customStyleUrl + '&FontFamily=' + callSettingsHeroInput.branding.fontStyle;
	
	if(callSettingsHeroInput.branding.color != null) {
		
		var fontColors = callSettingsHeroInput.branding.color;
		for(var fontColor in fontColors) {
			if (fontColors.hasOwnProperty(fontColor)) {
				
				customStyleUrl = customStyleUrl + '&' + fontColor + '=' + ((fontColors[fontColor] == null) ? '' : fontColors[fontColor]);
				
			}
		}
	}
	
	if(callSettingsHeroInput.branding.fontSize != null) {
		
		var fontSizes = callSettingsHeroInput.branding.fontSize;
		for(var fontSize in fontSizes) {
			if (fontSizes.hasOwnProperty(fontSize)) {
				
				customStyleUrl = customStyleUrl + '&' + fontSize + '=' + ((fontSizes[fontSize] == null) ? '' : fontSizes[fontSize]);
				
			}
		}
	}
}

var customStyleUrlString = 'customStyle?' + encodeURIComponent(customStyleUrl);

(function(){
	  var newstyle = document.createElement('link');
	  newstyle.setAttribute("id", "brandedStyle");
	  newstyle.setAttribute("rel", "stylesheet");
	  newstyle.setAttribute("type", "text/css");
	  newstyle.setAttribute("href", customStyleUrlString); 
	  document.getElementsByTagName("head")[0].appendChild(newstyle);
	  
	})();

</script>

<script type="text/javascript">

(function () {
	
	window['applicationMode'] = "prod";
	window['callSettingsHeroInput'] = callSettingsHeroInput;
	window['customizedTexts'] = localeCustomTexts;
	window['xsiActionsBaseURL'] = xsiActionsBaseURL;

	// Developer mode constants
	window['devUserPwd'] = "111111";
	if(window.location.href.indexOf("brandable") > 0) {
		window['applicationMode'] = "qa";
	}
	
})();


</script>
<html>
<head>
 <meta charset="utf-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>@appName@</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<link href='assets/fonts/roboto/webfont.css' rel='stylesheet' type='text/css'>
<script src='assets/fonts/roboto/webfont.js'></script>
<link href='assets/css/default.css' rel='stylesheet' type='text/css'>

</head>

<body>
	<bsft-call-settings>Loading Call Settings...</bsft-call-settings>
	<div id="helperText" class="callsettingHelperText restrictiveLabelStyle callSettingsFontFamily"></div>
</body>

</html>


