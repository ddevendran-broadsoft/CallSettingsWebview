/* Copyright © 2017 BroadSoft Inc. */
package com.broadsoft.callsettingsweb.server.branding;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.broadsoft.callsettingsweb.server.AppConstants;
import com.broadsoft.callsettingsweb.server.loggers.ChannelLoggerUtil;
import com.broadsoft.callsettingsweb.server.util.ApplicationUtil;
import com.broadsoft.xsp.app.base.ChannelSeverity;
import com.broadsoft.xsp.app.base.IXSPAppContext;
import com.broadsoft.xsp.app.base.XSPAppConstants;

public class CustomStylesServlet extends HttpServlet {

	private String localizationResourcePath;

	private Map<String, String> styleDefaults = new HashMap<String, String>();

	private Map<String, String> mobFontSizeDefaults = new HashMap<String, String>(5);

	private Map<String, String> tabFontSizeDefaults = new HashMap<String, String>(5);

	private Map<String, String> dtFontSizeDefaults = new HashMap<String, String>(5);

	private String defaultFont = AppConstants.ROBOTO_FONT;

	private IXSPAppContext appContext;

	public void init(ServletConfig config) throws ServletException {

		appContext = (IXSPAppContext) config.getServletContext()
				.getAttribute(XSPAppConstants.KEY_RESOURCE_XSP_APP_CONTEXT);

		localizationResourcePath = File.separator + "var" + File.separator + "broadworks" + File.separator + "webapps"
				+ File.separator + "conf" + File.separator
				+ appContext.getAttribute(XSPAppConstants.KEY_APP_DISPLAY_NAME) + "_"
				+ (String) appContext.getAttribute(XSPAppConstants.KEY_APP_VERSION);

		styleDefaults.put(AppConstants.STYLE_CATEGORY_PRIMARY_BUTTON, AppConstants.PRIMARY_BUTTON_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_CONTENT_BACKGROUND, AppConstants.CONTENT_BACKGROUND_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_CONTROL_BACKGROUND, AppConstants.CONTROL_BACKGROUND_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_PRIMARY_BACKGROUND, AppConstants.PRIMARY_BACKGROUND_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_PRIMARY_TEXT, AppConstants.PRIMARY_TEXT_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_PRIMARY_CONTENT_TEXT, AppConstants.PRIMARY_CONTENT_TEXT_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_DIMMED_TEXT, AppConstants.DIMMED_TEXT_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_SEPARATORS, AppConstants.SEPARATORS_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_SYMBOLIC_GREEN, AppConstants.SYMBOLIC_GREEN_DEFAULT);
		styleDefaults.put(AppConstants.STYLE_CATEGORY_SYMBOLIC_RED, AppConstants.SYMBOLIC_RED_DEFAULT);

		mobFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_BUTTON_STYLE,
				AppConstants.RESTRICTIVE_BUTTON_MOB_DEFAULT);
		mobFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_LABEL_STYLE,
				AppConstants.RESTRICTIVE_LABEL_MOB_DEFAULT);
		mobFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_SMALL_LABEL_STYLE,
				AppConstants.RESTRICTIVE_SMALL_LABEL_MOB_DEFAULT);

		tabFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_BUTTON_STYLE,
				AppConstants.RESTRICTIVE_BUTTON_TAB_DEFAULT);
		tabFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_LABEL_STYLE,
				AppConstants.RESTRICTIVE_LABEL_TAB_DEFAULT);
		tabFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_SMALL_LABEL_STYLE,
				AppConstants.RESTRICTIVE_SMALL_LABEL_TAB_DEFAULT);

		dtFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_BUTTON_STYLE,
				AppConstants.RESTRICTIVE_BUTTON_DT_DEFAULT);
		dtFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_LABEL_STYLE,
				AppConstants.RESTRICTIVE_LABEL_DT_DEFAULT);
		dtFontSizeDefaults.put(AppConstants.STYLE_CATEGORY_RESTRICTIVE_SMALL_LABEL_STYLE,
				AppConstants.RESTRICTIVE_SMALL_LABEL_DT_DEFAULT);

	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String decodedURI = URLDecoder.decode(request.getQueryString(), AppConstants.UTF8_ENCODING);
		if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL, ChannelSeverity.FIELD_DEBUG)) {
			ChannelLoggerUtil.getLogger().log(ChannelSeverity.FIELD_DEBUG, CustomStylesServlet.class.getName(),
					"reading configuration from the domain folder. Decoded URI : " + decodedURI);
		}

		Map<String, String> requestParameters = getBrandedValuesFromRequest(decodedURI);

		StringBuilder cssTemplateContent = ApplicationUtil
				.getFileContent(new File(localizationResourcePath, AppConstants.CUSTOM_STYLE_TEMPLATE_FILE), AppConstants.UTF8_ENCODING);

		cssTemplateContent = setCustomColors(requestParameters, cssTemplateContent);

		cssTemplateContent = setCustomFonts(requestParameters, cssTemplateContent);

		cssTemplateContent = setCustomFontSizes(requestParameters, cssTemplateContent);

		cssTemplateContent = setCustomIconLocation(requestParameters, cssTemplateContent);

		response.getWriter().write(cssTemplateContent.toString());
		response.setContentType(AppConstants.CSS_RESPONSE_TYPE);

	}

	private Map<String, String> getBrandedValuesFromRequest(String queryString) {

		// Adding a dummy & at the last for the logic to flow for the last query
		// parameter as well. To stop the loop at the end
		queryString = queryString != null ? queryString + AppConstants.AMP_STRING : AppConstants.EMPTY_STRING;

		Map<String, String> brandedValues = new LinkedHashMap<String, String>();

		while (queryString.length() > 1) {

			String queryParam = queryString.indexOf(AppConstants.AMP_STRING) >= 0
					? queryString.substring(0, queryString.indexOf(AppConstants.AMP_STRING)) : queryString;

			if (queryParam.indexOf(AppConstants.EQUAL_TO_STRING) > 0) {

				String paramName = queryParam.substring(0, queryParam.indexOf(AppConstants.EQUAL_TO_STRING));

				String paramValue = queryParam.substring(queryParam.indexOf(AppConstants.EQUAL_TO_STRING) + 1);

				brandedValues.put(paramName, paramValue);

				queryString = queryString.substring(queryString.indexOf(AppConstants.AMP_STRING) + 1);

			}
		}

		return brandedValues;

	}

	private StringBuilder setCustomColors(Map<String, String> requestParameters, StringBuilder cssTemplateContent) {

		Set<String> stylesSet = styleDefaults.keySet();
		for (String style : stylesSet) {

			if (requestParameters.get(style) != null && !"".equals(requestParameters.get(style).trim())) {
				cssTemplateContent = new StringBuilder(
						cssTemplateContent.toString().replaceAll("<" + style + ">", requestParameters.get(style)));

			} else {
				cssTemplateContent = new StringBuilder(
						cssTemplateContent.toString().replaceAll("<" + style + ">", styleDefaults.get(style)));

			}

		}

		return cssTemplateContent;
	}

	private StringBuilder setCustomFonts(Map<String, String> requestParameters, StringBuilder cssTemplateContent) {

		cssTemplateContent = new StringBuilder(cssTemplateContent.toString().replaceAll("<FontFamily>", defaultFont));
		if (requestParameters.get("FontFamily") != null && !requestParameters.get("FontFamily").trim().equals("")) {
			cssTemplateContent = new StringBuilder(
					cssTemplateContent.toString().replaceAll("<FontFamily>", requestParameters.get("FontFamily")));

		}

		return cssTemplateContent;
	}

	private StringBuilder setCustomFontSizes(Map<String, String> requestParameters, StringBuilder cssTemplateContent) {
		String platform = requestParameters.get("platform");

		Map<String, String> platformDefaults = mobFontSizeDefaults;
		if (platform != null && platform.toLowerCase().contains("tab")) {
			platformDefaults = tabFontSizeDefaults;

		} else if (platform != null && platform.toLowerCase().contains("dt")) {
			platformDefaults = dtFontSizeDefaults;

		}

		Set<String> fontSizeKeySet = platformDefaults.keySet();
		for (String fontSizeName : fontSizeKeySet) {

			if (requestParameters.get(fontSizeName) != null && !requestParameters.get(fontSizeName).trim().equals("")) {
				cssTemplateContent = new StringBuilder(cssTemplateContent.toString()
						.replaceAll("<" + fontSizeName + ">", requestParameters.get(fontSizeName)));

			} else {
				cssTemplateContent = new StringBuilder(cssTemplateContent.toString()
						.replaceAll("<" + fontSizeName + ">", platformDefaults.get(fontSizeName)));

			}
		}

		return cssTemplateContent;
	}

	private StringBuilder setCustomIconLocation(Map<String, String> requestParameters,
			StringBuilder cssTemplateContent) {

		cssTemplateContent = new StringBuilder(cssTemplateContent.toString().replaceAll("<customImagesLocation>",
				"assets/images/" + requestParameters.get("userDomain")));

		return cssTemplateContent;
	}

	
	  public static void main(String args[]) {
	  
		String queryString = "userDomain=10.99.4.110&platform=android_Mob&FontFamily=Roboto&PrimaryButton=#2DBD9B&ContentBackground=#ffffff&ControlBackground=#F8F8F8&PrimaryBackground=#2DBD9B&PrimaryText=#FFFFFF&PrimaryContentText=#323232&DimmedText=#b4b4b4&Separators=#f0f0f0&SymbolicGreen=#2DBD9B&SymbolicRed=#ff3347&RestrictiveSmallLabelStyle=10&RestrictiveButtonStyle=14&RestrictiveLabelStyle=12";

		CustomStylesServlet servlet = new CustomStylesServlet();
		Map<String, String> brandableValues = servlet.getBrandedValuesFromRequest(queryString);
		System.out.println(brandableValues.size());
		
		System.out.println(brandableValues.get("userDomain"));
	}
	 
}
