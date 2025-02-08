import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {NgIf} from '@angular/common';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  isLogin = true
  authForm: FormGroup
  showPassword = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.authForm = this.createForm()
  }

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(1)]],
      confirmPassword: [""],
      firstname: [""],
      lastname: [""],
      email: ["", [Validators.email]],
      gender: [""],
      birthDate: [""],
      height: [null, [Validators.min(140)]],
      weight: [null, [Validators.min(20)]],
    })
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get("password")
      const confirmPassword = control.get("confirmPassword")

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true }
      }
      return null
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin
    this.authForm.reset()
    if (this.isLogin) {
      this.authForm.clearValidators()
      this.authForm.get("username")?.setValidators([Validators.required])
      this.authForm.get("password")?.setValidators([Validators.required, Validators.minLength(8)])
      this.authForm.get("confirmPassword")?.clearValidators()
      this.authForm.get("firstname")?.clearValidators()
      this.authForm.get("lastname")?.clearValidators()
      this.authForm.get("email")?.clearValidators()
      this.authForm.get("gender")?.clearValidators()
      this.authForm.get("birthDate")?.clearValidators()
      this.authForm.get("height")?.clearValidators()
      this.authForm.get("weight")?.clearValidators()
    } else {
      this.authForm.setValidators(this.passwordMatchValidator())
      this.authForm.get("username")?.setValidators([Validators.required])
      this.authForm.get("password")?.setValidators([Validators.required, Validators.minLength(8)])
      this.authForm.get("confirmPassword")?.setValidators([Validators.required])
      this.authForm.get("firstname")?.setValidators([Validators.required])
      this.authForm.get("lastname")?.setValidators([Validators.required])
      this.authForm.get("email")?.setValidators([Validators.required, Validators.email])
      this.authForm.get("gender")?.setValidators([Validators.required])
      this.authForm.get("birthDate")?.setValidators([Validators.required])
      this.authForm.get("height")?.setValidators([Validators.required, Validators.min(0)])
      this.authForm.get("weight")?.setValidators([Validators.required, Validators.min(0)])
    }
    this.authForm.updateValueAndValidity()
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      if (this.isLogin) {
        const loginRequest = {
          username: this.authForm.get("username")?.value,
          password: this.authForm.get("password")?.value,
        }
        this.authService.login(loginRequest).subscribe(
          (response) => {
            console.log("Login successful", response)
            this.router.navigate(["/dashboard"])
          },
          (error) => {
            console.error("Login failed", error)
          },
        )
      } else {
        const registerRequest = {
          username: this.authForm.get("username")?.value,
          password: this.authForm.get("password")?.value,
          firstname: this.authForm.get("firstname")?.value,
          lastname: this.authForm.get("lastname")?.value,
          email: this.authForm.get("email")?.value,
          gender: this.authForm.get("gender")?.value,
          birthDate: this.authForm.get("birthDate")?.value,
          height: this.authForm.get("height")?.value,
          weight: this.authForm.get("weight")?.value,
        }
        this.authService.register(registerRequest).subscribe(
          () => {
            console.log("Registration successful")
            this.isLogin = true
            this.toggleForm();
          },
          (error) => {
            console.error("Registration failed", error)
          },
        )
      }
    }
  }
}
