import { combineReducers } from "redux";
import pluralize from "pluralize";
import changeCase from "change-case";

/**
 * Removes a key from an object
 * @param {Object} obj The object the key should be removed from
 * @param {string} deleteKey The key to delete
 * @returns {Object} The object without the given key
 */
function removeKey(obj, deleteKey) {
  let clone = Object.assign({}, obj);
  delete clone[deleteKey];
  return clone;
}

/**
 * Reducer holding all ids of a particular item type
 * @param {string} name The singular item name
 * @param {string} [uniqueProperty="id"] A unique property all items of the given type will have
 * @param {function} [customCases=null] A function to handle other cases
 * @returns {Array<string|number>} The new state
 */
export const createAllIds = (
  name,
  uniqueProperty = "id",
  customCases = null
) => (state = [], action) => {
  switch (action.type) {
    case "FETCH_" + changeCase.snakeCase(name).toUpperCase():
      return action.itemId
        ? !action.isFetching && action.item && !action.error
          ? state.includes(action.itemId)
            ? state
            : [...state, action.itemId]
          : state.filter(item => item[uniqueProperty] !== action.itemId)
        : state;

    case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
      return action.items
        ? !action.isFetching && !action.error
          ? [
              ...state,
              ...action.items
                .filter(item => item)
                .map(item => item[uniqueProperty])
                .filter(
                  (id, index, ids) =>
                    !state.includes(id) && ids.indexOf(id) === index
                )
            ]
          : state.filter(item => !action.items.includes(item[uniqueProperty]))
        : state;
    case "CREATE_" + changeCase.snakeCase(name).toUpperCase():
      return !action.isFetching &&
        action.item &&
        action.item[uniqueProperty] &&
        !action.error &&
        !state.includes(action.item[uniqueProperty])
        ? [...state, action.item[uniqueProperty]]
        : state;
    case "DELETE_" + changeCase.snakeCase(name).toUpperCase():
      return !action.isFetching && action.itemId
        ? state.filter(id => id != action.itemId)
        : state;
    case "DELETE_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
      return !action.isFetching && action.itemIds
        ? state.filter(id => !action.itemIds.includes(id))
        : state;
    default:
      if (customCases) {
        return customCases(state, action);
      }
      return state;
  }
};

/**
 * Reducer holding mapping the unique property to the item data
 * @param {string} name The singular item name
 * @param {string} [uniqueProperty="id"] A unique property all items of the given type will have
 * @param {function} [customCases=null] A function to handle other cases
 * @returns {Array<string|number>} The new state
 */
export const createById = (name, uniqueProperty = "id", customCases = null) => (
  state = {},
  action
) => {
  const NOW = Date.now();

  switch (action.type) {
    case "FETCH_" + changeCase.snakeCase(name).toUpperCase():
      return {
        ...state,
        [action.itemId]: {
          ...(state[action.itemId] ? state[action.itemId] : {}),
          ...action.item,
          _isFetching: action.isFetching,
          _error: action.error,
          _lastFetched: NOW
        }
      };
    case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
      return action.isFetching || action.error || !action.items
        ? state
        : {
            ...state,
            ...action.items.reduce((object, item) => {
              //skip invalid items
              if (!item) {
                return object;
              }

              object[item[uniqueProperty]] = {
                ...state[item[uniqueProperty]],
                ...item,
                _isFetching: action.isFetching,
                _error: action.error,
                _lastFetched: NOW
              };
              if (action.page) {
                object[item[uniqueProperty]]._page = action.page;
              }
              return object;
            }, {})
          };
    case "CREATE_" + changeCase.snakeCase(name).toUpperCase():
      return action.isFetching
        ? state
        : {
            ...state,
            [action.item[uniqueProperty]]: {
              ...action.item,
              _isFetching: action.isFetching,
              _error: action.error,
              _lastFetched: NOW
            }
          };
    case "UPDATE_" + changeCase.snakeCase(name).toUpperCase():
      return !action.isFetching && action.item && action.item[uniqueProperty]
        ? {
            ...state,
            [action.item[uniqueProperty]]: {
              ...state[action.item[uniqueProperty]],
              ...action.item,
              _isFetching: action.isFetching,
              _error: action.error,
              _lastFetched: NOW
            }
          }
        : state;
    case "DELETE_" + changeCase.snakeCase(name).toUpperCase():
      return !action.isFetching && action.itemId
        ? removeKey(state, action.itemId)
        : state;
    case "DELETE_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
      return !action.isFetching && action.itemIds
        ? Object.keys(state)
            .filter(id => !action.itemIds.includes(id))
            .reduce((object, id) => {
              object[id] = state[id];
              return object;
            }, {})
        : state;
    default:
      if (customCases) {
        return customCases(state, action);
      }
      return state;
  }
};

/**
 * Reducer storing whether multiple items are currently being fetched
 * @param {string} name The singular item name
 * @param {string} [uniqueProperty="id"] A unique property all items of the given type will have
 * @param {function} [customCases=null] A function to handle other cases
 * @returns {Array<number>} The new state
 */
export const createIsFetching = (
  name,
  uniqueProperty = "id",
  customCases = null
) => (state = 0, action) => {
  switch (action.type) {
    case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
      return state + (action.isFetching ? 1 : -1);
    default:
      if (customCases) {
        return customCases(state, action);
      }
      return state;
  }
};

/**
 * Reducer storing the last time multiple items were fetched
 * @param {string} name The singular item name
 * @param {string} [uniqueProperty="id"] A unique property all items of the given type will have
 * @param {function} [customCases=null] A function to handle other cases
 * @returns {Array<number>} The new state
 */
export const createLastFetched = (
  name,
  uniqueProperty = "id",
  customCases = null
) => (state = 0, action) => {
  switch (action.type) {
    case "FETCH_" + changeCase.snakeCase(pluralize(name)).toUpperCase():
      return action.isFetching ? state : Date.now();
    default:
      if (customCases) {
        return customCases(state, action);
      }
      return state;
  }
};

/**
 * Creates a normalized reducer
 * @param {string} name The item name used for the actions
 * @param {string} [uniqueProperty="id"] A unique property all items of the given type will have
 * @returns {function} The reducer
 */
export const createReducer = (name, uniqueProperty = "id") =>
  combineReducers({
    byId: createById(name, uniqueProperty),
    allIds: createAllIds(name, uniqueProperty),
    isFetching: createIsFetching(name, uniqueProperty),
    lastFetched: createLastFetched(name, uniqueProperty)
  });

/**
 * Gets a single item based on its id
 * @param {Object} state The correct part of the redux state
 * @param {number} itemId The items id to look for
 * @returns {Object} The item
 */
export const getItemById = (state, itemId) => state.byId[itemId];

/**
 * Gets all items
 * @param {Object} state The correct part of the redux state
 * @returns {Array} All items
 */
export const getAllItems = state => state.allIds.map(id => state.byId[id]);

/**
 * Checks whether the items is currently being fetched
 * @param {Object} state The correct part of the redux state
 * @returns {boolean} Whether multiple items are currently being fetched
 */
export const isFetching = state => state.isFetching !== 0;

/**
 * Checks when the last time multiple/all items were fetched
 * @param {Object} state The correct part of the redux state
 * @returns {number} The unix timestamp
 */
export const getLastFetched = state => state.lastFetched;

/**
 * Wraps a function, useful for redux getters
 * @param {function} target The function to wrap
 * @param {function} mapState Maps the state to the part that should be passed
 * @returns {function} The wrapped function
 */
export const wrap = (target, mapState) => (...args) =>
  target(mapState(args[0]), ...args.slice(1));
