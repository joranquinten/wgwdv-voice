const setYear = require("date-fns/set_year");
const parse = require("date-fns/parse");
const format = require("date-fns/format");

const dateThisYear = someDate => {
  const today = new Date();
  return setYear(
    new Date(someDate.getFullYear(), someDate.getMonth(), someDate.getDate()),
    today.getFullYear()
  );
};

const DateFns = {
  getDateField(suggestion, reference) {
    return suggestion[reference]
      ? format(dateThisYear(parse(suggestion[reference])), "YYYY-MM-DD")
      : format(new Date(), "YYYY-MM-DD");
  }
};

module.exports = DateFns;
