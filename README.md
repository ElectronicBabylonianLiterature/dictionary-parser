# dictionary-parser

[![Codeship Status for ElectronicBabylonianLiterature/dictionary-parser](https://app.codeship.com/projects/b1517250-34cc-0136-b3a0-0a4605642058/status?branch=master)](https://app.codeship.com/projects/289131)
[![Test Coverage](https://api.codeclimate.com/v1/badges/abcdddb5856e9c92135d/test_coverage)](https://codeclimate.com/github/ElectronicBabylonianLiterature/dictionary-parser/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/abcdddb5856e9c92135d/maintainability)](https://codeclimate.com/github/ElectronicBabylonianLiterature/dictionary-parser/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A script which transforms a dictionary from markdown to JSON.

```
node ./index.js <a path to a dictionary markdown file>
```

The script parses the given markdown file and produces the following files:
- `unparseable.json`, rows which were not parsed to a entry or link
- `dictionary.json`, all parsed entries with merged links
- `broken.json`, a subset of parsed entries which unparseable forms or derived forms
- `unparseable-links.json`, rows which were recognized as links but did not have a valid target
- `links.json`, all parsed links
- `broken-links.json`, a subset of parsed links which did not have a matching entry

## Input

The dictionary is a markdown file with rows containing an entry `**<lemma>** <optional homonym><optional forms after a comma> <meaning><optional nested meanings of fucntions or confugations><optinal derived starting with \>><optinal derived from starting with \<>` or a link `<comma separated list of lemmata marked with **> <optionak etc.> \*cf.\* <list lemmata similar to derived forms>`. Empty lines are ignored.

Conjugation identfiers are: `G`, `Gtn`, `Gt`, `D`, `Dtn`, `Dt`, `Dtt`, `Š`, `Štn`, `Št`, `ŠD`, `N`, `Ntn`, `R`.

Function identifiers are: `A.`, `B.`,  `C.`, ...

Entry identifiers are: `1.`, `2.`,  `3.`, ...

In the markdown the identifiers are bolded, e.g. `**G**`.

Logograms are identified by `\[` and `\]`.


## Output

The dictionary is parsed to a JSON file containing an array of entries:
```
{
  "lemma": "<lemma splitted to components with mardown and * removed>",
  "attested": <false is lemma starts with *, true otherwise>
  "homonym: "<homonym or I if not specified>",
  "forms": <array of forms and expanded lemma or an empty array if none specified>,
  "meaning": "<meaning>",
  "amplifiedMeanings": <amplified meadings or an empty object of not specified>,
  "logograms": <an array of logogram entries separated semicolons extracted from meaning and amplified meanings>,
  "derived": <array of derived words or an empty empty array if none specified>,
  "derivedFrom": "<derived from or null is not specified>",
  "source": "<the original row>"
}
```

Forms have the following structure:
```
{
  "lemma": "<lemma splitted to components with mardown removed>",
  "notes": <an array of extra information>
}
```

Amplified meanings have the following structure:
```
{
  "implicit": <a map of entries if no top level identifier was specified>,
  "<function or conjugation identifier>": <a map of entries>,
  "<function or conjugation identifier>": <a map of entries>,
  ...
}
```

Entries have the following structure:
```
{
  "meaning": "<a common meaning of function or conjugation if specified>"
  "<entry id>": "<meaning>",
  "<entry id>": "<meaning>",
  ...
}
```

Logograms entrries have the following structure:
```
{
  "logogram": <an array of expanded logogram variations>,
  "notes": <an array of extra information>
}
```

Derived words have the following structure:
```
{
  "lemma": "<lemma with mardown removed>",
  "homonym: "<homonym or I if not specified>,
  "notes": <an array of extra information e.g. cf. or ?>,
  "source": <if entry was created due to a link the original row of the link>
}
```

## Link merging

Lemmata from links are added as derived forms to words defined by the list after `\*cf.*\`. The derived from will use the notes from the link and has additional `source` property containing the original row of the link.

## Lemma expansion rules

* A lemma with parentheses is expanded to a lemma without and a lemma with the contents of the parenteses. E.g. `malû(m)` -> `malû` and `malûm`.
* A lemma ending with `-um` is expanded to two lemmata ending with `-u` and `-um`. E.g. `māmilūtum` -> `māmilūtu` and `māmilūtum`
* In the case of multiple parentheses and/or `-um` all combinations are expanded.
