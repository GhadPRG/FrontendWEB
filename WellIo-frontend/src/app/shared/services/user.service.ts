import { Injectable } from '@angular/core';
import { UserInfoInterface } from '../utils/types/user.interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getCurrentUserInfo(): UserInfoInterface {
    return {} as UserInfoInterface;
  }
}
