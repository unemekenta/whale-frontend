import { Middleware } from "@nuxt/types"

export const authenticatedMiddleware: Middleware = async ({ $axios, redirect }): Promise<void> => {
  try {
    const USER_API = "/api/v1/auth/sessions"
    const response = await $axios.$get(USER_API)
    if (response.data && !response.data.error) {
      console.log("login")
    } else {
      // this.userLogout()
      alert("ログインしてください")
      return redirect("/login")
    }
  } catch (error) {
    alert("ログインしてください")
    return redirect("/login")
  }
}

export default authenticatedMiddleware
