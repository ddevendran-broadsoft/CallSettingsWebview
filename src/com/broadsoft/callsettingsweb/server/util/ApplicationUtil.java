/* Copyright © 2017 BroadSoft Inc. */
package com.broadsoft.callsettingsweb.server.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.http.HttpServletRequest;

import com.broadsoft.callsettingsweb.server.AppConstants;
import com.broadsoft.callsettingsweb.server.loggers.ChannelLoggerUtil;
import com.broadsoft.http.interfaces.IHttpManager;
import com.broadsoft.xsp.app.base.ChannelSeverity;
import com.broadsoft.xsp.app.base.IXSPAppConfiguration;
import com.broadsoft.xsp.app.base.IXSPAppContext;
import com.broadsoft.xsp.app.base.XSPAppConstants;

public class ApplicationUtil {

	private static IXSPAppContext appContext = null;

	// private static LocalizationCache cacheLocal =
	// LocalizationCache.getInstance();
	public static IXSPAppContext getContext() {
		return appContext;
	}

	public static void setAppContext(IXSPAppContext context) {
		ApplicationUtil.appContext = context;
		
	}
	
	public static IHttpManager getXsiHttpManager(){
		return (IHttpManager)appContext.getAttribute(AppConstants.RESOURCE_KEY_XSI_HTTP_MANAGER);
	}

	public static IXSPAppConfiguration getConfigurationManager(){
		return (IXSPAppConfiguration)appContext.getResourceConfiguration();
	}
	public static String getStackTrace(Throwable t) {
		StringWriter out = new StringWriter();
		t.printStackTrace(new PrintWriter(out));
		return out.toString();
	}
	
	public static boolean isEmptyString(String data) {
		return (data == null) || (data.trim().length()==0);
	}
	
	public static String getDomainForRequest(HttpServletRequest request) {

		String domainValue = null;

		String hostInfo = request.getHeader("X-Forwarded-Host");
		if (hostInfo != null) {
			domainValue = hostInfo;

		} else {

			String refererURL = request.getHeader("referer") != null ? request.getHeader("referer")
					: request.getRequestURL().toString();
			domainValue = refererURL.substring(0, refererURL.indexOf(request.getContextPath().toString()));
			if(domainValue.contains("http://")) {
				domainValue = domainValue.substring(7);
			} else { // this else part is to substring if the domain value containts an https
				domainValue = domainValue.substring(8);
			}
			
			if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL, ChannelSeverity.DEV_DEBUG)) {
				ChannelLoggerUtil.getLogger().log(ChannelSeverity.DEV_DEBUG,
						"getDomainForRequest domainValue : " + domainValue);
			}
			if(domainValue.endsWith("/")) {
				domainValue = domainValue.substring(0, domainValue.length()-1);
			}
		}

		return domainValue;
	}
	
	public static String getXsiContextPathOrUrl(HttpServletRequest request) {
		
		String xsiContextPath = "";
			
		xsiContextPath = appContext.getResourceConfiguration()
				.getConfiguration(AppConstants.SYSTEM_GENERAL_XSI_ACTIONS_CONTEXT_URL);
		if(!xsiContextPath.startsWith("http") && !xsiContextPath.startsWith("/")) {
			xsiContextPath = "/" + xsiContextPath;
		}
		
		return xsiContextPath;
	}
	
	public static String readJSONForAppTest() {
		
		String localizationResourcePath = File.separator + "var" + File.separator + "broadworks" + File.separator + "webapps"
				+ File.separator + "conf" + File.separator
				+ appContext.getAttribute(XSPAppConstants.KEY_APP_DISPLAY_NAME) + "_"
				+ (String) appContext.getAttribute(XSPAppConstants.KEY_APP_VERSION);
		
		StringBuilder readJson = getFileContent(new File(localizationResourcePath, "cswinput.json"), "UTF8");
		
		ChannelLoggerUtil.getLogger().log(ChannelSeverity.DEV_DEBUG, "cswinput.json input read from the file : "+readJson);
		
		return readJson == null ? "" : readJson.toString();
		
	}
	
	public static StringBuilder getFileContent(File fileToBeRead, String fileEncoding) {
		
		if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL, ChannelSeverity.DEV_DEBUG)) {
			ChannelLoggerUtil.getLogger().log(ChannelSeverity.DEV_DEBUG,
					"File to be read : " + fileToBeRead.getAbsolutePath() + " exists ? : " + fileToBeRead.exists());
		}
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();
		try {
			if(fileEncoding != null && fileEncoding.length() > 0) {
				br = new BufferedReader(new InputStreamReader(new FileInputStream(fileToBeRead), fileEncoding));
			} else {
				br = new BufferedReader(new InputStreamReader(new FileInputStream(fileToBeRead)));
			}

			sb = new StringBuilder();
			String line = br.readLine();
			
			while (line != null) {
				sb.append(line);
				sb.append(System.lineSeparator());
				line = br.readLine();
				
			}
		} catch (FileNotFoundException fnfE) {

		} catch (IOException ioE) {

		} finally {
			/*
			 * if (br != null) { br.close(); }
			 */
		}

		return sb;
	}

}