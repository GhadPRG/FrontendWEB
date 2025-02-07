import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (token) {
    return true;
  } else {
    // Reindirizza l'utente alla pagina di login se non c'è un token
    return router.createUrlTree(['/login']);
  }
};
