# dictionary-parser

[ ![Codeship Status for ElectronicBabylonianLiterature/dictionary-parser](https://app.codeship.com/projects/b1517250-34cc-0136-b3a0-0a4605642058/status?branch=master)](https://app.codeship.com/projects/289131)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A script which transforms a dictionary from markdown to JSON.

The dictionary entries are is expected to be in the format: `**<lemma>** <optional homonym><optional forms after a comma> <description starting with ", (, or **\~**>` which will be parsed to:
```
{
  "lemma": "<lemma with mardown removed>",
  "homonym: "<homonym or I if not specified>
  "forms": <forms or empty string if not specified>
  "definition": "<definition>,
  "source": "<the original row>"
}
```