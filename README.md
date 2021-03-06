# dictionary-parser

[![Build Status](https://travis-ci.com/ElectronicBabylonianLiterature/dictionary-parser.svg?branch=master)](https://travis-ci.com/ElectronicBabylonianLiterature/dictionary-parser)
[![Test Coverage](https://api.codeclimate.com/v1/badges/abcdddb5856e9c92135d/test_coverage)](https://codeclimate.com/github/ElectronicBabylonianLiterature/dictionary-parser/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/abcdddb5856e9c92135d/maintainability)](https://codeclimate.com/github/ElectronicBabylonianLiterature/dictionary-parser/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A script which transforms a dictionary from markdown to JSON.

```
node index.js <a path to a dictionary markdown file> <a path to a CSV file with roots>
```

The script parses the given markdown file and produces the following files:
- `unparseable.json`, rows which were not parsed to a entry or link
- `dictionary.json`, all parsed entries with merged links
- `broken.json`, incorrectly parsed entreis by error type: amplified meanings, unparseable forms, or unparseable derived forms, unmatched derived forms
- `duplicates.json`, a collection of duplicate lemmata with counts
- `unmatched-roots.json`, a list of roots which did not match any entry
- `unparseable-links.json`, rows which were recognized as links but did not have a valid target
- `links.json`, all parsed links
- `broken-links.json`, a subset of parsed links which did not have a matching entry

## Input

### Dictionary

The dictionary is a markdown file with rows containing an entry `**<lemma>** <optional homonym><optional forms after a comma> <meaning><optional nested meanings of fucntions or confugations><optinal derived starting with \>><optinal derived from starting with \<>` or a link `<comma separated list of lemmata marked with **> <optionak etc.> \*cf.\* <list lemmata similar to derived forms>`. Empty lines are ignored.

Conjugation identfiers are: `G`, `Gtn`, `Gt`, `D`, `Dtn`, `Dt`, `Dtt`, `Š`, `Štn`, `Št`, `ŠD`, `N`, `Ntn`, `R`.

Function identifiers are: `A.`, `B.`,  `C.`, ...

Entry identifiers are: `1.`, `2.`,  `3.`, ...

In the markdown the identifiers are bolded, e.g. `**G**`.

Logograms are identified by `\[` and `\]`.

### Roots

The roots file should be a CSV file with two columns. The first colum should contain the unexpanded lemma and optional homonym numbers and the second column should contain the root.

## Output

After the parsing a summary of results is displayed:
```
❌ <number of unparseable rows (entries + links)>
🔗 <number of parsed links>  🚧 <number of links with incorrectly parsed targets>
✔️ <number of parsed entries>  🚧 <number of broken entries> 💥 <number of duplicate lemmata> ❓ <number of unmatched roots>
```

The dictionary is parsed to a JSON file containing an array of entries:
```
{
  "lemma": "<lemma splitted to components with mardown and * removed>",
  "attested": <false is lemma starts with *, true otherwise>,
  "legacyLemma": <unprocessed lemma from the original row>
  "homonym: "<homonym or I if not specified>",
  "forms": <array of forms and expanded lemma or an empty array if none specified>,
  "meaning": "<meaning>",
  "amplifiedMeanings": <an array of top level entries>,
  "logograms": <an array of logogram entries separated semicolons extracted from meaning and amplified meanings>,
  "derived": <array of derived words or an empty empty array if none specified>,
  "derivedFrom": "<derived from or null is not specified>",
  "source": "<the original row>",
  "root": <the root if matching row was found in the roots CSV>,
  "pos": <V if the rood was added>
}
```

Forms have the following structure:
```
{
  "lemma": "<lemma splitted to components with mardown removed>",
 
}
```

Entries have the following structure:
```
{
  "key": "<conjugation or function, only on top level, empty string if no top level identifier was specified>",
  "meaning": <meaning>,
  "vowels": [
    {
      "value": [<first vowel>, <second vowel>],
      "notes": <an array of extra information>
    }
  ],
  "entries": <an array of entries, only on top level>
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
  "lemma": "<lemma splitted to components with mardown removed>",
  "homonym: "<homonym or I if not specified>,
  "notes": <an array of extra information e.g. cf. or ?>,
  "source": <if entry was created due to a link the original row of the link>
}
```

Derived from has the following structure:
```
{
  "lemma": "<lemma splitted to components with mardown removed>",
  "homonym: "<homonym or I if not specified>",
  "notes": <an array of extra information>
}
```

## Link merging

Lemmata from links are added as derived forms to words defined by the list after `\*cf.*\`. The derived from will use the notes from the link and has additional `source` property containing the original row of the link.

If link and target lemmata end with `...` a derived form is added where the prefix target lemma is replaced with the prefix of the link lemma.

## Lemma expansion rules

* A lemma with parentheses is expanded to a lemma without and a lemma with the contents of the parenteses. E.g. `malû(m)` -> `malû` and `malûm`.
* A lemma ending with `-um` is expanded to two lemmata ending with `-u` and `-um`. E.g. `māmilūtum` -> `māmilūtu` and `māmilūtum`
* A lemma ending with `-ûm` is expanded to two lemmata ending with `-û` and `-ûm`
* In the case of multiple parentheses and/or `-um` all combinations are expanded.

# Known issues

Not all words are parsed correctly. Rare and complicated errors should be fixed manually, but below are fixes for some common cases.

If the derived from does not contain a lemma, i.e. mardown italics, it is not parsed at all. `scripts/fixDerivedFroms.js` can be used to fix the data in a Mongo database.

The notes array does not take the position of notes in consideration. If an entry has only a post note it will incorrectla appear before the lemma. To work around this an empty note at index zero needs to be added. This can done by `scripts/fixDerivedFromNotes.js` and `scripts/fixDerivedNotes.js`.

Some `derivedFrom` notes begin with a `+` sign which intrepreted as a list item in markdown. These can be escaped with `scripts/fixPlus.js`.

To find a target for all the links, matching was also done to forms. This lead to incorrectly merged links. The links need to be removed from the dictionary add readded with correct matching. Derived forms with a `source` proprty were generated from links.
