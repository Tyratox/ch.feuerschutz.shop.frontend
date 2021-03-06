/**
 * The sales reducer
 * @param {Object} state The redux state
 * @param {Object} action The dispatched action
 * @returns {Object} The new state
 */
const salesReducer = (
  state = { isFetching: 0, lastFetched: 0, error: null, sales: [], posts: [] },
  action
) => {
  switch (action.type) {
    case "FETCH_SALES":
      return {
        isFetching: state.isFetching + (action.isFetching ? 1 : -1),
        lastFetched:
          !action.isFetching && !action.error ? Date.now() : state.lastFetched,
        error:
          action.error || action.error === null ? action.error : state.error,
        sales: !action.isFetching && action.sales ? action.sales : state.sales,
        posts: !action.isFetching && action.posts ? action.posts : state.posts
      };
    default:
      return state;
  }
};

export default salesReducer;

/**
 * Gets all sales
 * @param {Object} state The redux state
 * @returns {Object} All sales
 */
export const getSales = state => state.sales;

/**
 * Gets all sticky posts
 * @param {Object} state The redux state
 * @returns {Object} All sales
 */
export const getStickyPosts = state => state.posts;

/**
 * Checks when the last time sales were fetched
 * @param {Object} state The redux state
 * @returns {number} The unix timestamp
 */
export const getSalesLastFetched = state => state.lastFetched;

/**
 * Checks whether sales are being fetched
 * @param {Object} state The redux state
 * @returns {boolean} Whether sales are being fetched
 */
export const isFetchingSales = state => state.isFetching !== 0;
