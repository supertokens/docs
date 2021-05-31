---
id: token-theft-detected
title: SuperTokensTokenTheftError
hide_title: true
---

# ```SuperTokensTokenTheftError```

- This is thrown when we detect token theft.
- Use `user_id` to get the affected user
- Use `session_handle` to get the affected session

### Example
```python
try:
    # logic using functions which can throw SuperTokensTokenTheftError
except SuperTokensTokenTheftError as e:
    user_id = e.user_id
    session_handle = e.session_handle
    # logic
```