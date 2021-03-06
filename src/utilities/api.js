import { getLanguageFromCurrentWindow } from "./i18n";
import { pathnamesByLanguage } from "./urls";

export const API_URL = process.env.API_URL;

/**
 * Custom Error which can include more data than the standard JS error.
 */
class ApiError extends Error {
  /**
   * Creates a new ApiError object
   * @param {string} [message=""] The error message
   * @param {string|number} [statusCode=200] The status code
   * @param {string} [statusText=""] The status text
   * @param {Array<string>} [errors=[]] An array of error messages
   */
  constructor(message = "", statusCode = 200, statusText = "", errors = []) {
    super(message);
    this.errors = errors;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
}

/**
 * Fetches an url
 * @param {string} url The url to fetch
 * @param {Object} options Fetch options
 * @returns {Promise<Object>} The fetch promise
 */
export const fetchApi = (url, options) => {
  if (!options.headers && options.body) {
    options.headers = new Headers();
    options.headers.append("Content-Type", "application/json");
  }

  /*if (!options.headers.get("Content-Type")) {
    options.headers.append("Content-Type", "application/json");
  }*/

  /*if (!options.headers.get("X-Requested-With")) {
		options.headers.append("X-Requested-With", "XMLHttpRequest");
	}*/

  /*if (!options.headers.get("Authorization") && token) {
    options.headers.append("Authorization", "Bearer " + token);
  }*/

  //de *must* fallback to no directory for backwards compat
  return fetch(API_URL + url, options).then(response =>
    response
      .json()
      .then(json => {
        if (response.ok) {
          if (json && json.errors && json.errors.length !== 0) {
            if (
              json.errors.length === 1 &&
              json.errors[0] ===
                "You have to be logged in to perform this action"
            ) {
              if (typeof window !== "undefined") {
                //we can't use react-router in here as we don't have access to the store
                const lang = getLanguageFromCurrentWindow();

                window.location = `/${lang}/${
                  pathnamesByLanguage[lang].login
                }?redirect=${encodeURIComponent(window.location.pathname)}`;
              }

              return;
            }
          }

          return { json, response };
        }

        if (json.status === 401) {
          //session expired
        }

        return Promise.reject(
          new ApiError(
            json.message,
            response.status,
            response.statusText,
            json.errors
          )
        );
      })
      .catch(e =>
        Promise.reject(
          new ApiError(e.message, response.status, response.statusText)
        )
      )
  );
};
