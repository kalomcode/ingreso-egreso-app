import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { take, tap } from 'rxjs/operators';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authSvc = inject(AuthService);
//   const router = inject(Router);

//   return authSvc.isAuth()
//           .pipe(
//             tap( isAuth => {
//               if (!isAuth) router.navigate(['/login']);
//             })
//           );
// };

export const authGuard: CanMatchFn = (route, state) => {
  const authSvc = inject(AuthService);
  const router = inject(Router);

  return authSvc.isAuth()
          .pipe(
            tap( isAuth => {
              if (!isAuth) router.navigate(['/login']);
            }),
            take(1)
          );
};
