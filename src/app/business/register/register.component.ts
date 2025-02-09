import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: ["", [Validators.required, Validators.minLength(4)]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", [Validators.required]],
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      gender: ["", [Validators.required]],
      birthDate: ["", [Validators.required]],
      height: [null, [Validators.required, Validators.min(140)]],
      weight: [null, [Validators.required, Validators.min(20)]],
    }, { validators: this.passwordMatchValidator() });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get("password");
      const confirmPassword = control.get("confirmPassword");

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword?.setErrors(null);
        return null;
      }
    };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerRequest = {
        username: this.registerForm.get("username")?.value,
        password: this.registerForm.get("password")?.value,
        firstname: this.registerForm.get("firstname")?.value,
        lastname: this.registerForm.get("lastname")?.value,
        email: this.registerForm.get("email")?.value,
        gender: this.registerForm.get("gender")?.value,
        birthDate: this.registerForm.get("birthDate")?.value,
        height: this.registerForm.get("height")?.value,
        weight: this.registerForm.get("weight")?.value,
      };
      this.authService.register(registerRequest).subscribe(
        () => {
          console.log("Registration successful");
          this.router.navigate(["/login"]);
        },
        (error) => {
          console.error("Registration failed", error);
        },
      );
    }
  }
}
