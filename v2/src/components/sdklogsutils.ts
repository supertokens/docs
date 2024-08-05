import { CookieHandlerInput } from 'supertokens-website/lib/build/utils/cookieHandler/types';
import { getUserInformation } from './api/user/info';
import { getAnalytics } from './utils';
import { InputType } from 'supertokens-website';

const sendAuthAnalytics = (
  eventName: string,
  payload: Record<string, unknown>,
  version = 'v1'
) => {
  getAnalytics().then((stAnalytics: any) => {
    if (stAnalytics === undefined) {
      console.log('mocked event send:', eventName, version, payload);
      return;
    }
    stAnalytics.sendEvent(
      eventName,
      {
        type: 'auth',
        ...payload,
      },
      version
    );
  });
};

export const SDK_LOGS_STORAGE_KEY = 'Supertokens-sdk-logs';
function NOOP() {}
function shouldEnableSDKLogs() {
  return false; // change to true, to enable sdk logs
}

export function cookieExists(name: string) {
  const cookies = document.cookie;
  const regex = new RegExp('(^|; )' + encodeURIComponent(name) + '=');
  return regex.test(cookies);
}

export function getCookieValue(cookieName: string) {
  const cookies = document.cookie;
  const cookieArray = cookies.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.startsWith(cookieName + '=')) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}

const isSuperTokensSDKLog = (data: any) => {
  return typeof data === 'string' && data.includes('supertokens-website-ver:');
};

type ConsoleLog = typeof globalThis.console.log;
export const overrideConsoleImplementation = (
  customImplementation: ConsoleLog
) => {
  const oldConsoleLogImplementation = globalThis.console.log;
  globalThis.console.log = (data) => {
    customImplementation(data, oldConsoleLogImplementation);
  };
};

export const saveSDKLogsConsoleOverride = (
  data: any,
  oldConsoleImplementation: ConsoleLog
) => {
  if (isSuperTokensSDKLog(data)) {
    const logArrayStr = localStorage.getItem(SDK_LOGS_STORAGE_KEY) || '[]';
    const logArray = JSON.parse(logArrayStr) as string[];

    if (logArray.length === 1000) {
      logArray.shift();
    }
    logArray.push(data);

    localStorage.setItem(SDK_LOGS_STORAGE_KEY, JSON.stringify(logArray));
  } else {
    oldConsoleImplementation(data);
  }
};

export async function sendSDKLogsToBackend(customData?: Record<string, any>) {
  if (!shouldEnableSDKLogs()) {
    return;
  }
  const sdkLogs = localStorage.getItem(SDK_LOGS_STORAGE_KEY) || '[]';
  const parsedSDKLogs = JSON.parse(sdkLogs);

  getAnalytics().then((stAnalytics: any) => {
    if (stAnalytics === undefined) {
      console.log('mocked event send:', 'auth_error_sdk_logs', parsedSDKLogs);
      return;
    }
    stAnalytics.sendSupertokensSDKLogs({ logs: parsedSDKLogs, ...customData });
  });
}

export async function checkForDesyncedSession() {
  if (!shouldEnableSDKLogs()) {
    return;
  }
  const EVENT_NAME = 'desynced_session_state';
  const didFrontTokenExistBeforeAPICall = cookieExists('sFrontToken');

  try {
    await getUserInformation();
    const doesFrontendTokenExistAfterAPICall = cookieExists('sFrontToken');
    if (!doesFrontendTokenExistAfterAPICall) {
      const payload = {
        didFrontTokenExistBeforeAPICall,
        stLastAccessTokenUpdate: getCookieValue('st-last-access-token-update'),
        statusCode: 200,
      };
      getAnalytics().then((stAnalytics: any) => {
        if (stAnalytics === undefined) {
          console.log('mocked event send:', EVENT_NAME, 'v1', payload);
          return;
        }
        stAnalytics.sendEvent(
          EVENT_NAME,
          {
            type: EVENT_NAME,
            ...payload,
          },
          'v1'
        );
      });
    }
  } catch (e: any) {
    if (
      'response' in e &&
      e.response?.status === 401 &&
      e.response.data &&
      e.response.data.message === 'try refresh token'
    ) {
      if (!cookieExists('sFrontToken')) {
        const payload = {
          didFrontTokenExistBeforeAPICall,
          stLastAccessTokenUpdate: getCookieValue(
            'st-last-access-token-update'
          ),
          statusCode: 401,
        };
        getAnalytics().then((stAnalytics: any) => {
          if (stAnalytics === undefined) {
            console.log('mocked event send:', EVENT_NAME, 'v1', payload);
            return;
          }
          stAnalytics.sendEvent(
            EVENT_NAME,
            {
              type: EVENT_NAME,
              ...payload,
            },
            'v1'
          );
        });
      }
    }
  }
}

export function historyPushStateOverride(onPush: () => void) {
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    onPush();
    return result;
  };
}

const cookieSDKHook: CookieHandlerInput = (original) => {
  return {
    ...original,
    setCookie: (cookieString: string) => {
      const cookieName = cookieString.split(';')[0].split('=')[0];
      if (cookieName === 'sFrontToken') {
        let cookieValue = cookieString.split(';')[0].split('=')[1].trim();
        if (cookieValue === '' && cookieExists('sFrontToken')) {
          const stack = new Error().stack;
          sendSDKLogsToBackend({
            stack,
            title: 'front_token_cookie_removed',
          });
        }
      }
      return original.setCookie(cookieString);
    },
  };
};

export async function sendAnalyticsIfFrontTokenRemoved(
  url: string,
  frontTokenExists: boolean,
  headers: any
) {
  if (!frontTokenExists) {
    return;
  }
  let updatedFrontTokenExists = cookieExists('sFrontToken');
  if (!updatedFrontTokenExists) {
    // this means it was removed between the api call!
    // send analytics
    sendAuthAnalytics('front_token_removed', {
      url,
      headers,
    });
    await sendSDKLogsToBackend();
  }
}

export function preSDKLogsOverrides() {
  if (!shouldEnableSDKLogs()) {
    return;
  }
  overrideConsoleImplementation(saveSDKLogsConsoleOverride);
  historyPushStateOverride(checkForDesyncedSession);
  checkForDesyncedSession();
}

export function getSdkLogConfigs(): Partial<InputType> {
  return shouldEnableSDKLogs()
    ? {
        enableDebugLogs: true,
        cookieHandler: cookieSDKHook,
      }
    : {};
}

export function getHttpNetworkingSDKLogsHooks() {
  if (!shouldEnableSDKLogs()) {
    return {
      postApiExecutionHook: NOOP,
      preApiExecutionHook: NOOP,
    };
  }
  let frontTokenExists = false;
  const preApiExecutionHook = () => {
    frontTokenExists = cookieExists('sFrontToken');
  };

  const postApiExecutionHook = async (url: string, headers: any) => {
    await sendAnalyticsIfFrontTokenRemoved(url, frontTokenExists, headers);
  };

  return {
    postApiExecutionHook,
    preApiExecutionHook,
  };
}
