import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  if(localStorage.getItem('SocialKey')){
    req = req.clone ({
      setHeaders:{
       'AUTHORIZATION': `Bearer ${localStorage.getItem('SocialKey')}`
     }
    })
  }


  return next(req);
};
