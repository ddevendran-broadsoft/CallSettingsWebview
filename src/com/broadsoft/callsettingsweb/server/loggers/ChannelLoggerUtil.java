/* Copyright © 2017 BroadSoft Inc. */
package com.broadsoft.callsettingsweb.server.loggers;

import com.broadsoft.callsettingsweb.server.AppConstants;
import com.broadsoft.xsp.app.base.ChannelSeverity;
import com.broadsoft.xsp.app.server.XSPBaseAppContext;

public class ChannelLoggerUtil {

	private static ApplicationChannelLogger appLogger;

	public static void initialize(XSPBaseAppContext applicationContext) {

		appLogger = (ApplicationChannelLogger) applicationContext
				.getAttribute(AppConstants.KEY_APP_APPLICATION_LOGGER);

	}

	public static ApplicationChannelLogger getLogger() {
		return appLogger;
	}

	public static boolean isLogLevelActive(String channelName,
			ChannelSeverity severity) {
		return appLogger.getLogLevel(channelName).getIntValue() <= severity
				.getIntValue();
	}

}
