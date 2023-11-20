import { Injectable } from "@angular/core";

@Injectable()
export class ValidateService {
  constructor() {}

  validateRegister(user) {
    if (
      user.name == undefined ||
      user.email == undefined ||
      user.username == undefined ||
      user.password == undefined
    )
      return false;
    else return true;
  }

  validateEmail(email) {
    const re =
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:a-z0-9?\.)+a-z0-9?$/;
    return re.test(email);
  }
}
