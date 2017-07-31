/* Copyright © 2017 BroadSoft Inc. */
package com.broadsoft.callsettingsweb.server.branding;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.broadsoft.callsettingsweb.server.AppConstants;
import com.broadsoft.callsettingsweb.server.loggers.ChannelLoggerUtil;
import com.broadsoft.xsp.app.base.ChannelSeverity;
import com.broadsoft.xsp.app.base.IXSPAppContext;
import com.broadsoft.xsp.app.base.XSPAppConstants;

public class CSWAssetMapperServlet extends HttpServlet {

	private String localizationResourcePath;

	private IXSPAppContext appContext;

	public void init(ServletConfig config) throws ServletException {

		appContext = (IXSPAppContext) config.getServletContext()
				.getAttribute(XSPAppConstants.KEY_RESOURCE_XSP_APP_CONTEXT);

		localizationResourcePath = appContext.getResourceConfiguration()
				.getConfiguration(AppConstants.SYSTEM_BRANDING_CUSTOM_PATH);


	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		if(ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL, ChannelSeverity.DEV_DEBUG)) {
			ChannelLoggerUtil.getLogger().log(ChannelSeverity.DEV_DEBUG, CSWAssetMapperServlet.class.getName(),
					"CSWAssetMapperServlet invoked : " + request.getRequestURL());
		}

		String requestURI = request.getRequestURI();

		String userDomainTemp = requestURI.substring(requestURI.indexOf("assets/images/") + "assets/images/".length());
		String userDomain = userDomainTemp.indexOf("/") > 0 ? userDomainTemp.substring(0, userDomainTemp.lastIndexOf("/")) : "";
		if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL, ChannelSeverity.FIELD_DEBUG)) {
			ChannelLoggerUtil.getLogger().log(ChannelSeverity.FIELD_DEBUG, CSWAssetMapperServlet.class.getName(),
					"Gettings assets for the domain : " + userDomain);
		}
		
		String imageToBeRead = requestURI.substring(requestURI.lastIndexOf("/") + 1);
		String assetType = imageToBeRead.substring(imageToBeRead.lastIndexOf(".") + 1);
		File domainDirectory = new File(localizationResourcePath + File.separator + userDomain);
		
		if (domainDirectory.exists() && domainDirectory.isDirectory()) {
			if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL,
					ChannelSeverity.FIELD_DEBUG)) {
				ChannelLoggerUtil.getLogger().log(ChannelSeverity.FIELD_DEBUG, CSWAssetMapperServlet.class.getName(),
						"reading assets from the domain folder : "
								+ (domainDirectory + File.separator + "branding" + File.separator + "images"));
			}
			setImageResponseData(response, new File(domainDirectory + File.separator + "branding" + File.separator + "images", imageToBeRead));
			
		} else {
			if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL,
					ChannelSeverity.FIELD_DEBUG)) {
				ChannelLoggerUtil.getLogger().log(ChannelSeverity.FIELD_DEBUG, CSWAssetMapperServlet.class.getName(),
						"reading assets from the common folder");
			}
			setImageResponseData(response, new File(localizationResourcePath + File.separator + "branding" + File.separator + "images", imageToBeRead));
			
		}

		if (assetType != null && assetType.equals("png")) {
			response.setContentType("image/png");
		} else {
			response.setContentType("image/svg+xml");
		}

	}

	private void setImageResponseData(HttpServletResponse response, File fileToBeRead) {

		try {
			FileInputStream in = new FileInputStream(fileToBeRead);
			OutputStream out = response.getOutputStream();

			byte[] buf = new byte[(int)fileToBeRead.length()];
			int count = 0;
			while ((count = in.read(buf)) >= 0) {
				out.write(buf, 0, count);
			}
			out.close();
			in.close();
		} catch (IOException ioE) {

		}

	}
}
