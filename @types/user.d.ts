export interface signUpForm {
  email: string
  password: string
  password_confirmation: string
}

export interface signInForm {
  email: string
  password: string
}

export interface UserInfoForm {
  id: number
  name: string
  nickname: string
  image: {
    url: string
  }
  introduction: string
}
