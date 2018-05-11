# dictionary-parser

[ ![Codeship Status for ElectronicBabylonianLiterature/dictionary-parser](https://app.codeship.com/projects/b1517250-34cc-0136-b3a0-0a4605642058/status?branch=master)](https://app.codeship.com/projects/289131)
[![Test Coverage](https://api.codeclimate.com/v1/badges/abcdddb5856e9c92135d/test_coverage)](https://codeclimate.com/github/ElectronicBabylonianLiterature/dictionary-parser/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/abcdddb5856e9c92135d/maintainability)](https://codeclimate.com/github/ElectronicBabylonianLiterature/dictionary-parser/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A script which transforms a dictionary from markdown to JSON.

The dictionary entries are is expected to be in the format: `**<lemma>** <optional homonym><optional forms after a comma> <description starting with ", (, or **\~**><optinal derived starting with \>>` which will be parsed to:
```
{
  "lemma": "<lemma with mardown removed>",
  "homonym: "<homonym or I if not specified>
  "forms": <array of forms or empty array if none specified>
  "definition": "<definition>,
  "derived": "<array of derived words or an empty empty array if none specified>
  "source": "<the original row>"
}
```

Derived words have following structure:
```
{
  "lemma": "<lemma with mardown removed>",
  "homonym: "<homonym or I if not specified>,
  "notes": "<an array of extra information e.g. cf. or ?>"
}
```
