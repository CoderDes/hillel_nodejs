const SORT_PARAMS = ["addedAt", "id", "text", "sender"];
const SORTVALUES_PARAMS = ["asc", "desc"];

exports.validationQuery = function ({ sort, sortValue, limit, skip }) {
  if (Number.isNaN(+limit) || Number.isNaN(+skip)) {
    throw new Error("limit/skip parameter must be a number.");
  }
  if (!Number.isNaN(+sort)) {
    throw new Error("sort parameter must not be a number.");
  }
  if (+skip > 501 || +skip < 0) {
    throw new Error(
      "skip parameter must be more or equal 0 and less than 501.",
    );
  }
  if (+limit < 0 || +limit > 51) {
    throw new Error("limit parameter must be more or equal 0 and less than 51");
  }
  if (!SORTVALUES_PARAMS.includes(sortValue)) {
    throw new Error(
      `sortValue parameter must be equal to one of variants: ${SORTVALUES_PARAMS.map(
        value => value,
      ).join(", ")}.`,
    );
  }
  if (!SORT_PARAMS.includes(sort)) {
    throw new Error(
      `sort parameter must be equal to one of variants: ${SORT_PARAMS.map(
        value => value,
      ).join(", ")}.`,
    );
  }
};
