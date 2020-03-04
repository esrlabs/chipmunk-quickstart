// tslint:disable:no-inferrable-types

import { Component, OnDestroy, AfterViewInit, Input, ChangeDetectorRef } from '@angular/core';

export enum EHostEvents {
    time = 'time',
}

export enum EHostCommands {
    sendTimeIntoOutput = 'sendTimeIntoOutput',
    stop = 'stop',
    resume = 'resume',
}

import * as Toolkit from 'chipmunk.client.toolkit';

@Component({
    // With predefined selector we can "tell" chipmunk where component should be mount
    selector: Toolkit.EViewsTypes.sidebarVertical,
    templateUrl: './template.html',
    styleUrls: ['./styles.less']
})

export class SidebarVerticalComponent implements AfterViewInit, OnDestroy {

    // These inputs chipmunk provides with any view
    @Input() public api: Toolkit.IAPI;
    @Input() public session: string;
    @Input() public sessions: Toolkit.ControllerSessionsEvents;

    public _ng_time: string = '...';

    private _subscriptions: { [key: string]: Toolkit.Subscription } = {};

    // Developer could use as well logger from toolkit
    private _logger: Toolkit.Logger = new Toolkit.Logger(`Plugin: HelloWorld!`);

    constructor(private _cdRef: ChangeDetectorRef) {
    }

    public ngOnDestroy() {
        Object.keys(this._subscriptions).forEach((key: string) => {
            this._subscriptions[key].unsubscribe();
        });
    }

    public ngAfterViewInit() {
        // Subscription to income events
        this._subscriptions.incomeIPCHostMessage = this.api.getIPC().subscribe((message: any) => {
            if (typeof message !== 'object' && message === null) {
                // Unexpected format of message
                return;
            }
            if (message.streamId !== this.session) {
                // No definition of streamId
                return;
            }
            switch (message.event) {
                case EHostEvents.time:
                    // From backend of out plugin we've gotten time
                    this._ng_time = message.time;
                    this._cdRef.detectChanges();
                    break;
            }
        });
    }

    public _ng_sendTimeIntoOutput() {
        this.api.getIPC().request({
            stream: this.session,
            command: EHostCommands.sendTimeIntoOutput,
        }, this.session).then((resoponse: any) => {
            // Here we will get response from backend
        }).catch((error: Error) => {
            // Opps, some problems with sending command to backend
            console.error(error);
        });
    }

    public  _ng_Stop() {
        this.api.getIPC().request({
            stream: this.session,
            command: EHostCommands.stop,
        }, this.session).then((resoponse: any) => {
            // Here we will get response from backend
        }).catch((error: Error) => {
            // Opps, some problems with sending command to backend
            console.error(error);
        });
    }

    public  _ng_Resume() {
        this.api.getIPC().request({
            stream: this.session,
            command: EHostCommands.resume,
        }, this.session).then((resoponse: any) => {
            // Here we will get response from backend
        }).catch((error: Error) => {
            // Opps, some problems with sending command to backend
            console.error(error);
        });
    }

}
