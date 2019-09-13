/* Copyright © 2017 BroadSoft Inc. */
package com.broadsoft.callsettingsweb.server;

import java.io.File;
import java.util.logging.Level;

import javax.servlet.ServletContextEvent;

import com.broadsoft.callsettingsweb.server.branding.I18nManager;
import com.broadsoft.callsettingsweb.server.loggers.ApplicationChannelLogger;
import com.broadsoft.callsettingsweb.server.loggers.CallSettingsWebDevLogger;
import com.broadsoft.callsettingsweb.server.loggers.CallSettingsWebLogger;
import com.broadsoft.callsettingsweb.server.loggers.ChannelLoggerUtil;
import com.broadsoft.callsettingsweb.server.util.ApplicationUtil;
import com.broadsoft.http.apache.ThreadsafeClientHttpManager;
import com.broadsoft.http.interfaces.IHttpCallBack;
import com.broadsoft.xsp.BwLogger.Severity;
import com.broadsoft.xsp.app.base.ChannelSeverity;
import com.broadsoft.xsp.app.base.IXSPAppConfiguration;
import com.broadsoft.xsp.app.base.XSPAppConstants;
import com.broadsoft.xsp.app.server.XSPAppServletContextListener;
import com.broadsoft.xsp.app.server.XSPBaseAppContext;

public class CallSettingsWebServletContextListener extends XSPAppServletContextListener {

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.broadsoft.xsp.app.server.XSPAppServletContextListener#
	 * getApplicationName()
	 */
	@Override
	protected String getApplicationName() {
		return "BWCallSettingsWeb";
	}

	/**
	 * Notification that the web application is ready to process requests.
	 * 
	 * @param event
	 *            This is the event class for notifications about changes to the
	 *            servlet context of a web application.
	 */
	public void contextInitialized(ServletContextEvent event) {
		super.contextInitialized(event);

		ChannelLoggerUtil.initialize(appContext);
		
		ApplicationUtil.setAppContext(appContext);
		
		I18nManager.getInstance().init(appContext);
		
		ThreadsafeClientHttpManager xsiThreadsafeClientHttpManager = (ThreadsafeClientHttpManager) ThreadsafeClientHttpManager
				.getInstance(appContext.getResourceConfiguration().getProperties());

		xsiThreadsafeClientHttpManager.setCallBack(new IHttpCallBack() {

			@Override
			public void log(Level level, String message) {
				ChannelLoggerUtil.getLogger().logHttpChannel(ChannelSeverity.convertToChannelSeverity(level),
						"XSI:HTTP Client Layer : \n" + message);

			}
		});
		appContext.setAttribute(AppConstants.RESOURCE_KEY_XSI_HTTP_MANAGER, xsiThreadsafeClientHttpManager);
		
		appContext.log(Severity.INFO, "BwServletContextListener",
				"Context Initialization Done for " + getApplicationName());
	}

	/*
	 * Sets the defautl settigns for BWOCTabs web applicaiton. (non-Javadoc)
	 * 
	 * @seecom.broadsoft.xsp.app.server.XSPAppServletContextListener#
	 * setDefaultApplicationConfiguration
	 * (com.broadsoft.xsp.app.base.IXSPAppConfiguration)
	 */
	@Override
	protected void setDefaultApplicationConfiguration(IXSPAppConfiguration configuration) {
		super.setDefaultApplicationConfiguration(configuration);
		
		configuration.setConfiguration(AppConstants.SYSTEM_GENERAL_XSI_ACTIONS_CONTEXT_URL, "/com.broadsoft.xsi-actions");
		
		configuration.setConfiguration(AppConstants.SYSTEM_BRANDING_CUSTOM_PATH,
				File.separator + "var" + File.separator + "broadworks" + File.separator + "webapps" + File.separator
				+ "conf" + File.separator + appContext.getAttribute(XSPAppConstants.KEY_APP_DISPLAY_NAME) + "_"
				+ (String) appContext.getAttribute(XSPAppConstants.KEY_APP_VERSION));
	}
		
	/*
	 * (non-Javadoc)
	 * 
	 * @seecom.broadsoft.xsp.app.server.XSPAppServletContextListener#
	 * postReadApplicationConfiguration
	 * (com.broadsoft.xsp.app.base.IXSPAppConfiguration)
	 */
	@Override
	protected void postReadApplicationConfiguration(IXSPAppConfiguration configuration) {

		super.postReadApplicationConfiguration(configuration);
		String logFileName = "CallSettingsWebLog";
		String appVersion = getApplicationVersion();
		if (appVersion != null && !appVersion.trim().isEmpty()) {
			logFileName = "CallSettingsWebLog_" + appVersion + ".log";
		}
		configuration.setConfiguration("bwLogger.webapp.logFileName",
				logFileName);

	}
	
	@Override
	protected void initializeApplicationLogger(XSPBaseAppContext appContext) {
		ApplicationChannelLogger logger;
		if (appContext.isDevEnvironmentLoggingEnabled()
				|| !appContext.isLogConfigEnabled()) {
			logger = new CallSettingsWebDevLogger(appContext);

		} else {
			logger = new CallSettingsWebLogger(appContext);
		}
		appContext
				.setAttribute(AppConstants.KEY_APP_APPLICATION_LOGGER, logger);
	}

	/**
	 * Notification that the servlet context is about to be shut down.
	 * 
	 * @param event
	 *            This is the event class for notifications about changes to the
	 *            servlet context of a web application.
	 */
	public void contextDestroyed(ServletContextEvent event) {

		appContext.log(Severity.INFO, "BwServletContextListener", "Shut Down started for " + getApplicationName());

		super.contextDestroyed(event);
	}

}
