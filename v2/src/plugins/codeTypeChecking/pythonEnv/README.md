## Updating supertokens4 dependency

```bash
source venv/bin/activate
pip install supertokens-python==<version>
pip freeze > requirements.txt
```

Check that only supertokens-python is updated in the requirements.txt file (unless you expect some dependency of supertokens python to also be updated).