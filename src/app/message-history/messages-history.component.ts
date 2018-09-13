import { MessagesHistoryService } from './messages-history.service';
import {Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges} from '@angular/core';
import {ChangeEvent, VirtualScrollComponent} from 'angular2-virtual-scroll';

@Component({
    selector: 'feedback-history',
    templateUrl: 'messages-history.component.html',
    styles: [`
    .row {
        margin-bottom: 15px;

      }

      #refresh_btn {
        position: absolute;
        right: 16px;
      }
      #msg {
        position: absolute;
        left: 100px;
       }
       #card1 {
        margin-left: 0px;
        margin-right: 0px;
        margin-bottom: 10px;
         position: static;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        border-radius: 5px; /* 5px rounded corners */
      }

      #mtime {
       position: absolute;
       right: 16px;
      }

    `, '../../../node_modules/font-awesome/css/font-awesome.css'],
    providers: [MessagesHistoryService]
})

export class FeedBackHistoryComponent implements OnInit, OnChanges {

    @Input()
    protected items: MsgSlack[];
    protected scrollItems: MsgSlack[];

    protected indices: ChangeEvent;
    protected buffer: MsgSlack[] = [];
    protected readonly bufferSize: number = 10;
    protected timer;
    protected loading: boolean;

    @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;

    constructor(public _service: MessagesHistoryService ) {}

    public ngOnInit() {
        // tslint:disable-next-line:no-trailing-whitespace
        this.getFeedBack();
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.reset();
    }

    public reset() {
        this.fetchNextChunk(0, this.bufferSize, {}).then((chunk) => this.buffer = chunk);
    }

    public fetchMore(event: ChangeEvent) {
        this.indices = event;
        if (event.end === this.buffer.length - 1 ) {
            this.loading = true;
            this.fetchNextChunk(this.buffer.length, this.bufferSize, event).then( (chunk) => {
               this.buffer = this.buffer.concat(chunk);
               this.loading = false;
            }, () => this.loading = false);
        }
    }

   public fetchNextChunk(skip: number, limit: number, event?: any): Promise<MsgSlack[]> {
        return new Promise((resolve, reject) => {
           clearTimeout(this.timer);
           this.timer = setTimeout(() => {
               if (skip < this.items.length) {
                   return resolve(this.items.slice(skip, skip + limit));
               }
               reject();
           }, 1000 + Math.random() * 1000);
        });
    }

    public getFeedBack() {
        this._service.getMessagesFeedbackList()
            .subscribe( (res) => {
                    this.scrollItems = this._service.formatMsg(res.messages);
                    console.log('data', this.scrollItems);
                }
            );
    }

    protected refresh() {
        this._service.getMessagesFeedbackList().subscribe( (res) => {this.getFeedBack(); });
    }

    //  protected refreshTimeout() {
    //      this.loading = true;
    //      this.d = setTimeout(() => {
    //         this.refresh();
    //     }, 100);
    //     setTimeout(() => { this.loading = false; }, 4000 );
    // }
}

export interface MsgSlack {
    text?: string;
    ts?: string;
}

// import { MessagesHistoryService } from './messages-history.service';
// import { Component, OnInit, Input } from '@angular/core';
// import { ChangeEvent } from 'angular2-virtual-scroll';
//
// @Component({
//     selector: 'feedback-history',
//     templateUrl: 'messages-history.component.html',
//     styles: [`
//     .row {
//         margin-bottom: 15px;
//
//       }
//
//       #refresh_btn {
//         position: absolute;
//         right: 16px;
//       }
//       #msg {
//         position: absolute;
//         left: 100px;
//        }
//        #card1 {
//         margin-left: 0px;
//         margin-right: 0px;
//         margin-bottom: 10px;
//          position: static;
//         box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
//         border-radius: 5px; /* 5px rounded corners */
//       }
//
//       #mtime {
//        position: absolute;
//        right: 16px;
//       }
//
//     `, '../../../node_modules/font-awesome/css/font-awesome.css'],
//     providers: [MessagesHistoryService]
// })
//
// export class FeedBackHistoryComponent implements OnInit {
//
//     @Input() protected items: MsgSlack[];
//
//             protected d: any;
//             protected indices: ChangeEvent;
//             protected buffer: MsgSlack[];
//             protected scrollItems: MsgSlack[];
//             protected myItems: MsgSlack[];
//             protected readonly bufferSize: number = 10;
//             protected timer: any;
//             protected loading: boolean;
//
//     constructor(public _service: MessagesHistoryService ) {}
//
//     public ngOnInit() {
//          // tslint:disable-next-line:no-trailing-whitespace
//      this.getFeedBack();
//
//     }
//
//     public getFeedBack() {
//         this._service.getMessagesFeedbackList()
//         .subscribe( (res) => {
//             this.scrollItems = this._service.formatMsg(res.messages);
//             console.log('data', this.scrollItems);
//         }
//         );
//     }
//
//     protected refresh() {
//         this._service.getMessagesFeedbackList().subscribe( res => {this.getFeedBack(); });
//     }
//
//     protected refreshTimeout() {
//         this.loading = true;
//         this.d = setTimeout(() => {
//           this.refresh();
//         }, 100);
//         setTimeout(() => { this.loading = false; }, 4000 );
//     }
// }
//
// export interface MsgSlack {
//     text?: string;
//     ts?: string;
//   }
