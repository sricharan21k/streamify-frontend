import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');
  const permittedEndpoints: string[] = [
    '/login',
    '/register',
    '/recover',
    '/validate-otp',
    '/users/check',
    '/users/password',
    '/send-otp',
  ];
  console.log('token', authToken);
  if (!permittedEndpoints.some((path) => req.url.includes(path))) {
    console.log('entered if');
    console.log('req', req.url);
    const mod = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next(mod);
  }
  return next(req);
};
