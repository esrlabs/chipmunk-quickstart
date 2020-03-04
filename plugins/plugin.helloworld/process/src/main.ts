
import PluginIPCService, { ServiceState, IPCMessages } from 'chipmunk.plugin.ipc';

export enum EHostEvents {
    time = 'time',
}

export enum EHostCommands {
    sendTimeIntoOutput = 'sendTimeIntoOutput',
    stop = 'stop',
    resume = 'resume',
}

class Plugin {

    private _timer: any;
    private _stream: string | undefined;

    constructor() {
        // Subscribe on plugin's render (frontend) events/requests
        PluginIPCService.subscribe(IPCMessages.PluginInternalMessage, this._onIncomeRenderIPCMessage.bind(this));
    }

    private _onIncomeRenderIPCMessage(message: IPCMessages.PluginInternalMessage, response: (res: IPCMessages.TMessage) => any) {
        switch (message.data.command) {
            case EHostCommands.sendTimeIntoOutput:
                PluginIPCService.sendToStream(Buffer.from(this._getTimeStr() + '\n'), message.stream).then(() => {
                    console.log(`Data was sent to stream`);
                }).catch((err: Error) => {
                    console.log(`Fail to send data into stream due error: ${err.message}`);
                });
                return response(new IPCMessages.PluginInternalMessage({
                    data: {
                        status: 'done'
                    },
                    token: message.token,
                    stream: message.stream
                }));
            case EHostCommands.resume:
                this._stream = message.stream;
                this._resume();
                return response(new IPCMessages.PluginInternalMessage({
                    data: {
                        status: 'done'
                    },
                    token: message.token,
                    stream: message.stream
                }));
            case EHostCommands.stop:
                this._stream = message.stream;
                clearTimeout(this._timer)
                return response(new IPCMessages.PluginInternalMessage({
                    data: {
                        status: 'done'
                    },
                    token: message.token,
                    stream: message.stream
                }));
            default:
                console.log(`Unknown commad: ${message.data.command}`);
        }
    }

    private _resume() {
        this._timer = setTimeout(() => {
            if (this._stream === undefined) {
                return;
            }
            PluginIPCService.sendToPluginHost(this._stream, {
                event: EHostEvents.time,
                time: this._getTimeStr(),
                streamId: this._stream
            });
            this._resume();
        }, 666);
    }

    private _getTimeStr(): string {
        return (new Date()).toLocaleTimeString();
    }

}

const app: Plugin = new Plugin();

// Notify core about plugin
ServiceState.accept().catch((err: Error) => {
    console.log(`Fail to notify core about plugin due error: ${err.message}`);
});