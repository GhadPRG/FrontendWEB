
export interface UserInterface {
    id?: number,
    username: string,
    password: string,
} 

export interface UserInfoInterface {
    id?: number,
    user: UserInfoInterface,
    first_name: string,
    last_name: string,
    email: string,
    birth: string,
    gender: string,
    height: number,
    weight: number,
    daily_kcalories: number,
}