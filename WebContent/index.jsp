<%@page import="java.io.BufferedReader,java.io.InputStreamReader"%>
<%@page import="java.lang.Exception"%>
<%@page import="com.broadsoft.callsettingsweb.server.branding.I18nManager"%>
<%@page import="com.broadsoft.callsettingsweb.server.loggers.ChannelLoggerUtil"%>
<%@page import="com.broadsoft.callsettingsweb.server.util.ApplicationUtil"%>
<%@page import="com.broadsoft.xsp.app.base.ChannelSeverity"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="com.broadsoft.callsettingsweb.server.AppConstants"%>

<script type="text/javascript">

console.log(localStorage.getItem("devMode"));
console.log(JSON.parse(localStorage.getItem("heroApplicationInput")));
var applicationMode = localStorage.getItem("devMode");
var callSettingsHeroInput;
if(applicationMode != null && applicationMode == "true") {
	callSettingsHeroInput = JSON.parse(localStorage.getItem("heroApplicationInput"));
	console.log("applicationMode is dev");
} else {
	
	console.log("applicationMode is not dev");
	<%
	
	ChannelLoggerUtil.getLogger().log(ChannelSeverity.INFO, "Request Method : " + request.getMethod());
	ChannelLoggerUtil.getLogger().log(ChannelSeverity.INFO, "Request Content Type : " + request.getContentType());
	ChannelLoggerUtil.getLogger().log(ChannelSeverity.INFO, "Request Content Length : " + request.getContentLength());
	ChannelLoggerUtil.getLogger().log(ChannelSeverity.INFO, "Request URI : " + request.getRequestURL());
	
	for(Cookie cooki : request.getCookies()) {
		ChannelLoggerUtil.getLogger().log(ChannelSeverity.INFO, "Cookie name : " + cooki.getName() + " , Cookie value : " + cooki.getValue());
	}
	
	if(!(request.getMethod().equals("POST") && request.getContentLength() > 0) ) {
		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		out.println("Invalid request received from the application. Please check the request method and request content.");
		return;
	}
	
			String heroApplicationInput = "";
			String customizationTexts = "";
			String locale = "";
			try {
				
				StringBuilder buffer = new StringBuilder();
				BufferedReader reader = request.getReader();
				String line;
				while ((line = reader.readLine()) != null) {
					buffer.append(line);
				}

				heroApplicationInput = buffer.toString();
				System.out.println("Input read from POST request data : " + heroApplicationInput);

			} catch (Exception ex) {
				ex.printStackTrace();
				ChannelLoggerUtil.getLogger().log(ChannelSeverity.WARN, "Exception occurred in reading the application input data." );
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				return;
			}
			
			
	%>

	callSettingsHeroInput = "<%= heroApplicationInput %>";
	
	
}
console.log("Data read from the JSON : "+callSettingsHeroInput);
console.log(callSettingsHeroInput.xsp);

var customStyleUrlString = 'callsettings/customStyle?' + encodeURIComponent(customStyleUrl);

(function(){
	  var newstyle = document.createElement('link');
	  newstyle.setAttribute("id", "brandedStyle");
	  newstyle.setAttribute("rel", "stylesheet");
	  newstyle.setAttribute("type", "text/css");
	  newstyle.setAttribute("href", customStyleUrlString); 
	  document.getElementsByTagName("head")[0].appendChild(newstyle);
	  
	})();

	 

</script>


	<%
	
		try {
			JSONObject jsonObject = JSONObject.fromObject(heroApplicationInput);
		
			locale = jsonObject.get("locale").toString();
			localStorage.setItem('locale','${locale}');
			String userId = jsonObject.get("userId").toString();
			
			customizationTexts = I18nManager.getInstance().getCustomizedLocaleTexts(userId, locale);
			
		} catch (Exception ex) {
			ex.printStackTrace();
			ChannelLoggerUtil.getLogger().log(ChannelSeverity.WARN, "Exception occurred in reading the cutomization texts." );
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			return;
		}
	
	%>



var customizedTexts = "<%= customizationTexts %>";
var localeCustomTexts = JSON.parse(customizedTexts);
var locale = "<%= locale %>";

<html>
<head>
 <meta charset="utf-8">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>WebCallSettings</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href='assets/css/default.css' rel='stylesheet' type='text/css'>
</head>
<body>
	<app-bsft-call-settings></app-bsft-call-settings>
</body>
</html>
