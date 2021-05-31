---
id: installation
title: Installation
hide_title: true
---

# React Native SDK Installation

## About
- This is a pure JS library.
- If your RN app is not greenfield and it makes authenticated API calls from both, the native and JS sides, please [contact us](mailto:team@supertokens.io).
- The minimum supported react native version is `0.61.5`.

## Installation
After this, please also see the ["Required changes to Android native"](./installation#required-changes-to-android-native) section below
```bash
npm i --save supertokens-react-native@~1.2.0
```

<div class="specialNote" style="margin-bottom: 40px">
You may get a warning about axios being a peer dependency for this package. If you only use fetch for your API calls you can safely ignore this warning.
</div>

## If using Expo
Due to a [RN issue in handling cookies on Android](https://github.com/facebook/react-native/issues/28456), you will need to eject the app and follow the instructions in the next section.

## Required changes to Android native
- An example for the following steps can be seen [here](https://github.com/supertokens/supertokens-react-native/blob/master/Example/android/app/src/main/java/com/example/MainApplication.java).
- Open the android folder of you app in Android Studio
- Navigate to `MainApplication.java`
- Add the following code snippet at the bottom the class (before the last closing bracket)
    ```java
    private void fixCookieDomainIssue() {
        // we modify the OkHttpClient that React Native will use.
        OkHttpClientProvider.setOkHttpClientFactory(() -> {
            OkHttpClient.Builder builder = OkHttpClientProvider.createClientBuilder(
                    mReactNativeHost.getReactInstanceManager().getCurrentReactContext());
            builder.cookieJar(new ReactCookieJarContainer() {

                @Override
                public void setCookieJar(CookieJar cookieJar) {
                    if (cookieJar instanceof JavaNetCookieJar) {
                        super.setCookieJar(new CustomJavaNetCookieJar((JavaNetCookieJar) cookieJar));
                    } else {
                        // user has probably set their own CookieJar.
                        super.setCookieJar(cookieJar);
                    }
                }
            });
            return builder.build();
        });
    }

    private class CustomJavaNetCookieJar implements CookieJar {

        private final JavaNetCookieJar existing;

        public CustomJavaNetCookieJar(JavaNetCookieJar cookieJar) {
            existing = cookieJar;
        }

        @Override
        public void saveFromResponse(HttpUrl url, List<Cookie> cookies) {
            // some of the variables and functions that we need to use are private. So we use Java reflections to access them.
            try {
                List<String> cookieStrings = new ArrayList<>();
                for (Cookie cookie : cookies) {
                    Method toStr = Cookie.class.getDeclaredMethod("toString"); // calling toString with no arguments does not add a leading dot.
                    toStr.setAccessible(true);
                    cookieStrings.add((String) toStr.invoke(cookie));
                }
                Map<String, List<String>> multimap = Collections.singletonMap("Set-Cookie", cookieStrings);

                Field field = existing.getClass().getDeclaredField("cookieHandler");
                field.setAccessible(true);
                CookieHandler cookieHandler = (CookieHandler) field.get(existing);
                cookieHandler.put(url.uri(), multimap);
                return;
            } catch (NoSuchMethodException e) {
            } catch (IllegalAccessException e) {
            } catch (InvocationTargetException e) {
            } catch (IllegalArgumentException e) {
            } catch (SecurityException e) {
            } catch (IOException e) {
            } catch (NoSuchFieldException e) {
            } catch (Throwable e) {}

            existing.saveFromResponse(url, cookies);
        }

        @Override
        public List<Cookie> loadForRequest(HttpUrl url) {
            return existing.loadForRequest(url);
        }
    }
    ```
- Insert a function call in the `onCreate()` function as shown below
    ```java
    @Override
    public void onCreate() {
        super.onCreate();

        // FUNCTION CALL USED TO FIX THE ISSUE OF DOMAIN NAME DURING DEVELOPMENT.
        fixCookieDomainIssue();

        // ...rest of this function should remain the same
    }
    ```