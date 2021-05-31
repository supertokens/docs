---
id: field_error
title: FIELD_ERROR
hide_title: true
---

# ``FIELD_ERROR``
**Type** : ``{type: FIELD_ERROR, payload: {id: string, error: string}[] message: string}``
- The ``payload`` object is an array of objects containing a ``id`` string and ``error``string.
  - ``id`` is the html tag corresponding to the error
  - ``error`` is the actual error message
- The ``FIELD_ERROR`` can be thrown when input to a ``form field`` fails it's validator.