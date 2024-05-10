## Updating SuperTokensIOS dependency

1. Update the version of SuperTokensIOS in the Podfile

2. Run `pod install` in the ios directory

3. If the above doesn't work (cause maybe the version wasn't found):
- Check that the version is actually released
- Run `pod repo update` and then `pod install` again