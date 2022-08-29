/* eslint-disable @typescript-eslint/no-unused-vars */


export class RequestActionData {
    /**
     * Expect a request without async and with an action system for you to execute inside them.
     * @param data 
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    queue(_data: Promise<void> | Function | any) {
        throw new Error('Method not implemented.');
    }

    /**
     * Expect a request with async/promise and with an action system for you to execute within them.
     * 
     * 
     * Use it wisely and in a limited way so you don't get in the way of your code execution. Why the promise can't be kept sometimes.
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    async asyncQueue(_data: Promise<void> | Function | any) {
        throw new Error('Method not implemented.');
    }
    
    /**
     * To execute the tasks to send request to Revolt API.
     */
    private manageRequestData(): void {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private error(message: string) {
        throw new Error('Method not implemented.');
    }


}