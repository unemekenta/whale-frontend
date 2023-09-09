export const logoutStorage = (): void => {
  localStorage.removeItem("access-token")
  localStorage.removeItem("client")
  localStorage.removeItem("uid")
  localStorage.removeItem("token-type")
}
