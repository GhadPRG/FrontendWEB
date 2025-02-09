import { Component } from "@angular/core"
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import { NgIf } from "@angular/common"
import { AuthService } from "../../shared/services/auth.service"
import {Router, RouterLink} from "@angular/router"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ["", [Validators.required, Validators.minLength(4)]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest = {
        username: this.loginForm.get("username")?.value,
        password: this.loginForm.get("password")?.value,
      };
      this.authService.login(loginRequest).subscribe(
        (response) => {
          console.log("Login successful", response);
          this.router.navigate(["/dashboard"]);
        },
        (error) => {
          console.error("Login failed", error);
        },
      );
    }
  }
}

