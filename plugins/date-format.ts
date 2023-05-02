export default {
  stringToISOString(date: string) {
    return new Date(date).toISOString().slice(0, -1);
  }
}
