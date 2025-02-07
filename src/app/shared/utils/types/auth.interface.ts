export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  firstname: string
  lastname: string
  password: string
  email: string
  gender: "Male" | "Female" | "Other"
  birthDate: string
  height: number
  weight: number
}

export interface LoginResponse {
  token: string
}
