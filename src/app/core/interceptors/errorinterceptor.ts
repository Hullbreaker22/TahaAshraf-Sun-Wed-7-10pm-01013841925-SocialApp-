import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {



  return next(req).pipe(catchError((err)=>{
    console.log('error Message from Interceptor', err.error.message);

    return throwError(()=>err)
  }))
};
