import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppSettingsService } from '../app-settings';

@Injectable()
export class MessagesHistoryService {
    constructor(protected http: Http, protected appSettingsService: AppSettingsService) {}

public getUrl() {
    return this.appSettingsService.getEtlServer() + '/poc-user-feedback/1000/1534827560.000100';
}

public getMessagesFeedbackList() {
    return this.http.get(this.getUrl())
    .map( (res: Response) =>  res.json()
);
}

public formatMsg(msgs: any[]) {
    let arr: any[];
    arr = [];
    msgs.forEach((msg) => {

         // phone
          const m = msg.text.split('\n', 6);
          console.log('splitted array', m);
          const p = m.slice(2, 3);
          console.log('sliced phone', p);
          const j = p.map((item: any) => item.replace(' *Phone:* ', ''));
          console.log('phone', j);

         // location
          const l = m.slice(1, 2);
          console.log('sliced location', l);
          const k = l.map((item: any) => item.replace(' *Location:* ', ''));
          console.log('location', k);

          // from
          const f = m.slice(0, 1);
          console.log('sliced from', f);
          const g = f.map((item: any) => item.replace('*From* ', ''));
          console.log('from', g);

          // department
          const q = m.slice(3, 4);
          console.log('sliced department', q);
          const y = q.map((item: any) => item.replace(' *Department:* ', '' ));
          console.log('department', y);

          // messages
          const r = msg.text.split('\n');
          console.log('splitted r', r);
          const z = r.slice(4);
          console.log('sliced z', z);
          const b = z.map((item: any) => item.replace('```', ''));
          console.log('sliced 1st``', b);
          const c = b.map((item: any) => item.replace('```', ''));
          console.log('messages', c);
          const d = c.slice(1);
          console.log('messages filterd', d);


          const arrInner = [g, k, y, j, d, msg.ts ];
          console.log('full message', arrInner);
          if (msg.username === 'bot') {
            arr.push(arrInner);
          }
        });
    return arr;
        }

}
