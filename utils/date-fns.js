const setYear = require("date-fns/set_year");
const parse = require("date-fns/parse");

const dateThisYear = someDate => {
  const today = new Date();
  return setYear(
    new Date(someDate.getFullYear(), someDate.getMonth(), someDate.getDate()),
    today.getFullYear()
  );
};

const DateFns = {
  getDateField(suggestion, reference) {
    return suggestion.fields[reference]
      ? dateThisYear(parse(suggestion.fields[reference]))
      : new Date();
  }
};

module.exports = DateFns;
