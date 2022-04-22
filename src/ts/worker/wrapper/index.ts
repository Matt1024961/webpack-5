export class WrapperWorker extends Worker {
    constructor(url: string) {
        super(url);
        self.onmessage = async ({ data }) => {
            console.log(data);
        };
    }
    // postMessage (message: any, transfer: Transferable[]): void;
    // postMessage (message: any, options?: StructuredSerializeOptions): void;
    // // eslint-disable-next-line @typescript-eslint/no-empty-function
    // postMessage (message: any, options?: any): void {
        
    // }
    // onmessage: (this: Worker, ev: MessageEvent<any>) => any;
}