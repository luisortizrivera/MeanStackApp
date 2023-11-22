import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthService {
  authToken: any = null;
  user: any = null;
  constructor(private http: HttpClient) {}

  registerUser(user) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post("users/register", user, { headers: headers })
      .pipe(map((res: any) => res));
  }

  authenticateUser(user) {
    let headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http
      .post("users/authenticate", user, {
        headers: headers,
      })
      .pipe(map((res: any) => res));
  }

  getProfile() {
    this.loadToken();
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: this.authToken,
    });
    return this.http
      .get("users/profile", { headers: headers })
      .pipe(map((res: any) => res));
  }

  loadToken() {
    const token = localStorage.getItem("id_token");
    this.authToken = token;
  }

  loggedIn() {
    this.loadToken();
    const helper = new JwtHelperService();
    return !helper.isTokenExpired(this.authToken);
  }

  storeUserData(token, user) {
    localStorage.setItem("id_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
