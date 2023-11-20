import { Component, OnInit } from "@angular/core";
import { ValidateService } from "../../services/validate.service";
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService
  ) {}
  ngOnInit() {}

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
    };

    if (!this.validateService.validateRegister(user)) {
      // console.log("Not all fields are filled in");
      this.flashMessage.show("Not all fields are filled in", {
        cssClass: "alert-danger",
        timeout: 3000,
      });
      return false;
    }
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show("The provided email is not valid", {
        cssClass: "alert-danger",
        timeout: 3000,
      });
      // console.log("The provided email is not valid");
      return false;
    }
  }
}
