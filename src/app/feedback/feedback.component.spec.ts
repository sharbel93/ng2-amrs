import { FeedBackHistoryComponent } from './../message-history/messages-history.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  TestBed,
  async,
  ComponentFixture,
  inject,
  fakeAsync
} from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  Http,
  Response,
  Headers,
  BaseRequestOptions,
  ResponseOptions
} from '@angular/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { FeedBackService } from './feedback.service';
import { FeedBackComponent } from './feedback.component';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { UserService } from '../openmrs-api/user.service';
// tslint:disable-next-line:max-line-length
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { MomentModule } from 'angular2-moment';
import { MarkdownModule } from 'angular2-markdown';
import { FormsModule } from '@angular/forms';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from './../utils/local-storage.service';
import { DepartmentProgramsConfigService } from '../etl-api/department-programs-config.service';

class DataStub {
  public postFeedback(payload): Observable<any> {
    return Observable.of({ status: 'okay' });
  }
}
class UserServiceStub {
  private person = {
    display: 'test persion'
  };
  private getLoggedInUser() {
    return {
      person: this.person
    };
  }
}
class UserDefaultPropertiesServiceStub {
  public getCurrentUserDefaultLocationObject() {
    return {
      display: 'Location test'
    };
  }
}

class FakeDepartmentProgramsConfigService {
  private getDartmentProgramsConfig(): Observable<any> {
    return Observable.of({ status: 'okay' });
  }
}

describe('FeedBackComponent', () => {
  let fixture: ComponentFixture<FeedBackComponent>;
  let comp: FeedBackComponent;
  let dataStub: FeedBackService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        BusyModule,
        VirtualScrollModule,
        MomentModule,
        MarkdownModule.forRoot()
      ],
      declarations: [FeedBackComponent, FeedBackHistoryComponent]
    })
      .overrideComponent(FeedBackComponent, {
        set: {
          providers: [
            {
              provide: UserDefaultPropertiesService,
              useClass: UserDefaultPropertiesServiceStub
            },
            {
              provide: DepartmentProgramsConfigService,
              useClass: FakeDepartmentProgramsConfigService
            },
            { provide: FeedBackService, useClass: DataStub },
            { provide: UserService, useClass: UserServiceStub },
            {
              provide: Http,
              useFactory: (backend, options) => {
                return new Http(backend, options);
              },
              deps: [MockBackend, BaseRequestOptions]
            },
            MockBackend,
            BaseRequestOptions,
            AppSettingsService,
            LocalStorageService
          ]
        }
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FeedBackComponent);
        comp = fixture.componentInstance;
        dataStub = fixture.debugElement.injector.get(FeedBackService);
      });
  }));

  it('should  render properly', () => {
    fixture.componentInstance.ngOnInit();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('button').length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('input').length).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('textarea').length).toBe(1);
  });

  it('should hit the success callback when postFeedback returns success', fakeAsync(() => {
    const spy = spyOn(dataStub, 'postFeedback').and.returnValue(
      Observable.of({ status: 'okay' })
    );
    comp.sendFeedBack();
    fixture.detectChanges();
    expect(comp.success).toEqual(true);
    expect(spy.calls.any()).toEqual(true);
  }));

  it('should hit the error callback when postFeedback returns an error', fakeAsync(() => {
    const spy = spyOn(dataStub, 'postFeedback').and.returnValue(
      Observable.throw({ error: '' })
    );
    comp.sendFeedBack();
    fixture.detectChanges();
    expect(comp.error).toEqual(true);
    expect(spy.calls.any()).toEqual(true);
  }));

  it('should call back when goBack is called', () => {
    spyOn(window.history, 'back');
    comp.goBack();
    expect(window.history.back).toHaveBeenCalled();
  });
  it('should update status when dismiss functions are called', () => {
    comp.success = true;
    comp.error = true;
    comp.dismissError();
    comp.dismissSuccess();
    expect(comp.success).toBeFalsy();
    expect(comp.error).toBeFalsy();
  });
});
