import { RestAction, RestActionRelieve, RestClient } from '@uranusjs/rest-revolt';

/**
 * This is to perform request actions and return metadata without having to rely on promises and async.
 * You can use any way to get the metadata.
 *
 * ```js
 * FactoryData.get().queue((data) => {
 *  ... your code!
 *  console.log(data)
 * })
 * ```
 *
 */
export class RestBase {
  /**
   *
   * You cannot have access to this structure because it contains the token and it is always
   * good to keep the bot token private without having access to the metadata.
   */
    private restClient: RestClient;
    constructor(restClient: RestClient) {
        this.restClient = restClient;
    }

  /**
   * This is to perform request actions and return metadata without having to rely on promises and async.
   * You can use any way to get the metadata.
   *
   * ```js
   *    FactoryData.get().queue((data) => {
   *         ... your code!
   *          console.log(data)
   *    })
   * ```
   * To receive status code errors or errors formulated by NodeJS or request management try these here.
   * ```js
   *     FactoryData.get()
   *        .queue((data) => {
   *              ... your code!
   *         })
   *        .err((error) => {
   *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
   *              console.error(error)
   *        })
   * ```
   *
   * There are possibilities for you to track status code when API returns to your Client.
   *
   * ```js
   *    FactoryData.get()
   *      .queue((data) => {
   *              ... your code!
   *      })
   *      .err((error) => {
   *              // OBS: You may end up receiving the API metadata when you return some strange error because of Axios and I recommend tracking by fields error or data
   *              console.error(error)
   *      })
   *      .errStatusCode((code) => {
   *               ... Your code!
   *                    or
   *              console.log(errStatusCode)
   *      })
   * ```
   *
   *
   *
   *
   * Remembering you can receive the request manager and executioner by the queue
   * ```js
   *    FactoryData.get().queue((data, message) => {
   *        message.edit('Hello world!')
   *    })
   * ```
   */
    executeAction<PathRoute, Metadata, T>(options: RestActionRelieve) {
        return RestAction
            .create<PathRoute, Metadata, T>({
                'rest': this.restClient,
                'route': options.route,
                'requestOptions': options.requestOptions,
            });
    }
}
