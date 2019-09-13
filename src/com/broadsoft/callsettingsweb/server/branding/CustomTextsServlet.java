/* Copyright © 2017 BroadSoft Inc. */
package com.broadsoft.callsettingsweb.server.branding;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.broadsoft.callsettingsweb.server.AppConstants;
import com.broadsoft.callsettingsweb.server.loggers.ChannelLoggerUtil;
import com.broadsoft.xsp.app.base.ChannelSeverity;

public class CustomTextsServlet extends HttpServlet {

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String domain = request.getParameter("userDomain");
		String language = request.getParameter("language");
		if (ChannelLoggerUtil.isLogLevelActive(AppConstants.CALL_SETTINGS_WEB_CHANNEL, ChannelSeverity.FIELD_DEBUG)) {
			ChannelLoggerUtil.getLogger().log(ChannelSeverity.FIELD_DEBUG, "CustomTextsServlet",
					"Reading the customized texts for : " + domain + " domain for the language : " + language);
		}

		String customTexts = I18nManager.getInstance().getCustomizedLocaleTexts(domain, language);

		response.setContentType("text/html; charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(customTexts);
		response.setStatus(200);

	}

}
