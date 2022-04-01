import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
// import { MessageService } from 'primeng/api';
// import { MessageService } from '@shared/services/message.service';
// import { MessageService as MessageServiceNg } from 'primeng/api';
// import { ToastService } from 'app/service/toastservice';
// import { ToastrService } from 'ngx-toastr';

export enum STATUS {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorPages = [STATUS.FORBIDDEN, STATUS.NOT_FOUND, STATUS.INTERNAL_SERVER_ERROR];

  private getMessage = (error: HttpErrorResponse) => {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.error?.msg) {
      return error.error.msg;
    }

    return `${error.status} ${error.statusText}`;
  };

  constructor(
    // private messageService: MessageService,
    private router: Router,
    // private messenger: MessageService,
    // private messengerNg: MessageServiceNg
    // private toastService: ToastService,
    // private messageService: MessageService
    private toast: ToastrService
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {    
    return next
      .handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    if (this.errorPages.includes(error.status)) {
      this.router.navigateByUrl(`/${error.status}`, {
        skipLocationChange: true,
      });
    } else {
      console.error('ERROR', error);
      this.toast.error(this.getMessage(error));
      if (error.status === STATUS.UNAUTHORIZED) {
        // this.router.navigateByUrl('/auth/login');        
        this.router.navigateByUrl('/pages/login');
      }
    }

    return throwError(error);
  }
}
