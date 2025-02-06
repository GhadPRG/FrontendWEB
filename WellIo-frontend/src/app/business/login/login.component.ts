import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
    return this.fb.group(
      {
        username: ["", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: [""],
        firstname: [""],
        lastname: [""],
        email: ["", [Validators.email]],
        gender: [""],
        birthDate: [""],
        height: [null, [Validators.min(0)]],
        weight: [null, [Validators.min(0)]],
      },
      { validator: this.passwordMatchValidator },
    )
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get("password")?.value === g.get("confirmPassword")?.value ? null : { mismatch: true }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  toggleForm(): void {
    this.isLogin = !this.isLogin
    this.authForm.reset()
    if (this.isLogin) {
      this.authForm.get("firstname")?.clearValidators()
      this.authForm.get("lastname")?.clearValidators()
      this.authForm.get("email")?.clearValidators()
      this.authForm.get("gender")?.clearValidators()
      this.authForm.get("birthDate")?.clearValidators()
      this.authForm.get("height")?.clearValidators()
      this.authForm.get("weight")?.clearValidators()
      this.authForm.get("confirmPassword")?.clearValidators()
    } else {
      this.authForm.get("firstname")?.setValidators([Validators.required])
      this.authForm.get("lastname")?.setValidators([Validators.required])
      this.authForm.get("email")?.setValidators([Validators.required, Validators.email])
      this.authForm.get("gender")?.setValidators([Validators.required])
      this.authForm.get("birthDate")?.setValidators([Validators.required])
      this.authForm.get("height")?.setValidators([Validators.required, Validators.min(0)])
      this.authForm.get("weight")?.setValidators([Validators.required, Validators.min(0)])
      this.authForm.get("confirmPassword")?.setValidators([Validators.required])
    }
    Object.keys(this.authForm.controls).forEach((key) => {
      this.authForm.get(key)?.updateValueAndValidity()
    })
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
        this.authService.register(this.authForm.value).subscribe(
          () => {
            console.log("Registration successful")
            this.isLogin = true
            this.authForm.reset()
          },
          (error) => {
            console.error("Registration failed", error)
          },
        )
      }
    }
  }
}
