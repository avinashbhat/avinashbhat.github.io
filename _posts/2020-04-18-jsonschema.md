---
layout: post
title: JSON Schema for Input Validation
description: JSON Schema for Input Validation
summary: JSON Schema for Input Validation
date: 2019-04-18T00:00:00.000Z
category: blog
comments: true
tags:
  - jsonschema
  - python
  - web application development
published: true
---

Input validation is a necessary part of any web request as it validates data which is useful for automated testing and ensuring quality of client submitted data. JSON Schema is one amazing library for this purpose.

There are many [implementations](https://json-schema.org/implementations.html) of this library, so pick your choice.

These are the resources which you can use to read more about it.

 - [JSON Schema Documentation](https://json-schema.org/understanding-json-schema/)
 - [A step by step introduction](https://json-schema.org/learn/getting-started-step-by-step.html)
 - [Some Examples](https://json-schema.org/learn/miscellaneous-examples.html)
 - [An online demo](https://notebooks.ai/demo/gh/Julian/jsonschema)

In this blog, I'll demonstrate the features I really liked in the package.

#### Sample Validation Schemas
This is a basic validation schema given in the docs.

```python
schema = {
    "type" : "object",
    "properties" : {
        "price" : {"type" : "number"},
        "name" : {"type" : "string"},
    },
}
```
This successfully validates a JSON object which has two keys, price and name which are number and string type respectively. Although, in all the practical scenarios, I've found that adding the pattern keyword works best.
```python
schema = {
        "type": "object",
        "properties": {
                "name": {"type": "string", "pattern": r"^[a-zA-Z]+$"}
            },
        }
```
A name field will not contain a number. Specifying a pattern will ensure that the string contains only letters.

#### Combining the Schemas
There are four ways in which the schemas can be combined. 

 - allOf: All the validators need to succeed 
 - anyOf: Any one of the listed validators need to succeed 
 - oneOf: EXACTLY ONE of the listed validators need to succeed 
 - not: None of the listed validators need to succeed

These are basically validators itself, which handle these specific usecases.
```python
{
  "anyOf": [
    { "type": "string", "maxLength": 5 },
    { "type": "number", "minimum": 0 }
  ]
}
```
This is a simple case, where in the JSON can contain a string of maximum length of 5, or number of minimum length of 0. However, we can extend the individual cases to custom validators, which makes this extremely powerful. Read more about it [here](https://json-schema.org/understanding-json-schema/reference/combining.html).

#### Custom Validators
JSON Schema allows you to extend the validator class for specific JSON types as well as better handling of the errors. Although I have not done it yet, you can [read](https://python-jsonschema.readthedocs.io/en/latest/creating/) about it.

#### Using this in Python
```python
import jsonschema
import json

# declare your flask app

def validate_input(request):
    content = request.get_json(force=True)
    schema = {
            "type": "object",
            "properties": {
                    "name": {"type": "string", "pattern": r"^[a-zA-Z]+$"}
                },
            }

    try:
        jsonschema.validate(instance=content, schema=schema)
        app.logger.info("Input validation successful.")
    except Exception as e:
        app.logger.info("Input validation error: {}".format(e))
```
#### JSON Hyper-Schema
JSON Hyper-Schema is a JSON Schema vocabulary for annotating JSON documents with hyperlinks. Using this we can build hypermedia systems from JSON documents by describing how to construct hyperlinks from instance data. This concept works well with the [HATEOAS](https://restfulapi.net/hateoas/) concept, and can be used to validate the individual URIs in a REST API. More on this [here](https://json-schema.org/draft/2019-09/json-schema-hypermedia.html).

#### That's all Folks!
I hope this provides an overview of the JSON Schema library. Take a look at [these](https://json-schema.org/draft-04/json-schema-validation.html#rfc.section.5) keywords to build a more complex schema.
