/* eslint-disable no-undef */
db.words.update(
  {},
  {
    $push: {
      'derived.$[].$[i].notes': {
        $position: 0,
        $each: ['']
      }
    }
  },
  {
    arrayFilters: [
      {
        'i.notes.0': {
          $regex: /^(etc\..*|G|Gtn|Gt|D|Dtn|Dt|Dtt|Š|Štn|Št|ŠD|N|Ntn|R|Št2|\?)$/
        }
      }
    ],
    multi: true
  }
)
